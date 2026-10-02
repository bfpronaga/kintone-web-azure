'use client';
import { useEffect, useState, useCallback } from 'react';

import Link from 'next/link';
import HealthQuestionnaire from '@/features/common/forms/healthQuestionnaire';
import {
    KintoneUserName,
    KintonePassword,
    OnlineVolunteerApplicationAppID,
    VolunteerApplicationAppID,
    PersonalHealthQuestionnaireAppID
} from '@/common/env';
import { REST_OnlineVolunteerApplication } from '@/types/OnlineVolunteerApplication';
import { KintoneRestAPIClient } from '@kintone/rest-api-client';
import { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import logError from '@/common/logError';
import { REST_PersonalHealthQuestionnaire } from '@/types/PersonalHealthQuestionnaire';
import ViewHealthQuestionnaire from '@/features/common/viewForms/healthQuestionnaire/ViewHealthQuestionnaire';
import dynamic from 'next/dynamic';
import { usePageTransition } from '@/common/context/pageTransition';
// Dynamically import PDFDownloadLink to ensure it is only loaded on the client side
const PDFDownloadLink = dynamic(() => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink), { ssr: false });
const PDFViewer = dynamic(() => import('@react-pdf/renderer').then((mod) => mod.PDFViewer), { ssr: false });

const Dashboard = ({ repo }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const formSubmitted = repo?.formSubmitted;
    const pageTransition = usePageTransition();
    useEffect(() => {
        // End page transition after component mounts and data is loaded
        // Timing matches the slide animation duration
        if (repo) {
            setTimeout(() => {
                pageTransition.endTransition();
            }); // Match the slide animation duration + buffer
        }
    }, [repo]);
    return (
        <>
            {formSubmitted ? (
                <>
                    <div className="flex flex-col text-center items-center justify-center h-[95vh] p-4">
                        <div>Thank you for submitting Personal Health Questionnaire.</div>
                        <>
                            {/* <button className="btn" onClick={() => setViewMyForm(true)}>
                                        View Your Response
                                    </button> */}
                            <PDFDownloadLink
                                document={<ViewHealthQuestionnaire record={repo?.submittedFormRecord} />}
                                fileName="health_questionnaire.pdf"
                            >
                                <div className="btn">Download Your Response</div>
                            </PDFDownloadLink>
                            {/* dev 
                            <PDFViewer width={1000} height={1000}>
                                <ViewHealthQuestionnaire record={repo?.submittedFormRecord} />
                            </PDFViewer> */}
                            {/* TODO: send via email?
                                    <div>
                                        <div className="mt-4">Send Your Response to:</div>
                                        <input placeholder="example@mail.com" />
                                        <button className="btns">Send</button>
                                    </div> */}
                        </>
                        <Link href="/apply" className="btn">
                            Go to Top
                        </Link>
                    </div>
                </>
            ) : (
                <>
                    <div className="flex flex-col items-center justify-center min-h-[95vh] w-full">
                        <HealthQuestionnaire repo={repo} />
                    </div>
                </>
            )}
        </>
    );
};
export default Dashboard;

type Repo = {
    formSubmitted: boolean;
    prefilledFormRecord: REST_PersonalHealthQuestionnaire | null;
    submittedFormRecord: REST_PersonalHealthQuestionnaire | null;
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
        const resp = await client.record
            .getRecord<REST_OnlineVolunteerApplication>({
                app: OnlineVolunteerApplicationAppID as string,
                id: cookies.ref
            })
            .catch((e) => {
                throw new Error('resp:' + e);
            });
        let prefilledFormRecord;
        if (resp.record['returnRef'].value) {
            const resp3 = await client.record
                .getAllRecords<any>({
                    app: PersonalHealthQuestionnaireAppID as string,
                    condition: `ref=${resp.record['returnRef'].value}`
                })
                .catch((e) => {
                    throw new Error('resp3:' + e);
                });
            if (resp3) prefilledFormRecord = resp3[0];
        }
        const isFormSubmitted = resp.record['formSubmission'].value.findIndex((arr) => arr == 'Personal Health Questionnaire') > -1;
        let submittedFormRecord;
        if (isFormSubmitted) {
            const resp2 = await client.record.getAllRecords<REST_PersonalHealthQuestionnaire>({
                app: PersonalHealthQuestionnaireAppID as string,
                condition: `ref=${cookies.ref}`
            });
            submittedFormRecord = resp2[0];
        }
        const repo: Repo = {
            prefilledFormRecord: prefilledFormRecord || null,
            formSubmitted: isFormSubmitted,
            submittedFormRecord: submittedFormRecord || null
        };
        console.log('repo', repo);
        // Pass data to the page via props
        return { props: { repo } };
    } catch (e) {
        logError(e, context, 'getServerSideProps');
        return { props: {} };
    }
}) satisfies GetServerSideProps<{ repo: Repo } | {}>;
