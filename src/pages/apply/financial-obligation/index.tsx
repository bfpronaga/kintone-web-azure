'use client';

import { KintoneUserName, KintonePassword, OnlineVolunteerApplicationAppID, PersonalHealthQuestionnaireAppID } from '@/common/env';
import { REST_OnlineVolunteerApplication } from '@/types/OnlineVolunteerApplication';
import { KintoneRestAPIClient } from '@kintone/rest-api-client';
import { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import logError from '@/common/logError';
import FinancialObligation from '@/features/common/forms/financialObligation';

const Dashboard = ({ repo }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    return (
        <>
            <>
                <div className="flex flex-col items-center justify-center min-h-[95vh] w-full">
                    <FinancialObligation repo={repo} />
                </div>
            </>
        </>
    );
};
export default Dashboard;

type Repo = {
    selectedOption: any;
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
            .getAllRecords({
                app: 82, // financial obligation app
                condition: `ref=${cookies.ref}`
            })
            .catch((e) => {
                throw new Error('resp:' + e);
            });
        const selectedOption = resp[0]?.paymentOption.value || null;
        const repo: Repo = {
            selectedOption
        };
        // Pass data to the page via props
        return { props: { repo } };
    } catch (e) {
        logError(e, context, 'getServerSideProps');
        return { props: {} };
    }
}) satisfies GetServerSideProps<{ repo: Repo } | {}>;
