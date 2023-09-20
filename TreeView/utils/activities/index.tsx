import * as React from "react";

import {openCreatePane} from "../openCreateForm";
import { checkType, setEntity, setFormName } from "../validations";
import { LogicalNames } from "../../constants";

declare global {
  interface Window {
    Xrm: any;
  }
}

export const createDataLoadRequest = async (node?: any): Promise<any[]> => {
  console.log("node node ====> ", node);
  
  try {
    var req: any = {};
    var parameterTypes: any = {
      surveytemplateid: {
        typeName: "Edm.String",
        structuralProperty: 1,
      },
    };
    if (node && node.id) {
      // req.parentworkitemid = node.id || node.key;
      req.parentnodeid = node.id;
      req.parentlogicalname = node.a_attr.LogicalName;
      parameterTypes = {
        ...parameterTypes,
        parentnodeid: {
          typeName: "Edm.String",
          structuralProperty: 1,
        },
        parentlogicalname: {
          typeName: "Edm.String",
          structuralProperty: 1,
        },
      };
    }

    let surveyTemplate = null;

    const currentLogicalName = await window.parent.Xrm.Page.ui._formContext.contextToken.entityTypeName

    if (currentLogicalName === LogicalNames?.SURVEY) {
      surveyTemplate = await window.parent.Xrm.Page.data.entity
      .getId()
      .replace("{", "")
      .replace("}", "");
    } else {
      surveyTemplate = await 
        window.parent.Xrm.Page.getAttribute(LogicalNames?.SURVEY).getValue()[0]?.id?.replace("{", "").replace("}", "")
    }


    req.surveytemplateid = surveyTemplate;
    req.getMetadata = function () {
      return {
        boundParameter: null,
        parameterTypes,
        operationType: 1, // This is a function. Use '0' for actions and '2' for CRUD
        operationName: "gyde_GetSurveyTreeData",
      };
    };

    // const response = executeRequest(req);
    const result = await window.parent.Xrm.WebApi.online
      .execute(req)
      .then(function (response: any) {
        if (response.ok) {
          return response.json();
        }
      })
      .then(function (responseBody: any) {
        const resData = JSON.parse(responseBody.nodedata);
        console.log('lll ==> ', (node && node.id && resData.length > 0), !(node && node.id));
        
        const data =
          (node && node.id && resData.length > 0) || !(node && node.id)
            ? dataFomater(node, JSON.parse(responseBody.nodedata))
            : resData;
        return data;
      })
      .catch(function (error: any) {
        return [];
      });
    await Promise.all([surveyTemplate, result])
    console.log("tree data",result);
    return result;
  } catch (error) {
    return [];
  }
};

export const updateDataRequest = async (
  entityLogicalName: any,
  id: any,
  data: any
): Promise<any> => {
  try {
    const result = await window.parent.Xrm.WebApi.updateRecord(
      entityLogicalName,
      id,
      data
    );
    console.log("update result",result);
    return { error: false, data: result };
  } catch (error: any) {
    console.log("update error",error);
    return { error: true, data: {} };
  }
};

const dataFomater = (node: any, dataSet: any): any => {
  let children = [];
  if (node && node.id) {
    children = arrayFormater(dataSet, node?.level, node?.isSubLocation);
    return children;
  } else {
    const icon = dataSet.icon;
    let { children, ...rest } = dataSet;
    if (!dataSet.children) {
      dataSet.switcherIcon = () => null;
    }
    // hasVisibility
    dataSet = {
      ...dataSet,
      key: dataSet.id,
      icon: <img src={`${icon}`} width={25} height={25} alt="img" />,
      imgUrl: icon,
      title: dataSet.text,
      hasChildren: dataSet.children.length > 0 ? true : false,
      disableExpand: !dataSet.children,
      level: 1,
      haveNextlevel: dataSet.nextLevelLogicalName ? true : false,
      isVisible: dataSet.hasVisibility ? dataSet.isVisible : null,
      expanded: false,
      isSubLocation: false
    };
    if (dataSet.children) {
      children = arrayFormater(dataSet.children, 1);
      dataSet.children = children;
    }
    return [dataSet];
  }
};

const arrayFormater = (array: any[], previousLevel: number, isSubLocation?: boolean): any => {
  for (let i = 0; i < array.length; i++) {
    let dataSet = array[i];
    const icon = dataSet.icon;
    let { children, ...rest } = dataSet;
    if (!dataSet.children) {
      rest = { ...rest, switcherIcon: () => null };
    }
    dataSet = {
      ...rest,
      key: dataSet.id,
      icon: <img src={`${icon}`} width={25} height={25} alt="img" />,
      imgUrl: icon,
      title: dataSet.text,
      hasChildren: dataSet.children,
      disableExpand: !dataSet.children,
      level: isSubLocation ? 1 : previousLevel + 1,
      haveNextlevel: dataSet.nextLevelLogicalName ? true : false,
      isVisible: dataSet.hasVisibility ? dataSet.isVisible : null,
      expanded: false,
      isSubLocation: isSubLocation
    };
    array[i] = dataSet;
  }
  return array;
};

export const loop = (
  data: any[],
  key: React.Key,
  callback: (node: any, i: number, data: any[]) => void
) => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].key === key) {
      return callback(data[i], i, data);
    }
    if (data[i].children) {
      loop(data[i].children!, key, callback);
    }
  }
};

export const openSidePaneHandler = (node: any, callback: any) => {
  const type = checkType(node);
  const formName = setFormName(type);
  const entityName = setEntity(node);
  openCreatePane(node, formName, node.a_attr.LogicalName, (response: any) => {
    callback(response);
  });
}

export const deleteRequest = async (
  entityLogicalName: any,
  id: string
): Promise<any> => {
  try {
    const result = await window.parent.Xrm.WebApi.deleteRecord(
      entityLogicalName,
      id
    );
    return { error: false, data: result, loading: false };
  } catch (error: any) {
    // handle error conditions
    return { error: true, data: [], loading: false };
  }
};
