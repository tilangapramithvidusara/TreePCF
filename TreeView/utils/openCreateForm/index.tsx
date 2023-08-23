import * as Constants from "../../constants"
import { createDataLoadRequest } from "../activities";
import {notification} from "antd";

const {LogicalNames} = Constants;

export const openCreatePane = async (
  node: any,
  title: string,
  entName: string,
  // frmId: string
  callback: any,
) => {
  let parentData = [
    {
        "entityType": node.a_attr.LogicalName,
        "id": node.id,
        "name": node.text,
    }
  ]
  const templateData =  await window.parent.Xrm.Page.data.entity.getEntityReference();

  var entityFormOptions: any = {};

  entityFormOptions["entityName"] = node?.nextLevelLogicalName

  // entityFormOptions["entityName"] = LogicalNames.SURVEY === node.a_attr.LogicalName
  // ? LogicalNames.CHAPTER 
  // : LogicalNames.CHAPTER === node.a_attr.LogicalName 
  // ? LogicalNames.SECTION 
  // : LogicalNames.SECTION === node.a_attr.LogicalName 
  // ? LogicalNames.QUESTION 
  // : LogicalNames.QUESTION === node.a_attr.LogicalName
  // ? LogicalNames.ANSWER : LogicalNames.ANSWER;

  entityFormOptions["useQuickCreateForm"] = true;
  if (LogicalNames.CHAPTER === node.a_attr.LogicalName)
    entityFormOptions[node.a_attr.LogicalName] = parentData;

  let parameterFormOptions: any = {};

  parameterFormOptions[node.a_attr.LogicalName] = parentData;
  parameterFormOptions["gyde_surveytemplate"] = templateData;
  await Promise.all([templateData]);
  try {
    const response = await window.parent.Xrm.Navigation.openForm(entityFormOptions, parameterFormOptions)
    await Promise.all([response]);
    if (response?.savedEntityReference) {
      try {
        const nodeValue = node.a_attr.LogicalName === LogicalNames.SURVEY ? null : node;
        const result = await createDataLoadRequest(nodeValue);
        console.log("data set yy ====> ", result);
        await Promise.all([result]);
        callback({
          success: true,
          dataLoadSuccess: true,
          data: result
        });
      } catch (error) {
        console.log('error catch ====> ', error);
        notification.error({
          message: "Error",
          description: "Data load failed. Plz Reload Again..!",
        });
        callback({
          success: true,
          dataLoadSuccess: false,
          data: null,
          error: true
        });
      }
    } else {
      callback({
        success: true,
        dataLoadSuccess: false,
        data: null,
        error: true
      })
    }
  } catch (error) {
    console.log("error =====> ", error);

    notification.error({
      message: "Error",
      description: "Add process failed. Plz Try Again..!",
    });
    callback({
      success: false,
      dataLoadSuccess: false,
      data: null,
      error: true,
    });
  }
};
