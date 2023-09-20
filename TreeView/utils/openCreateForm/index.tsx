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

  entityFormOptions["useQuickCreateForm"] = true;
  if (LogicalNames.CHAPTER === node.a_attr.LogicalName)
    entityFormOptions[node.a_attr.LogicalName] = parentData;

  let parameterFormOptions: any = {};

  parameterFormOptions[node.a_attr.LogicalName] = parentData;
  parameterFormOptions["gyde_surveytemplate"] = templateData;
  if (
    LogicalNames.GRID === node.a_attr.LogicalName ||
    LogicalNames.ANSWER === node.nextLevelLogicalName
  ) {
    parameterFormOptions["gyde_relatedquestion"] = parentData;
    const nodeGyde = await window.parent.Xrm.WebApi.retrieveRecord(node.a_attr.LogicalName, node?.id, "?$select=gyde_internalid")
    parameterFormOptions['gyde_parentid'] = nodeGyde['gyde_parentid'];
  }

  if (LogicalNames.QUESTION === node.a_attr.LogicalName && (node?.nextLevelLogicalName === LogicalNames?.GRID || node?.nextLevelLogicalName === LogicalNames?.ANSWER)) {
    const templateId = templateData.id?.replace("{", "").replace("}", "");
    
    const nodeGyde = await window.parent.Xrm.WebApi.retrieveRecord(node.a_attr.LogicalName, node?.id, "?$select=gyde_internalid")
    parameterFormOptions['gyde_parentid'] = nodeGyde['gyde_internalid'];
    // window.parent.Xrm.WebApi.retrieveRecord("gyde_surveytemplatechaptersectionquestion", "79ca0bc1-b948-ee11-be6f-6045bdd0ef22", "?$select=gyde_internalid").then(
    //   function success(result) {
    //     console.log(result);
    //     console.log(result["gyde_internalid"])
    //   })

  }
 
  if (LogicalNames.QUESTION == node?.a_attr.LogicalName && (node?.nextLevelLogicalName == LogicalNames.GRID))
    parameterFormOptions["gyde_surveytemplatequestion"] = parentData;
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
          message: node?.webMessage?.errorText,
          description: node?.webMessage?.dataLoadingFailed,
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
      message: node?.webMessage?.errorText,
      description: node?.webMessage?.addProcessFailed,
    });
    callback({
      success: false,
      dataLoadSuccess: false,
      data: null,
      error: true,
    });
  }
};
