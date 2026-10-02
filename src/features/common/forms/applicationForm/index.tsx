'use client';
import React, { useEffect, useRef, useState } from 'react';
import Step1 from './views/Step1';
import { useDashboardUser } from '@/common/context/dashboardUser';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useShallow } from 'zustand/react/shallow';
import useUserStore from '../../store';
import { ApplicationFormDefaultValues, ApplicationFormFields, ApplicationFormSchema, ApplicationFormType, customErrorMap } from './schema';
import ProgressBar from '../components/ProgressBar';
import './i18n/translations/config'; //i18
import Step2 from './views/Step2';
import Step3 from './views/Step3';
import Step4 from './views/Step4';
import Step5 from './views/Step5';
import Step6 from './views/Step6';
import Step7 from './views/Step7';
import Step8 from './views/Step8';
import Step9 from './views/Step9';
import Step10 from './views/Step10';
import { useLoading } from '@/common/context/loading';
import { useSubmitting } from '@/common/context/submitting';
import postApplicationForm from './hooks/postApplicationForm';
import { useRouter } from 'next/router';
import convertPrefilledFormRecord from './hooks/convertPrefilledFormRecord';
import Modal from 'react-modal';
import ReactModal from 'react-modal';
import postTempApplicationForm from './hooks/postTempApplicationForm';
import applicationForm_en from './i18n/translations/en.json';
import common_en from '@/libs/i18n/common/en.json';
import SubmittingSpinner from '@/components/loading/SubmittingSpinner';

const tStore = { ...applicationForm_en, ...common_en };
const getNestedProperty = (obj: any, path: string) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};
export const t = (key: string) => getNestedProperty(tStore, key);

