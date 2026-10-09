import NotificationDocument from '@/common/react-email/emails/Notification-document';
import { render } from '@react-email/render';
import React from 'react';
import { sendEmail } from '@/lib/email-service';
import logError from '@/common/logError';
import { REST_SavedOnlineVolunteerApplication, REST_OnlineVolunteerApplication } from '@/types/OnlineVolunteerApplication';
import { isSpouseLetterRequiredValue } from '@/constants/necessaryDocuments';

const necessaryDocuments = {
    passport: 'Passport',
    recentPhoto: 'Recent Photo',
    medicalStatusForm: 'Medical Status Form',
    doctorLetter: "Doctor's Letter",
    criminalCheck: 'Criminal Check',
    criminalCheckApostille: 'Criminal Check Apostille'
};
const necessaryDocumentsUSA = {
    passport: 'Passport',
    recentPhoto: 'Recent Photo',
    medicalStatusForm: 'Medical Status Form',
    doctorLetter: "Doctor's Letter",
    criminalCheck: 'Criminal Check',
    criminalCheckApostille: 'Criminal Check Apostille',
    ssn: 'Social Security Card'
};
const necessaryDocumentsShortTerm = {
    passport: 'Passport',
    recentPhoto: 'Recent Photo',
    medicalStatusForm: 'Medical Status Form',
    doctorLetter: "Doctor's Letter"
};

export type EmailNationalOffice = keyof typeof emailNationalOffice;
export const emailNationalOffice = {
    // add National Office email
    Australia_main: 'rneil.au@bridgesforpeace.com',
    Australia_zealous: 'aprilpatane.nat@gmail.com',
    Canada: 'trevorf@bfpcan.org',
    Japan: 'mtabata@bfpj.org',
    'New Zealand': 'emather.nz@bridgesforpeace.com',
    'South Africa': 'volunteers@bridgesforpeace.co.za',
    'South Korea': 'ronaga@bridgesforpeace.com',
    'United Kingdom': 'ukoffice@bridgesforpeace.com',
    USA: 'volunteer@bfpusa.org',
    Other: 'intl.personnel@bridgesforpeace.com'
} as const;

export type SubmitType = 'documentSubmission' | 'applicationSubmission' | 'healthQuestionnaireSubmission';

type Updated =
    | 'passport'
    | 'recentPhoto'
    | 'medicalStatusForm'
    | 'doctorLetter'
    | 'application'
    | 'healthQuestionnaire'
    | 'criminalCheck'
    | 'criminalCheckApostille'
    | 'ssn'
    | 'spouseLetter';
export const updated = {
    passport: 'Passport',
    recentPhoto: 'Recent Photo',
    medicalStatusForm: 'Medical Status Form',
    doctorLetter: "Doctor's Letter",
    application: 'Online Application',
    healthQuestionnaire: 'Health Questionnaire',
    criminalCheck: 'Criminal Check',
    criminalCheckApostille: 'Criminal Check Apostille',
    ssn: 'Social Security Card',
    spouseLetter: 'Spouse Letter'
};
export const notificationApplicationUpdated = async (
    res: any,
    updatedField: Updated,
    record: REST_SavedOnlineVolunteerApplication,
    submitType: SubmitType
) => {
    try {
        const name = record['name'].value;
        const office = record['office'].value as EmailNationalOffice | 'Australia';
        const documents = record['documents'].value;
        const baseDocuments =
            record['office'].value === 'USA'
                ? necessaryDocumentsUSA
                : record['type'].value === 'Short Term'
                ? necessaryDocumentsShortTerm
                : necessaryDocuments;
        const this_necessaryDocuments = isSpouseLetterRequiredValue(record.isSpouseLetterRequired?.value)
            ? { ...baseDocuments, spouseLetter: 'Spouse Letter' }
            : baseDocuments;
        if (!office) throw new Error('Invalid office');
        // return if documentSubmission and not complete
        if (submitType === 'documentSubmission' && documents.length < Object.keys(this_necessaryDocuments).length) {
            res.status(200).json({ resp2: 'not complete' });
            return;
        }
        const to =
            office == 'Australia'
                ? record['type'].value == 'Zealous'
                    ? emailNationalOffice['Australia_zealous']
                    : emailNationalOffice['Australia_main']
                : emailNationalOffice[office] == undefined
                ? 'intl.personnel@bridgesforpeace.com'
                : emailNationalOffice[office];
        const mailTitle =
            submitType === 'documentSubmission'
                ? `[Online Application] Document submitted by ${name} (${documents.length}/${Object.keys(this_necessaryDocuments).length})`
                : submitType === 'applicationSubmission'
                ? `[Online Application] New application submitted by ${name}`
                : submitType === 'healthQuestionnaireSubmission'
                ? `[Online Application] Health Questionnaire submitted by ${name}`
                : `[Online Application] Document submitted by ${name}`;
        const mailBody = `${name} submitted ${updated[updatedField]}`;
        const mailHTML = render(<NotificationDocument mailBody={mailBody} applicationRef={record['applicationRef'].value} />);

        const emailOptions = {
            to: to,
            subject: mailTitle,
            html: mailHTML
        };

        await sendEmail(emailOptions);
        res.status(200).json({ resp2: 'Email sent successfully' });
        return;
    } catch (e) {
        logError(e, record, 'notificationApplicationUpdated');
        res.status(200).json({ resp2: e });
    }
};
export default notificationApplicationUpdated;

export const notificationReferenceSubmitted = async (res: any, record: REST_SavedOnlineVolunteerApplication) => {
    try {
        const name = record['name'].value;
        const office = record['office'].value as EmailNationalOffice;
        if (!office) throw new Error('Invalid office');
        const to = emailNationalOffice[office];
        const mailTitle = `[Online Application] All Reference Forms submitted for ${name}`;
        const mailBody = `The Reference Forms are all submitted for ${name}`;
        const mailHTML = render(<NotificationDocument mailBody={mailBody} applicationRef={record['applicationRef'].value} />);

        const emailOptions = {
            to: to,
            subject: mailTitle,
            html: mailHTML,
            bcc: 'ronaga@bridgesforpeace.com'
        };

        await sendEmail(emailOptions);
        res.status(200).json({ resp2: 'Email sent successfully' });
        return;
    } catch (e) {
        logError(e, record, 'notificationApplicationUpdated');
        res.status(200).json({ resp2: e });
    }
};
