'use client';
// Import necessary modules from React
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { destroyCookie, parseCookies } from 'nookies';

import postReview from '@/common/checklist/postReview';
import { useDashboardUser } from '@/common/context/dashboardUser';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { KintoneUserName, KintonePassword, VolunteerApplicationAppID, OnlineVolunteerApplicationAppID } from '@/common/env';
import { KintoneRestAPIClient } from '@kintone/rest-api-client';
import { REST_OnlineVolunteerApplication } from '@/types/OnlineVolunteerApplication';
import ReactModal from 'react-modal';
import Helper from '@/components/modal/helper';
import { REST_VolunteerApplicationForm } from '@/types/VolunteerApplicationForm';
import GreenCheckMark from '@/components/icons/GreenCheckMark';
import ArrowUpRight from '@/components/icons/ArrowUpRight';
import logError from '@/common/logError';
import RateUs from '@/components/modal/RateUs';
import TransitionLink from '@/components/pageTransition/TransitionLink';
import useUserStore from '@/features/common/store';
import { useShallow } from 'zustand/react/shallow';
import { motion } from 'framer-motion';
import Image from 'next/image';

import Typewriter from 'typewriter-effect';
import ReferenceProgress from '@/components/modal/ReferenceProgress';
import { usePageTransition } from '@/common/context/pageTransition';

// application steps that matches the kintone app
export type ApplicationStepsMasterApp =
    | 'Applying'
    | 'Complete Application Form'
    | 'Necessary Documents Submitted'
    | 'National Office Review'
    | 'SDD Review'
    | 'Accepted'
    | 'Rejected';
export const applicationStepsMasterApp = {
    Applying: 0,
    'Complete Application Form': 1,
    'Necessary Documents Submitted': 2,
    'National Office Review': 3,
    'SDD Review': 4,
    Accepted: 5,
    Rejected: 6
};
export type ApplicationSteps = 'reviewWebsite' | 'submitApplication' | 'submitDocuments' | 'complete';
export const applicationSteps = {
    reviewWebsite: 0,
    submitApplication: 1,
    submitDocuments: 2,
    complete: 3
};
export const handleLogout = () => {
    destroyCookie({}, 'auth', {
        path: '/' // THE KEY IS TO SET THE SAME PATH
    });
    destroyCookie({}, 'ref', {
        path: '/' // THE KEY IS TO SET THE SAME PATH
    });
    destroyCookie({}, 'isZealous', {
        path: '/' // THE KEY IS TO SET THE SAME PATH
    });
    location.reload();
};
// TODO: review validation and return val
export const handleCheckListClick = async (field: string, userRef: string) => {
    await postReview(field, userRef);
    location.reload();
};

