import * as Constants from "../../constants/index";

const { LogicalNames, FormTypes, FormNames } = Constants;

export const checkType = (keyData: any): string => {
  if (keyData.a_attr.LogicalName.includes(LogicalNames.ANSWER)) {
    return FormTypes.ANSWER;
  }
  if (keyData.a_attr.LogicalName.includes(LogicalNames.QUESTION)) {
    return FormTypes.QUESTION;
  }
  if (keyData.a_attr.LogicalName.includes(LogicalNames.SECTION)) {
    return FormTypes.SECTION;
  }
  if (keyData.a_attr.LogicalName.includes(LogicalNames.CHAPTER)) {
    return FormTypes.CHAPTER;
  } 
  if (keyData.a_attr.LogicalName.includes(LogicalNames.SURVEY)) {
    return FormTypes.SURVEY;
  }
  return "NOTHING";
};

export const setFormName = (name: string): string => {
  if (name === FormTypes.SURVEY) {
    return FormNames.CHAPTER_FORM;
  } else if (name === FormTypes.CHAPTER) {
    return FormNames.SECTION_FORM;
  } else if (name === FormTypes.SECTION) {
    return FormNames.QUESTION_FORM;
  } else if (name === FormTypes.QUESTION) {
    return FormNames.ANSWER_FORM;
  }
  return "Add";
};

export const setEntity = (keyData: any): string => {
  
  if (keyData.a_attr.LogicalName.includes(LogicalNames.SURVEY)) {
    return FormTypes.SURVEY;
  } else if (keyData.includes(LogicalNames.CHAPTER)) {
    return LogicalNames.SECTION;
  } else if (keyData.includes(LogicalNames.SECTION)) {
    return LogicalNames.QUESTION;
  } else if (keyData.includes(LogicalNames.QUESTION)) {
    return LogicalNames.QUESTION;
  } else if (keyData.includes(LogicalNames.ANSWER)) {
    return LogicalNames.ANSWER;
  } else {
    return "NOTHING";
  }
};

export const compareArrays = (array1: any[], array2: any[]) => {
  return array1.some((element) => array2.includes(element));
}
