export interface OnlineVolunteerApplication {
    returnRef: kintone.fieldTypes.Number;
    year: kintone.fieldTypes.SingleLineText;
    applicationStartDate: kintone.fieldTypes.Date;
    applicationEndDate: kintone.fieldTypes.Date;
    office: kintone.fieldTypes.DropDown;
    type: kintone.fieldTypes.DropDown;
    password: kintone.fieldTypes.SingleLineText;
    knownAs: kintone.fieldTypes.SingleLineText;
    email: kintone.fieldTypes.SingleLineText;
    commentNationalOffice: kintone.fieldTypes.MultiLineText;
    applicationRef: kintone.fieldTypes.Number;
    commentIsraelOffice: kintone.fieldTypes.MultiLineText;
    month: kintone.fieldTypes.DropDown;
    referenceCount: kintone.fieldTypes.SingleLineText;
    name: kintone.fieldTypes.SingleLineText;
    isFirstTimeOnForm: kintone.fieldTypes.RadioButton;
    status: kintone.fieldTypes.DropDown;
    isComplete: kintone.fieldTypes.RadioButton;
    isSpouseLetterRequired: kintone.fieldTypes.RadioButton;

    formSubmission: kintone.fieldTypes.CheckBox;
    documents: kintone.fieldTypes.CheckBox;
    fop: kintone.fieldTypes.CheckBox;
    reviewAbout: kintone.fieldTypes.CheckBox;
    reviewFaq: kintone.fieldTypes.CheckBox;
}
export interface SavedOnlineVolunteerApplication extends OnlineVolunteerApplication {
    $id: kintone.fieldTypes.Id;
    $revision: kintone.fieldTypes.Revision;
    Updated_by: kintone.fieldTypes.Modifier;
    Created_by: kintone.fieldTypes.Creator;
    ref: kintone.fieldTypes.RecordNumber;
    Created_datetime: kintone.fieldTypes.CreatedTime;
    Updated_datetime: kintone.fieldTypes.UpdatedTime;
}

import { KintoneRecordField } from '@kintone/rest-api-client';

export type REST_OnlineVolunteerApplication = {
    returnRef: KintoneRecordField.Number;
    year: KintoneRecordField.SingleLineText;
    applicationStartDate: KintoneRecordField.Date;
    applicationEndDate: KintoneRecordField.Date;
    office: KintoneRecordField.DropDown;
    type: KintoneRecordField.DropDown;
    password: KintoneRecordField.SingleLineText;
    knownAs: KintoneRecordField.SingleLineText;
    email: KintoneRecordField.SingleLineText;
    commentNationalOffice: KintoneRecordField.MultiLineText;
    applicationRef: KintoneRecordField.Number;
    commentIsraelOffice: KintoneRecordField.MultiLineText;
    month: KintoneRecordField.DropDown;
    referenceCount: KintoneRecordField.SingleLineText;
    name: KintoneRecordField.SingleLineText;
    isFirstTimeOnForm: KintoneRecordField.RadioButton;
    status: KintoneRecordField.DropDown;
    isComplete: KintoneRecordField.RadioButton;
    isSpouseLetterRequired: KintoneRecordField.RadioButton;

    formSubmission: KintoneRecordField.CheckBox;
    documents: KintoneRecordField.CheckBox;
    fop: KintoneRecordField.CheckBox;
    reviewAbout: KintoneRecordField.CheckBox;
    reviewFaq: KintoneRecordField.CheckBox;
};
export type REST_SavedOnlineVolunteerApplication = REST_OnlineVolunteerApplication & {
    $id: KintoneRecordField.Id;
    $revision: KintoneRecordField.Revision;
    Updated_by: KintoneRecordField.Modifier;
    Created_by: KintoneRecordField.Creator;
    ref: KintoneRecordField.RecordNumber;
    Created_datetime: KintoneRecordField.CreatedTime;
    Updated_datetime: KintoneRecordField.UpdatedTime;
};
