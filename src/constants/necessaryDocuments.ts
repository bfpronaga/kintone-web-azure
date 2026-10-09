export const Necessary_Documents = [
    'passport',
    'recentPhoto',
    'medicalStatusForm',
    'doctorLetter',
    'criminalCheck',
    'criminalCheckApostille'
] as const;
export const Necessary_Documents_USA = [
    'passport',
    'recentPhoto',
    'medicalStatusForm',
    'doctorLetter',
    'criminalCheck',
    'criminalCheckApostille',
    'ssn'
] as const;
export const Necessary_Documents_ShortTerm = ['passport', 'recentPhoto', 'medicalStatusForm', 'doctorLetter'] as const;
export const Necessary_Documents_ShortTerm_USA = ['passport', 'recentPhoto', 'medicalStatusForm', 'doctorLetter', 'ssn'] as const;

/** File field on the volunteer application form. Shown only when the applicant is married. */
export const Spouse_Letter_Field = 'spouseLetter' as const;
/** Checkbox label on Online Volunteer Application `documents`. */
export const SPOUSE_LETTER_DOCUMENT_LABEL = 'Spouse Letter';

export type NecessaryDocuments = (typeof Necessary_Documents_USA)[number] | typeof Spouse_Letter_Field;

export function spouseLetterRequiredForMaritalStatus(maritalStatus: string | null | undefined): boolean {
    return maritalStatus === 'Married';
}

export function isSpouseLetterRequiredValue(value: string | null | undefined): boolean {
    return value === 'true';
}

type DocumentRequirementSource = {
    office?: { value?: string | null };
    type?: { value?: string | null };
    isSpouseLetterRequired?: { value?: string | null };
};

/** Document file fields that must be present before "Necessary Documents" is complete. */
export function requiredDocumentFields(record: DocumentRequirementSource): readonly string[] {
    const usa = record.office?.value === 'USA';
    const shortTerm = record.type?.value === 'Short Term';
    const base = usa
        ? shortTerm
            ? Necessary_Documents_ShortTerm_USA
            : Necessary_Documents_USA
        : shortTerm
          ? Necessary_Documents_ShortTerm
          : Necessary_Documents;
    if (isSpouseLetterRequiredValue(record.isSpouseLetterRequired?.value)) return [...base, Spouse_Letter_Field];
    return base;
}
