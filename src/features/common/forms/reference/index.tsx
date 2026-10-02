'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useReducer } from 'react';
import { langReducer } from './i18n/lang';
import { ReferenceFormDefaultValues, ReferenceFormFields, ReferenceFormSchema, ReferenceFormType } from './schema';

import './i18n/translations/config'; //i18
import healthQuestionnaire_en from './i18n/translations/en.json';
import Step1 from './views/Step1';
import Step2 from './views/Step2';
import Step3 from './views/Step3';
import { useRouter } from 'next/router';
import { useLoading } from '@/common/context/loading';
import Step4 from './views/Step4';
import Step5 from './views/Step5';
import postReferenceForm from './hooks/postReferenceForm';
import StepProgressBar from '../components/ProgressBar';
import ConfirmationModal from './views/Confirmation';
import SubmittingSpinner from '@/components/loading/SubmittingSpinner';

const ReferenceForm = () => {
    const [page, setPage] = useState(0);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    // for future use on multi language
    const initialLang = 'en';
    const [locale, dispatch] = useReducer<(state: string, actions: string) => string>(langReducer, initialLang);

    // temp disable i18n
    // const { t } = useTranslation();
    const tStore = { ...healthQuestionnaire_en };
    const getNestedProperty = (obj: any, path: string) => {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };
    const t = (key: string) => getNestedProperty(tStore, key);
    const {
        formState: { errors: formatError },
        trigger,
        getValues,
        setValue,
        register,
        control
    } = useForm<ReferenceFormType>({
        mode: 'onBlur',
        defaultValues: ReferenceFormDefaultValues,
        resolver: zodResolver(ReferenceFormSchema)
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [page]);
    // confirm before leave page. TODO: dirty form check not working
    useEffect(() => {
        const handleBeforeUnload = (event: any) => {
            event.preventDefault();
            event.returnValue = '';
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);
    const validate = async () => {
        const values = getValues();
        const isValid = await trigger(ReferenceFormFields[step] as any); // TODO: review type
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
    const [step, setStep] = useState(1);
    const { setIsLoading } = useLoading();
    useEffect(() => {
        document.querySelector('#section-title')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, [step]);

    // add param from url to form
    const router = useRouter();
    useEffect(() => {
        const query = router.query;
        setValue('ref', query.ref as string);
        setValue('office', query.office as string);
        setValue('applicantName', query.name as string);
    }, [router]);
    const onSubmit = async (e: any) => {
        e.preventDefault();
        if (isSubmitting) return;

        const valid = await validate();
        if (!valid) return;

        try {
            setIsSubmitting(true);
            setIsLoading(true);
            const values = getValues();
            const res = await postReferenceForm(values);
            if (res) {
                router.push('/reference/complete');
            } else {
                throw new Error('Failed to submit the form');
            }
        } catch (error) {
            alert('Failed to submit the form. Please try again.');
            setIsLoading(false);
            setIsSubmitting(false);
        }
    };
    return (
        <div className="grid justify-center px-10 pb-10">
            <SubmittingSpinner isVisible={isSubmitting} />
            <form
                onSubmit={(e) => onSubmit(e)}
                className="flex flex-col my-14 p-10 max-w-[95vw] md:w-[50rem] md:max-w-screen bg-gray-50 border rounded-md"
            >
                <StepProgressBar steps={5} setStep={setStep} currentStep={step} />
                {step === 1 && <Step1 register={register} errors={formatError} getValues={getValues} t={t} control={control} />}
                {step === 2 && <Step2 register={register} errors={formatError} getValues={getValues} t={t} control={control} />}
                {step === 3 && <Step3 register={register} errors={formatError} getValues={getValues} t={t} control={control} />}
                {step === 4 && <Step4 register={register} errors={formatError} getValues={getValues} t={t} control={control} />}
                {step === 5 && <Step5 register={register} errors={formatError} getValues={getValues} t={t} control={control} />}
                <ConfirmationModal
                    onSubmit={onSubmit}
                    modalIsOpen={modalIsOpen}
                    setModalIsOpen={setModalIsOpen}
                    getValues={getValues}
                    t={t}
                    isSubmitting={isSubmitting}
                />
                {step != 5 && (
                    <button
                        type="button"
                        onClick={async () => {
                            const valid = await validate();
                            if (valid) setStep(step + 1);
                        }}
                        className="btn-wide"
                    >
                        {t('system.next')}
                    </button>
                )}
                {step == 5 && (
                    <button
                        type="button"
                        onClick={async () => {
                            const valid = await validate();
                            if (valid) setModalIsOpen(true);
                        }}
                        className="btn-wide"
                    >
                        {t('system.submit')}
                    </button>
                )}
                {step != 1 && (
                    <button type="button" onClick={() => setStep(step - 1)} className="btn-wide">
                        {t('system.back')}
                    </button>
                )}
                {/* {step == 0 && (
                    <Link type="button" href="/apply" className="btn-wide">
                        Back to Top
                    </Link>
                )} */}
            </form>
        </div>
    );
};

export default ReferenceForm;