// Define the functional component Page
const Page = ({ repo }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const pageTransition = usePageTransition();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isZealousModalOpen, setIsZealousModalOpen] = useState(false);
    const [isReferenceModalOpen, setIsReferenceModalOpen] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [aboutDone, setAboutDone] = useState(repo?.reviewAbout === 'ok');
    const [faqDone, setFaqDone] = useState(repo?.reviewFaq === 'ok');
    const [isClient, setIsClient] = useState(false);
    const dashboardUser = useDashboardUser();
    const userRef = dashboardUser.ref;
    const initialBodyOverflowRef = useRef<string | null>(null);

    useEffect(() => {
        // Use a more robust client-side detection
        if (typeof window !== 'undefined') {
            setIsClient(true);
        }
    }, []);

    useEffect(() => {
        if (dashboardUser.isLoggedIn) {
            // Only end transition on client side
            if (typeof window !== 'undefined') {
                pageTransition.endTransition();
            }
        }
    }, [dashboardUser]);
    // helper modal
    const [currentStep, setCurrentStep] = useState<ApplicationSteps>('reviewWebsite');
    const setIsComplete = async (ref: string | undefined, isComplete: boolean) => {
        if (!ref) return;
        const body = {
            userRef: ref,
            isComplete
        };
        const res = await fetch('/api/application/checklist/postIsComplete', {
            method: 'POST',
            body: JSON.stringify(body)
        });
        if (res.ok) {
            return res;
        } else {
            throw new Error('Failed to edit Kintone record');
        }
    };
    useEffect(() => {
        if (!repo || !dashboardUser.isLoggedIn) return;
        const formSubmission = dashboardUser.formSubmission ?? [];
        const hasApplicationForm = formSubmission.includes('Application Form Completed');
        const hasHealthQuestionnaire = formSubmission.includes('Personal Health Questionnaire');

        let nextStep: ApplicationSteps;
        if (repo.reviewAbout !== 'ok' || repo.reviewFaq !== 'ok') {
            nextStep = 'reviewWebsite';
        } else if (!hasApplicationForm || !hasHealthQuestionnaire) {
            // Application form and Personal Health Questionnaire are both required
            nextStep = 'submitApplication';
        } else if (!repo.allDocumentsSubmitted) {
            nextStep = 'submitDocuments';
        } else {
            nextStep = 'complete';
        }
        setCurrentStep(nextStep);

        if (!dashboardUser.ref) return;
        if (nextStep === 'complete' && !repo.isComplete) {
            setIsModalOpen(true);
            setIsComplete(dashboardUser.ref, true);
        } else if (nextStep !== 'complete' && repo.isComplete) {
            // Correct stale isComplete when required steps are still missing
            setIsComplete(dashboardUser.ref, false);
        }
    }, [dashboardUser]);
    const needsRevieWebsite = currentStep == 'reviewWebsite' ? true : false;
    useEffect(() => {
        // for modal
        ReactModal.setAppElement('#__next');
    }, []);
    const buttonProps = (availableOn: ApplicationSteps) => ({
        className: `${applicationSteps[availableOn] <= applicationSteps[currentStep] ? 'btn' : 'btn-disabled pointer-events-none'}`,
        'aria-disabled': needsRevieWebsite,
        tabIndex: needsRevieWebsite ? -1 : undefined
    });
    const Check = () => (
        <div className="absolute right-[-0.5rem]">
            <GreenCheckMark height={30} width={30} />
        </div>
    );
    const handleReviewClick = async (field: 'reviewAbout' | 'reviewFaq') => {
        if (!userRef) return;
        const willAboutBeDone = field === 'reviewAbout' ? true : aboutDone;
        const willFaqBeDone = field === 'reviewFaq' ? true : faqDone;
        // optimistic UI: turn the check mark green immediately
        if (field === 'reviewAbout') setAboutDone(true);
        else setFaqDone(true);
        try {
            await postReview(field, userRef);
        } catch (e) {
            logError(e, null, 'apply/handleReviewClick');
        }
        // once both links have been reviewed, refresh so the application steps unlock
        if (willAboutBeDone && willFaqBeDone) {
            location.reload();
        }
    };
    const { username, name, type, initUser } = useUserStore(
        useShallow((state) => ({
            username: state.username,
            name: state.name,
            knownAs: state.knownAs,
            type: state.applicationType,
            initUser: state.initUser
        }))
    );
    const knownAs = useUserStore((state) => state.knownAs);
    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Keep global CSS as the source of truth unless a modal is open.
        if (initialBodyOverflowRef.current === null) {
            initialBodyOverflowRef.current = document.body.style.overflow ?? '';
        }

        const isAnyModalOpen = isModalOpen || isZealousModalOpen || isReferenceModalOpen;
        if (isAnyModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = initialBodyOverflowRef.current;
        }

        return () => {
            // Prevent leaking inline overflow styles across route changes.
            if (initialBodyOverflowRef.current !== null) {
                document.body.style.overflow = initialBodyOverflowRef.current;
            }
        };
    }, [isModalOpen, isZealousModalOpen, isReferenceModalOpen]);

    interface ModalProps {
        isVisible: boolean;
        onClose: () => void;
        children: React.ReactNode;
    }

    const Modal: React.FC<ModalProps> = ({ isVisible, onClose, children }) => {
        if (!isVisible) return null;

        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed top-0 inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                    className="rounded flex flex-col justify-center items-center"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button onClick={onClose} className="mt-4 p-2 bg-red-500 text-white rounded-full w-10 h-10">
                        ✕
                    </button>
                    {children}
                </motion.div>
            </motion.div>
        );
    };

    const WelcomeText = () => {
        const [isOnEffect, setIsOnEffect] = useState(true);
        return (
            <div className="text-xl my-8">
                {username && (
                    <>
                        {isOnEffect ? (
                            <Typewriter
                                options={{ delay: 75 }}
                                onInit={(typewriter) => {
                                    typewriter
                                        .pauseFor(500)
                                        .typeString(`Welcome${currentStep != 'reviewWebsite' ? ' back' : ''} ${knownAs || name || ''}!`)
                                        .start()
                                        .pauseFor(500)
                                        .callFunction(() => {
                                            setIsOnEffect(false);
                                        });
                                }}
                            />
                        ) : (
                            <>
                                Welcome{currentStep != 'reviewWebsite' ? ' back' : ''} {knownAs || name || ''}!
                                <span className="w-1 opacity-0">|</span>
                            </>
                        )}
                    </>
                )}
            </div>
        );
    };
    return (
        <>
            <Modal isVisible={isZealousModalOpen} onClose={() => setIsZealousModalOpen(false)}>
                <div className="p-4 max-h-[80svh] max-w-[1000px] overflow-auto relative">
                    <div className="relative w-full h-full min-h-[300px]">
                        <Image src="/images/zealous/cover.jpg" alt="info" width={1000} height={1000} />
                    </div>
                </div>
            </Modal>
            {/* <div className=" font-[font-name]">zealous project</div> */}
            {repo && (
                <>
                    <>
                        {/* TODO: vara text on background
            {isLoaded && (
                <div className="fixed h-full w-full flex justify-center z-[-1]">
                    <VaraText />
                </div>
            )} */}
                        <>
                            {isClient && userRef ? (
                                <>
                                    <div className="flex flex-col h-fit items-center justify-center w-full my-14">
                                        {type == 'Zealous' && (
                                            <div className="flex pt-10">
                                                <h1 className="text-xl font-mono">ZProject Application </h1>
                                                <div className="relative">
                                                    <div className="absolute pl-1 cursor-pointer" onClick={() => setIsZealousModalOpen(true)}>
                                                        <svg
                                                            width="32px"
                                                            height="32px"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            //stroke="#ffffff"
                                                        >
                                                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                                            <g id="SVGRepo_iconCarrier">
                                                                <path
                                                                    fill-rule="evenodd"
                                                                    clip-rule="evenodd"
                                                                    d="M10.661 7.86213C10.4142 8.04749 10.25 8.31328 10.25 8.75C10.25 9.30228 9.80229 9.75 9.25 9.75C8.69772 9.75 8.25 9.30228 8.25 8.75C8.25 7.68672 8.70818 6.82751 9.46005 6.26288C10.1787 5.72317 11.0967 5.5 12 5.5C13.0779 5.5 13.987 5.82418 14.6436 6.44499C15.2951 7.06101 15.6046 7.88116 15.6531 8.7005C15.7483 10.3042 14.864 12.0687 13.2461 12.9932C13.099 13.0773 13.008 13.1462 12.9529 13.1958C13.0783 13.5886 12.9509 14.0345 12.6034 14.2974C12.163 14.6307 11.5359 14.5438 11.2026 14.1034C11.2026 14.1034 11.2031 14.1041 11.2016 14.1021L11.2005 14.1007C10.9606 13.778 10.865 13.355 10.9137 12.9585C10.9974 12.277 11.4727 11.7031 12.2539 11.2568C13.2157 10.7071 13.7065 9.65911 13.6567 8.8189C13.6328 8.41625 13.4898 8.10656 13.2695 7.89822C13.0542 7.69468 12.6721 7.5 12 7.5C11.3981 7.5 10.9411 7.65183 10.661 7.86213Z"
                                                                    fill="#ffffff"
                                                                ></path>{' '}
                                                                <path
                                                                    d="M12 18.5C12.8284 18.5 13.5 17.8284 13.5 17C13.5 16.1716 12.8284 15.5 12 15.5C11.1716 15.5 10.5 16.1716 10.5 17C10.5 17.8284 11.1716 18.5 12 18.5Z"
                                                                    fill="#ffffff"
                                                                ></path>{' '}
                                                                <path
                                                                    fill-rule="evenodd"
                                                                    clip-rule="evenodd"
                                                                    d="M1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3Z"
                                                                    fill="#ffffff"
                                                                ></path>{' '}
                                                            </g>
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        <WelcomeText />
                                        {needsRevieWebsite && (
                                            <button className="btn" onClick={() => setIsReviewModalOpen(true)}>
                                                Start Application
                                            </button>
                                        )}
                                        <Modal isVisible={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)}>
                                            <div className="bg-white text-black rounded-lg p-6 w-[90vw] max-w-md shadow-xl">
                                                <h2 className="text-lg font-semibold mb-1">Before you start</h2>
                                                <p className="text-sm text-gray-600 mb-4">
                                                    Please review both pages below to begin your application.
                                                </p>
                                                {(type == 'Zealous'
                                                    ? [
                                                          {
                                                              field: 'reviewAbout' as const,
                                                              label: 'About Zealous Project',
                                                              href: 'https://www.bridgesforpeace.com/zealous82/about_z82',
                                                              done: aboutDone
                                                          },
                                                          {
                                                              field: 'reviewFaq' as const,
                                                              label: 'ZProject FAQ',
                                                              href: 'https://www.bridgesforpeace.com/zealous82/zealous-zproject-home#faq',
                                                              done: faqDone
                                                          }
                                                      ]
                                                    : [
                                                          {
                                                              field: 'reviewAbout' as const,
                                                              label: 'About Bridges for Peace',
                                                              href: 'https://www.bridgesforpeace.com/about',
                                                              done: aboutDone
                                                          },
                                                          {
                                                              field: 'reviewFaq' as const,
                                                              label: 'Frequently Asked Questions',
                                                              href: 'https://www.bridgesforpeace.com/volunteer#faq',
                                                              done: faqDone
                                                          }
                                                      ]
                                                ).map((item) => (
                                                    <div key={item.field} className="flex items-center justify-between gap-3 py-2">
                                                        <Link
                                                            href={item.href}
                                                            className="flex items-center text-blue-600 hover:underline"
                                                            target="_blank"
                                                            onClick={() => handleReviewClick(item.field)}
                                                        >
                                                            {item.label}
                                                            <ArrowUpRight />
                                                        </Link>
                                                        <GreenCheckMark
                                                            height={28}
                                                            width={28}
                                                            color={item.done ? '#17c200' : '#9ca3af'}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </Modal>
                                        {!needsRevieWebsite && (
                                            <>
                                                <div className="relative flex items-center">
                                                    <TransitionLink href="/apply/form" {...buttonProps('submitApplication')}>
                                                        Online Application Form
                                                    </TransitionLink>
                                                    {dashboardUser.formSubmission?.includes('Application Form Completed') && <Check />}
                                                </div>
                                                {type == 'Zealous' && (
                                                    <div className="relative flex items-center">
                                                        <TransitionLink href="/apply/financial-obligation" {...buttonProps('submitApplication')}>
                                                            Financial Obligation Policy
                                                        </TransitionLink>
                                                        {repo?.financialObligationSubmitted && <Check />}
                                                    </div>
                                                )}
                                                <div className="relative flex items-center">
                                                    <TransitionLink href="/apply/health-questionnaire" {...buttonProps('submitApplication')}>
                                                        Personal Health Questionnaire
                                                    </TransitionLink>
                                                    {dashboardUser.formSubmission?.includes('Personal Health Questionnaire') && <Check />}
                                                </div>
                                                <div className="relative flex items-center">
                                                    <TransitionLink href="/apply/documents" {...buttonProps('submitApplication')}>
                                                        Submit Necessary Documents
                                                    </TransitionLink>
                                                    {repo?.allDocumentsSubmitted && <Check />}
                                                </div>
                                                <div className="relative flex items-center">
                                                    <ReferenceProgress
                                                        referenceCount={repo?.referenceCount || 0}
                                                        referenceRequired={type == 'Short Term' ? 3 : 4}
                                                        isModalOpen={isReferenceModalOpen}
                                                        setIsModalOpen={setIsReferenceModalOpen}
                                                        buttonProps={buttonProps('submitApplication')}
                                                    />
                                                    {repo?.referenceCount == (type == 'Short Term' ? 3 : 4) && <Check />}
                                                </div>
                                            </>
                                        )}
                                        <Helper
                                            currentStep={currentStep}
                                            userRef={userRef}
                                            isModalOpen={isModalOpen}
                                            setIsModalOpen={setIsModalOpen}
                                        />
                                        {currentStep == 'complete' && <RateUs />}
                                        <Link href="/contact" className="btn">
                                            Contact Us
                                        </Link>
                                        <button className="btn" onClick={handleLogout}>
                                            Log out
                                        </button>
                                        <footer className="text-center mt-4 text-sm text-gray-200">
                                            <div className="flex flex-col items-center justify-center mb-2">
                                                <Link href="/apply/privacy-policy" className="link">
                                                    Privacy Policy
                                                </Link>
                                            </div>
                                            &copy; {new Date().getFullYear()} Bridges for Peace. All rights reserved.
                                        </footer>
                                    </div>
                                </>
                            ) : null}
                        </>
                    </>
                </>
            )}
        </>
    );
};

// Export the component for use in other files
export default Page;

type Repo = {
    reviewAbout: string | null;
    reviewFaq: string | null;
    allDocumentsSubmitted: boolean;
    isComplete: boolean;
    financialObligationSubmitted: boolean;
    isZealous: boolean;
    referenceCount: number;
};
export const getServerSideProps = (async (context) => {
    try {
        const cookies = parseCookies(context);
        if (typeof cookies.auth == 'undefined') return { props: {} };
        const client = new KintoneRestAPIClient({
            baseUrl: 'https://bfp.kintone.com',
            auth: {
                username: KintoneUserName,
                password: KintonePassword
            }
        });
        let resp = await client.record
            .getRecord<REST_OnlineVolunteerApplication>({
                app: OnlineVolunteerApplicationAppID as string,
                id: cookies.ref
            })
            .catch((e) => {
                // if no record found with the cookie ref, delete the cookie and return
                destroyCookie(context, 'auth', {
                    path: '/' // THE KEY IS TO SET THE SAME PATH
                });
                destroyCookie(context, 'ref', {
                    path: '/' // THE KEY IS TO SET THE SAME PATH
                });
                // redirect to login page on server side
                context.res.writeHead(302, { Location: '/apply/login' });
                return undefined;
            });
        const resp2 = await client.record
            .getAllRecords<REST_VolunteerApplicationForm>({
                app: VolunteerApplicationAppID as string,
                condition: `ref="${cookies.ref}" and currentStep = "Complete"`
            })
            .catch((e) => {
                throw new Error('resp2:' + e);
            });
        if (!resp) return { props: {} };
        // check if it needs to update the formSubmission on Online Volunteer Application record
        if (resp2.length > 0) {
            if (resp.record['formSubmission'].value.findIndex((arr) => arr == 'Application Form Completed') == -1) {
                await client.record.updateRecord({
                    app: OnlineVolunteerApplicationAppID as string,
                    id: cookies.ref,
                    record: {
                        formSubmission: { value: [...resp.record['formSubmission'].value, 'Application Form Completed'] }
                    }
                });
                resp = await client.record
                    .getRecord<REST_OnlineVolunteerApplication>({
                        app: OnlineVolunteerApplicationAppID as string,
                        id: cookies.ref
                    })
                    .catch((e) => {
                        throw new Error('resp_2:' + e);
                    });
            }
            // update status
            if (
                applicationStepsMasterApp[resp.record['status'].value as ApplicationStepsMasterApp] <
                applicationStepsMasterApp['Complete Application Form']
            ) {
                await client.record
                    .updateRecord({
                        app: OnlineVolunteerApplicationAppID as string,
                        id: cookies.ref,
                        record: {
                            status: { value: 'Complete Application Form' }
                        }
                    })
                    .catch((e) => {
                        throw new Error('updateRecord:' + e);
                    });
            }
        }
        // if not yet completed the documents
        // documents submission
        const isAllDocumentsSubmitted = resp.record['formSubmission'].value.includes('Necessary Documents');
        if (isAllDocumentsSubmitted) {
            // update status
            if (
                applicationStepsMasterApp[resp.record['status'].value as ApplicationStepsMasterApp] <
                applicationStepsMasterApp['Necessary Documents Submitted']
            ) {
                await client.record
                    .updateRecord({
                        app: OnlineVolunteerApplicationAppID as string,
                        id: cookies.ref,
                        record: {
                            status: { value: 'Necessary Documents Submitted' }
                        }
                    })
                    .catch((e) => {
                        throw new Error('updateRecord_2:' + e);
                    });
            }
        }
        // financial obligation for zealous
        const resp3 = await client.record.getAllRecords({
            app: 82,
            condition: `ref="${cookies.ref}"`
        });
        const repo: Repo = {
            reviewAbout: resp.record['reviewAbout'].value[0] || null,
            reviewFaq: resp.record['reviewFaq'].value[0] || null,
            allDocumentsSubmitted: isAllDocumentsSubmitted,
            isComplete: resp.record['isComplete'].value == 'true' || false,
            financialObligationSubmitted: resp3.length > 0 ? true : false,
            isZealous: resp.record['type'].value == 'Zealous',
            referenceCount: parseInt(resp.record['referenceCount'].value) || 0
        };

        // Pass data to the page via props
        return { props: { repo } };
    } catch (e) {
        logError(e, null, 'apply/getServerSideProps');
        return { props: {} };
    }
}) satisfies GetServerSideProps<{ repo: Repo } | {}>;
