'use client';
// Import necessary modules from React
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useDashboardUser } from '@/common/context/dashboardUser';
import GreenCheckMark from '@/components/icons/GreenCheckMark';
import useUserStore from '@/features/common/store';
import ArrowUpRight from '@/components/icons/ArrowUpRight';
import logError from '@/common/logError';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { parseCookies } from 'nookies';
import { KintoneRestAPIClient } from '@kintone/rest-api-client';
import kintoneClient from '@/common/kintoneClient';
import { REST_SavedVolunteerApplicationForm } from '@/types/VolunteerApplicationForm';
import { NecessaryDocuments, isSpouseLetterRequiredValue, Necessary_Documents_USA, Spouse_Letter_Field } from '@/constants/necessaryDocuments';
import { OnlineVolunteerApplicationAppID, VolunteerApplicationAppID } from '@/common/env';
import { REST_OnlineVolunteerApplication } from '@/types/OnlineVolunteerApplication';
import { usePageTransition } from '@/common/context/pageTransition';

const Check = () => (
    <div className="absolute right-[-2.5rem]">
        <GreenCheckMark height={30} />
    </div>
);

const Documents = ({ repo }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const user = useUserStore((state) => state);
    const office = useUserStore((state) => state.nationalOffice);
    const type = useUserStore((state) => state.applicationType);
    const initUser = useUserStore((state) => state.initUser);
    const pageTransition = usePageTransition();
    useEffect(() => {
        (async () => {
            await initUser(user.username, user.ref);
        })();
    }, []);
    useEffect(() => {
        // End page transition after component mounts and data is loaded
        // Timing matches the slide animation duration
        if (repo) {
            setTimeout(() => {
                pageTransition.endTransition();
            }); // Match the slide animation duration + buffer
        }
    }, [repo]);

    const isSubmitted = (document: NecessaryDocuments) => repo?.submittedDocuments?.includes(document);

    const uploadsArray: NecessaryDocuments[] = ['passport', 'recentPhoto'];
    if (office == 'USA') uploadsArray.push('ssn');
    if (repo?.isSpouseLetterRequired) uploadsArray.push('spouseLetter');
    const medicalFormArray = ['medicalStatusForm', 'doctorLetter'] as const;
    const criminalCheckArray = ['criminalCheck', 'criminalCheckApostille'] as const;
    const requiredDocumentsCount = () => {
        if (!type || !office) return '-';
        if (type == 'Short Term') return uploadsArray.length + medicalFormArray.length;
        if (type == 'Long Term' || type == 'Zealous') return uploadsArray.length + medicalFormArray.length + criminalCheckArray.length;
        else return '-';
    };

    if (!office) return <></>;
    return (
        <>
            <div className="relative flex flex-col items-center justify-center min-h-screen py-10 text-white overflow-hidden">
                {/* Content */}
                <div className="relative flex flex-col items-center justify-center text-center">
                    <h1 className="text-2xl mt-12 mb-8">Documents Submission</h1>
                    <h1 className="text-xl mb-4">
                        {repo?.submittedDocuments?.length}/{requiredDocumentsCount()} Completed
                    </h1>
                    <div className="relative flex flex-col items-center justify-center text-center w-96 max-w-[90svw] bg-opacity-20 bg-gray-50 p-8 m-4 rounded-xl">
                        <div className="flex">
                            <div className="flex self-center m-4 text-xl">
                                Uploads {uploadsArray.filter((element) => repo?.submittedDocuments?.includes(element)).length}/{uploadsArray.length}{' '}
                                Completed
                            </div>
                        </div>
                        <div className="relative flex items-center">
                            <Link href="./documents/passport" className="btn">
                                Copy of Passport
                            </Link>
                            {isSubmitted('passport') && <Check />}
                        </div>

                        <div className="relative flex items-center">
                            <Link href="./documents/recent-photo" className="btn">
                                Recent Photo
                            </Link>
                            {isSubmitted('recentPhoto') && <Check />}
                        </div>
                        {office == 'USA' && (
                            <div className="relative flex items-center">
                                <Link href="./documents/social-security-card" className="btn">
                                    Social Security Card
                                </Link>
                                {isSubmitted('ssn') && <Check />}
                            </div>
                        )}
                        {repo?.isSpouseLetterRequired && (
                            <div className="relative flex items-center">
                                <Link href="./documents/spouse-letter" className="btn">
                                    Spouse Letter
                                </Link>
                                {isSubmitted('spouseLetter') && <Check />}
                            </div>
                        )}
                        {/* <h1 className="text-xl my-10">
                            {loginrepo?.submittedDocuments?.length || '-'}/{requiredDocumentsCount()} Completed
                        </h1> */}
                    </div>
                    <div className="relative flex flex-col items-center justify-center text-center w-96 max-w-[90svw] bg-opacity-20 bg-gray-50 p-8 m-4 rounded-xl">
                        <div className="flex">
                            <div className="flex self-center my-4 text-xl">
                                Medical Form {medicalFormArray.filter((element) => repo?.submittedDocuments?.includes(element)).length}/
                                {medicalFormArray.length} Completed
                            </div>
                        </div>
                        <div className="flex justify-center mt-4">
                            <Link href="./documents/medical-form/example" className="flex hover:text-blue-400 hover:to-blue-100">
                                How to complete Medical Form?
                                <ArrowUpRight />
                            </Link>
                        </div>

                        <div className="relative flex items-center">
                            <Link href="./documents/medical-form" className="btn">
                                Medical Status Form
                            </Link>
                            {isSubmitted('medicalStatusForm') && <Check />}
                        </div>
                        <div className="flex justify-center">
                            <a href="/files/Medical Form 2022.pdf" download="Medical Status Form.pdf" className="link">
                                Download Medical Status Form
                            </a>
                        </div>
                        <div className="relative flex items-center">
                            <Link href="./documents/doctor-letter" className="btn">
                                Doctor's Letter
                            </Link>
                            {isSubmitted('doctorLetter') && <Check />}
                        </div>
                        <div className="flex justify-center">
                            <a href="/files/Sample Medical Letter.pdf" download className="link">
                                Download Sample Doctor's Letter
                            </a>
                        </div>
                    </div>
                    {type == 'Short Term' || (
                        <div className="relative flex flex-col items-center justify-center text-center w-96 max-w-[90svw] bg-opacity-20 bg-gray-50 p-8 m-4 rounded-xl">
                            <div className="flex">
                                <div className="flex self-center m-4 text-xl">
                                    Criminal Check {criminalCheckArray.filter((element) => repo?.submittedDocuments?.includes(element)).length}/
                                    {criminalCheckArray.length} Completed
                                </div>
                            </div>
                            <div className="flex justify-center mt-4">
                                <Link href="./documents/criminal-check/example" className="flex hover:text-blue-400 hover:to-blue-100">
                                    How to complete Criminal Check?
                                    <ArrowUpRight />
                                </Link>
                            </div>

                            <>
                                <div className="relative flex items-center">
                                    <Link href="./documents/criminal-check" className="btn">
                                        {office == 'USA' ? 'FBI Criminal Background Check' : 'Criminal Check'}
                                    </Link>
                                    {isSubmitted('criminalCheck') && <Check />}
                                </div>
                                <div className="relative flex items-center">
                                    <Link href="./documents/criminal-check-apostille" className="btn">
                                        {office == 'USA' ? 'FBI Criminal Background Check Apostille' : 'Criminal Check Apostille'}
                                    </Link>
                                    {isSubmitted('criminalCheckApostille') && <Check />}
                                </div>
                            </>
                        </div>
                    )}
                    <div className="relative flex items-center">
                        <Link href="/contact" className="btn">
                            Needs Help? Contact Us
                        </Link>
                    </div>
                    <div className="relative flex items-center mb-8">
                        <Link href="/apply" className="btn">
                            Return to Home
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

// Export the component for use in other files
export default Documents;

type Repo = {
    submittedDocuments: string[];
    isSpouseLetterRequired: boolean;
};
export const getServerSideProps = (async (context) => {
    try {
        const cookies = parseCookies(context);
        const ref = cookies.ref || null;
        if (ref) {
            const [applicationFormRecord, onlineApplication] = await Promise.all([
                kintoneClient.record.getAllRecords<REST_SavedVolunteerApplicationForm>({
                    app: VolunteerApplicationAppID as string,
                    condition: `ref="${ref}"`
                }),
                kintoneClient.record.getRecord<REST_OnlineVolunteerApplication>({
                    app: OnlineVolunteerApplicationAppID as string,
                    id: ref
                })
            ]);
            const isSpouseLetterRequired = isSpouseLetterRequiredValue(onlineApplication.record.isSpouseLetterRequired?.value);
            const documentFields = isSpouseLetterRequired ? [...Necessary_Documents_USA, Spouse_Letter_Field] : Necessary_Documents_USA;
            return {
                props: {
                    repo: {
                        isSpouseLetterRequired,
                        submittedDocuments: documentFields.filter((doc) => applicationFormRecord[0][doc].value[0])
                    }
                }
            };
        } else
            return {
                props: {} // Return empty props if ref is not found
            };
    } catch (e) {
        logError(e, context, 'getServerSideProps');
        return { props: {} };
    }
}) satisfies GetServerSideProps<{ repo: Repo } | {}>;