const ApplicationForm = (props: any) => {
    const [step, setStep] = useState(1);
    const { setIsLoading } = useLoading();
    const { startSubmitting, endSubmitting } = useSubmitting();
    const { username, name, type, initUser } = useUserStore(
        useShallow((state) => ({
            username: state.username,
            name: state.name,
            knownAs: state.knownAs,
            type: state.applicationType,
            initUser: state.initUser
        }))
    );
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isDialogOpen) {
            (async () => {
                setTimeout(() => {
                    setIsDialogOpen(false);
                }, 3000);
            })();
        }
    }, [isDialogOpen]);
    //const [modalIsOpen, setModalIsOpen] = useState(false);
    // for future use on multi language
    // currently disabled
    // const { t } = useTranslation('applicationForm');
    const tStore = { ...applicationForm_en, ...common_en };
    const getNestedProperty = (obj: any, path: string) => {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };
    const t = (key: string) => getNestedProperty(tStore, key);
    //const initialLang = 'en';
    //const [locale, dispatch] = useReducer<(state: string, actions: string) => string>(langReducer, initialLang);

    const dashboardUser = useDashboardUser();
    const form = useForm<ApplicationFormType>({
        mode: 'onBlur',
        // reValidateMode: 'onChange', // works only after form submission
        defaultValues: ApplicationFormDefaultValues,
        resolver: zodResolver(ApplicationFormSchema)
    });

    const {
        formState: { errors: formatError },
        trigger,
        getValues,
        setValue,
        register,
        control,
        ...rest
    } = form;

    z.setErrorMap(customErrorMap(t));

    // Scroll to first error when there are form errors
    React.useEffect(() => {
        const errors = form.formState.errors;
        console.log(errors);
        if (Object.keys(errors).length > 0) {
            // Find the first error field
            const firstErrorField = Object.keys(errors)[0];

            // Try multiple selectors to find the error element
            let errorElement = document.querySelector(`[name="${firstErrorField}"]`);

            // If not found by name, try finding by data attributes or form field structure
            if (!errorElement) {
                // For Radix UI components, look for the form field container
                errorElement = document.querySelector(`[data-field="${firstErrorField}"]`);
            }

            // If still not found, try finding the closest form field wrapper
            if (!errorElement) {
                // Look for any element that might contain the field (like a div with the field name in its structure)
                const allElements = document.querySelectorAll('*');
                for (const element of Array.from(allElements)) {
                    if (
                        element.textContent?.includes(firstErrorField) ||
                        element.getAttribute('data-field') === firstErrorField ||
                        element.getAttribute('data-name') === firstErrorField
                    ) {
                        errorElement = element;
                        break;
                    }
                }
            }

            // Fallback: try to find the form field by looking for the label text
            if (!errorElement) {
                const labels = document.querySelectorAll('label');
                for (const label of Array.from(labels)) {
                    if (label.textContent?.toLowerCase().includes(firstErrorField.toLowerCase())) {
                        // Find the closest form field container
                        errorElement = label.closest('[class*="form"], [class*="field"], [class*="input"]') || label.parentElement;
                        break;
                    }
                }
            }

            if (errorElement) {
                console.log('Found error element:', errorElement);

                // Enhanced smooth scrolling with multiple approaches
                const scrollToElement = () => {
                    // Method 1: Use scrollIntoView with smooth behavior
                    try {
                        errorElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center',
                            inline: 'nearest'
                        });
                    } catch (error) {
                        console.log('scrollIntoView failed, trying alternative method');

                        // Method 2: Manual smooth scrolling as fallback
                        const elementRect = errorElement.getBoundingClientRect();
                        const absoluteElementTop = elementRect.top + window.pageYOffset;
                        const middle = absoluteElementTop - window.innerHeight / 2;

                        window.scrollTo({
                            top: middle,
                            behavior: 'smooth'
                        });
                    }
                };

                // Add a small delay to ensure the DOM is ready
                setTimeout(scrollToElement, 100);

                // Try to focus the element or find a focusable child
                setTimeout(() => {
                    const focusableElement = errorElement.querySelector('input, select, textarea, button, [tabindex]') || errorElement;
                    if (focusableElement instanceof HTMLElement) {
                        focusableElement.focus();
                    }
                }, 300);
            } else {
                console.log('Could not find error element for field:', firstErrorField);
            }
        }
    }, [form.formState.errors]);

    const validate = async () => {
        const values = getValues();
        const isValid = await trigger(ApplicationFormFields[step] as any); // TODO: review type
        if (isValid) return true;
        else {
            const firstErrorField = Object.keys(formatError)[0];
            const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
            if (errorElement) {
                errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return false;
        }
    };

    useEffect(() => {
        if (dashboardUser.ref) setValue('ref', dashboardUser.ref);
        if (dashboardUser.office) setValue('office.office', dashboardUser.office);
    }, [dashboardUser]);
    useEffect(() => {
        if (type) setValue('type.type', type);
    }, [type]);

    useEffect(() => {
        const handleBeforeUnload = (event: any) => {
            if (!isSubmitting) {
                event.preventDefault();
                event.returnValue = '';
            }
        };
        // mobile
        const handlePageHide = (event: PageTransitionEvent) => {
            if (!isSubmitting) {
                event.preventDefault();
                alert('Please save your progress before leaving the page.');
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('pagehide', handlePageHide);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('pagehide', handlePageHide);
        };
    }, [isSubmitting]);
    // load prefilled data
    const [isModalOpen, setIsModalOpen] = useState(false);
    useEffect(() => {
        if (props.repo?.prefilledFormRecord) {
            setIsModalOpen(true);
        }
    }, []);
    const handleModalResponse = async (isResume: boolean) => {
        if (!isResume) {
            if (!window.confirm('Are you sure you want to delete your progress and start from scratch?')) {
                return;
            } else {
                setIsModalOpen(false);
                startSubmitting();
                try {
                    await postTempApplicationForm(null as unknown as ApplicationFormType, dashboardUser.ref || '0', 10); // step 10 to delete progress. TODO: review type
                } catch (error) {
                    console.error('Failed to delete progress:', error);
                } finally {
                    endSubmitting();
                }
                return;
            }
        } else if (isResume) {
            const data = props.repo.prefilledFormRecord;
            convertPrefilledFormRecord(data, setValue);
            //debugger;
            setStep(parseInt(data['currentStep'].value) || 1);
            setIsModalOpen(false);
        } else {
            // Handle starting from scratch if needed
            // For example, reset the form
        }
    };
    useEffect(() => {
        // for modal
        ReactModal.setAppElement('#__next');
    }, []);

    const router = useRouter();
    const onSubmit = async (e: any) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const valid = await validate();
            if (!valid) {
                return;
            }

            if (!window.confirm('Do you want to submit?')) {
                return;
            }

            const values = getValues();

            const res = await postApplicationForm(values, dashboardUser.ref || undefined);
            if (res) {
                await postTempApplicationForm(values, dashboardUser.ref || '0', step);
                alert('Your form has been submitted!');
                window.location.reload();
            } else {
                alert('Failed to submit the form. Please try again.');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            alert('Failed to submit the form. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };
    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)'
        }
    };
    //
    const handleSaveExit = async () => {
        startSubmitting();
        try {
            await postTempApplicationForm(getValues(), dashboardUser.ref || '0', step, true);
            router.push('/apply');
        } catch (error) {
            console.error('Failed to save and exit:', error);
        } finally {
            endSubmitting();
        }
    };

    const handleNext = async () => {
        console.log('getValues()', getValues());
        const valid = await validate();
        if (valid) {
            // temp save
            // startSubmitting();
            try {
                setStep(step + 1);
                setIsDialogOpen(true);
                setTimeout(() => {
                    scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 0);
                await postTempApplicationForm(getValues(), dashboardUser.ref || '0', step);
            } catch (error) {
                console.error('Failed to save progress:', error);
            } finally {
                // endSubmitting();
            }
        }
    };
    const handleBack = () => {
        setStep(step - 1);
        setTimeout(() => {
            scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }, 100);
    };
    return (
        <>
            <SubmittingSpinner isVisible={isSubmitting} />
            <div className="application-form flex flex-col items-center justify-center pt-8 m-4 md:p-0">
                <div
                    className={`absolute top-20 right-2 md:right-20 bg-[#012c66] font-bold opacity-80 rounded-md text-white p-4 ${
                        isDialogOpen ? 'max-w-40 block' : 'max-w-0 hidden'
                    } transition-all duration-500 ease-in overflow-hidden`}
                >
                    <p>Progress Saved</p>
                </div>
                <Modal isOpen={isModalOpen} style={customStyles}>
                    <div className="text-black flex flex-col text-center">
                        <h1 className="text-xl font-semibold">There is a saved record of your progress.</h1>
                        <button className="btn" onClick={() => handleModalResponse(true)}>
                            Resume from the saved point.
                        </button>
                        <button className="mt-10 underline" onClick={() => handleModalResponse(false)}>
                            Delete your progress and start from scratch
                        </button>
                    </div>
                </Modal>
                <div className="" ref={scrollRef}>
                    <form
                        // onSubmit={(e) => onSubmit(e)}
                        className="flex flex-col h-fit my-14 p-6 md:p-10 max-w-[90vw] md:w-[50rem] md:max-w-screen bg-gray-50 border rounded-md"
                    >
                        <ProgressBar steps={10} setStep={setStep} currentStep={step} />
                        {step == 1 && <Step1 register={register} getValues={getValues} errors={formatError} t={t} control={control} />}
                        {step == 2 && <Step2 register={register} getValues={getValues} errors={formatError} t={t} />}
                        {step == 3 && <Step3 register={register} getValues={getValues} errors={formatError} t={t} />}
                        {step == 4 && <Step4 register={register} getValues={getValues} errors={formatError} t={t} control={control} type={type} />}
                        {step == 5 && <Step5 register={register} getValues={getValues} errors={formatError} t={t} control={control} />}
                        {step == 6 && <Step6 register={register} getValues={getValues} errors={formatError} t={t} />}
                        {step == 7 && <Step7 register={register} getValues={getValues} errors={formatError} t={t} control={control} />}
                        {step == 8 && <Step8 register={register} getValues={getValues} errors={formatError} t={t} control={control} />}
                        {step == 9 && <Step9 register={register} getValues={getValues} errors={formatError} t={t} type={dashboardUser.type} />}
                        {step == 10 && <Step10 register={register} getValues={getValues} errors={formatError} t={t} control={control} />}
                        {step != 10 && (
                            <button type="button" onClick={handleNext} className="btn-wide">
                                {t('system.next')}
                            </button>
                        )}
                        {step == 10 && (
                            <button type="button" onClick={onSubmit} className="btn-wide">
                                {t('system.submit')}
                            </button>
                        )}
                        {step != 1 && (
                            <button type="button" onClick={handleBack} className="btn-wide">
                                {t('system.back')}
                            </button>
                        )}
                        {step != 10 && (
                            <button
                                type="button"
                                className="bg-gray-500 border rounded-full text-white px-5 py-1.5 self-center m-6 delay-75 ease-out duration-75 font-bold mt-6 max-w-full md:max-w-xs cursor-pointer"
                                onClick={() => handleSaveExit()}
                            >
                                Save & Exit
                            </button>
                        )}
                    </form>
                </div>
            </div>
        </>
    );
};

export default ApplicationForm;
