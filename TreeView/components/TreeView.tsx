/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-undef */
import * as React from "react";
import * as ReactDOM from 'react-dom';
import { useCallback, useState } from "react";
import Tree from "antd/es/tree";
import type { DataNode, TreeProps } from "antd/es/tree";
import type { MenuProps } from "antd/es/menu";
import Dropdown from "antd/es/dropdown";
import openSidePane from "../utils/openSidePane";
import { Modal, notification, Spin } from "antd";
import { render } from 'react-dom';

import {
  DownOutlined,
  CopyOutlined,
  EyeOutlined,
  DeleteOutlined,
  PlusOutlined,
  SnippetsOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import { Key } from "antd/es/table/interface";

import * as Constants from "../constants/index";

import {
  checkType, compareArrays,
} from "../utils/validations/index";
import {
  loop,
  createDataLoadRequest,
  openSidePaneHandler,
  deleteRequest,
  updateDataRequest,
} from "../utils/activities/index";

import { res_one, res_two } from "./sample_real_data";

import cloneDeep from "lodash.clonedeep";

const { LogicalNames, Texts, FormTypes, STATUS_CODE } = Constants;

const items: MenuProps["items"] = [
  {   
    key: "2",
    icon: <EyeOutlined/>,
    label: <div aria-disabled>Set Visible</div>,
  },
  {
    key: "3",
    icon: <DeleteOutlined />,
    label: <div>Delete</div>,
  },
  {
    key: "5",
    icon: <PlusOutlined />,
    label: <div>Add</div>,
  },
  // {
  //   key: "6",
  //   icon: <CopyOutlined />,
  //   label: <div>Copy</div>,
  // },
];

const TreeView: React.FC = () => {
  const { DirectoryTree } = Tree;
  const [gData, setGData] = useState<any[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);
  const [rightClickedRecord, setRightClickedRecord] = useState<any>();
  const [copiedRecord, setCopiedRecord] = useState<Object>({});
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [dropdownX, setDropdownX] = useState<number>(0);
  const [dropdownY, setDropdownY] = useState<number>(0);
  const [type, setType] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [deleteLoader, setDeleteLoader] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [isSubLocation, setIsSubLocation] = useState<boolean>(false);
  const [expandedNodeDataArray, setExpandedNodeDataArray] = useState<any>([]);
  const [isDisable, setIsDisable] = useState<boolean>(false);

  const [errorText, setErrorText] = useState<string>("Error");
  const [somethingWentWrong, setSomethingWentWrong] = useState<string>('Something went wrong. Please Try Again..!');
  const [dataLoadingFailed, setDataLoadingFailed] = useState<string>("Data load failed. Plz Reload Again..!");
  const [addProcessFailed, setAddProcessFailed] = useState<string>("Add process failed. Plz Try Again..!");
  const [dropAllowOnlySameLevel, setDropAllowOnlySameLevel] = useState<string>("Drop allow only same level..!");
  const [deleteConfirmation, setDeleteConformation] = useState<string>("Are you sure you want to delete this ?")


  let parentValue: any = null;
  let parentValueDrop: any = null;

  const loadResourceString = async () => {

    const url = await window.parent.Xrm.Utility.getGlobalContext().getClientUrl();
    const language = await window.parent.Xrm.Utility.getGlobalContext().userSettings.languageId
    const webResourceUrl = `${url}/WebResources/gyde_localizedstrings.${language}.resx`;

    try {
      const response = await fetch(`${webResourceUrl}`);
      const data = await response.text();
      const filterKeys = ['errorText', 'somethingWentWrong', 'dataLoadingFailed', 'addProcessFailed', 'dropAllowOnlySameLevel', 'deleteConfirmation']; // Replace with the key you want to filter
      filterKeys.map((filterKey: string, index: number) => {
        const parser = new DOMParser();
        // Parse the XML string
        const xmlDoc = parser.parseFromString(data, "text/xml");
        // Find the specific data element with the given key
        const dataNode: any = xmlDoc.querySelector(`data[name="${filterKey}"]`);
        // Extract the value from the data element
        const value: any = dataNode?.querySelector("value").textContent;

        if (index === 0 && value) {
          setErrorText(value)
        }
        if (index === 1 && value) {
          setSomethingWentWrong(value)
        }
        if (index === 2 && value) {
          setDataLoadingFailed(value)
        } 
        if (index === 3 && value) {
          setAddProcessFailed(value)
        }
        if (index === 4 && value) {
          setDropAllowOnlySameLevel(value)
        }
        if (index === 4 && value) {
          setDeleteConformation(value)
        }
        console.log('data ====> ',  index, value); 
      });
      // this.setState({ data });
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  const retriveTemplateHandler = async () => {
    try {
      const currentLocation = await window.parent.Xrm.Page.ui._formContext.contextToken.entityTypeName;
      let surveyTemplate = ''
      if (currentLocation === LogicalNames?.SURVEY) {
        surveyTemplate = await window.parent.Xrm.Page.data.entity
          .getId()
          .replace("{", "")
          .replace("}", "");
      } else {
        surveyTemplate = await window.parent.Xrm.Page.getAttribute("gyde_surveytemplate")?.getValue()[0]?.id?.replace("{", "")
        .replace("}", "");
      }
      
      console.log('id ===> ', surveyTemplate);
      
      window.parent.Xrm.WebApi.retrieveRecord("gyde_surveytemplate", surveyTemplate, "?$select=statuscode").then(
        function success(result: any) {
            console.log("result status ====>", result.statuscode);
            if (result.statuscode == 528670003 || result.statuscode == 528670005 || result.statuscode == 2) {
              setIsDisable(true)
            } else {
              setIsDisable(false);
            }
            // perform operations on record retrieval
        },
        function (error: any) {
            console.log("error message ====> ", error.message);
            setIsDisable(false);
            // handle error conditions
        }
      );
    } catch (error: any) {
      console.log("error22 message ====> ", error);
      setIsDisable(false);
    }
  }

  const dataLoader = useCallback(async () => {
    const currentLocation = await window.parent.Xrm.Page.ui._formContext.contextToken.entityTypeName;
    let res = [];
    if (currentLocation === LogicalNames?.SURVEY) {
      res = await createDataLoadRequest();
    } else {
      // NEED CREATE setIsSubLocation FALSE AGAINST IT CAME FROM THER TO RIBBON
      setIsSubLocation(true);
      const currentEntityId = await window.parent.Xrm.Page.data.entity
      .getId()
      .replace("{", "")
      .replace("}", "")
      res = await createDataLoadRequest({
        id: currentEntityId,
        a_attr: {
          LogicalName: currentLocation
        },
        isSubLocation: true,
      });
    }
    setGData(res);
    loadResourceString();
    setInitialLoading(false);
  }, []);

  React.useEffect(() => {
    dataLoader();
    retriveTemplateHandler();
    // setGData(res_one);
  }, [])

  const findParent = (tree: any, key: any, parent: any) => {
    if (tree.key === key) {
      parentValue = parent;
    } else if (tree.children) {
      tree.children.forEach((child: any) => findParent(child, key, tree));
    }
  };
  const findParentDrop = (tree: any, key: any, parent: any) => {
    if (tree.key === key) {
      parentValueDrop = parent;
    } else if (tree.children) {
      tree.children.forEach((child: any) => findParentDrop(child, key, tree));
    }
  };

  const onDrop: TreeProps["onDrop"] = async (info: any) => {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split("-");
    const dropPosition =
      info.dropPosition - Number(dropPos[dropPos.length - 1]);
    const entityLogicalName = (info as any).dragNode.a_attr.LogicalName;
    const expandedKeysArray = [...expandedKeys]; 

    findParent(gData[0], info.dragNode?.key, {});
    findParentDrop(gData[0], dropKey, {});
    if (
      parentValue.key === parentValueDrop.key
    ) {
      setDeleteLoader(true);
      const response = await updateDataRequest(
        entityLogicalName,
        info.dragNode?.key,
        {gyde_sequence: info?.node?.sequence}
      );
      
      if (response.error) {
        setDeleteLoader(false);
        parentValue = null;
        parentValueDrop = null;
        notification.error({
          message: errorText,
          description: dropAllowOnlySameLevel,
        });
      } else {
        if (parentValue?.a_attr?.LogicalName === LogicalNames?.SURVEY) {
          setGData([]);
          setExpandedKeys([]);
          setTimeout(async() => {
            const res = await createDataLoadRequest();
            setGData(res);
          }, 1000)
        } else {
          const index = expandedKeysArray.indexOf(parentValue.key)
          if (index > -1) { // only splice array when item is found
            expandedKeysArray.splice(index, 1); // 2nd parameter means remove one item only
          }
          for (let x = 0; x < parentValue.children.length; x++) {
            const indexChildren = expandedKeysArray.indexOf(parentValue.key)
            if (indexChildren > -1) { // only splice array when item is found
              expandedKeysArray.splice(indexChildren, 1); // 2nd parameter means remove one item only
            }
          }

          setExpandedKeys([...expandedKeysArray])
          
          addObjectToTree(gData[0], parentValue.key, []);
          const nodeData = await createDataLoadRequest(parentValue);
          console.log("treeData pppp ", nodeData, parentValue, parentValue?.key);
          addObjectToTree(gData[0], parentValue?.key, nodeData);
          setGData(gData);
          onLoadHandler(parentValue);
          for (let x = 0; x < parentValue.children.length; x++) {
            onLoadHandler(parentValue.children[x])
          }
        }
        setDeleteLoader(false);
        parentValue = null;
        parentValueDrop = null;
      }
    }
    parentValue = null;
    parentValueDrop = null;
  };

  const changeItemName = (node: any) => {
    // const formType = checkType(node);

    // let addType = "Add";
    // if (formType === FormTypes.SURVEY) addType = Texts.ADD_CHAPTER;
    // if (formType === FormTypes.CHAPTER) addType = Texts.ADD_SECTION;
    // if (formType === FormTypes.SECTION) addType = Texts.ADD_QUESTION;
    // if (formType === FormTypes.QUESTION) addType = Texts.ADD_ANSWER;
    if (node.haveNextlevel) {
      if (items.find((item) => item?.key === "5")) {
        items[items.findIndex((item: any) => item?.key === "5")] = {
          key: "5",
          icon: <PlusOutlined />,
          label: <div>{node?.nextLevelDisplayName}</div>,
        };
      } else {
        items.push({
          key: "5",
          icon: <PlusOutlined />,
          label: <div>{node?.nextLevelDisplayName}</div>,
        });
      }
    } else {
      if (items.find((item) => item?.key === "5")) {
        items.splice(items.findIndex((item: any) => item?.key === "5"), 1);
      }
    }
    // items[items.length - 1] = {
    //   key: "5",
    //   icon: <PlusOutlined />,
    //   label: <div>{node?.nextLevelDisplayName}</div>,
    // };
  };

  const onRightClick = (info: { event: React.MouseEvent; node: any }) => {
    info.event.preventDefault();
    console.log('right =======> ', info?.node, info?.node?.isVisible, info?.node?.haveNextlevel);
    
    changeItemName(info?.node);
    // setRightClickedRecord({ ...rightClickedRecord, ...info.node });
    if((info?.node as any)?.isVisible){
      const obj = {
        key: "2",
        icon: <EyeInvisibleOutlined />,
        label: <div>Set Hide</div>,
      };
      if (items && items[0]?.key === "2") {        
        items.splice(0, 1, obj);
      } else {
        items.unshift(obj);
      }
    } else if ((info?.node as any)?.isVisible === null) {
      if (items && items[0]?.key === "2") {
        items.splice(0, 1);
      }
    } else {
      const obj = {
        key: "2",
        icon: <EyeInvisibleOutlined />,
        label: <div>Set Visible</div>,
      };
      if (items && items[0]?.key === "2") {
        items.splice(0, 1, obj);
      } else {
        items.unshift(obj);
      }
    }
    setDropdownVisible(true);
    setDropdownX(info.event.clientX);
    setDropdownY(info.event.clientY);
    changeItemName(info?.node);
    setRightClickedRecord({ ...rightClickedRecord, ...info.node });
  };

  const hideDropDown = () => {
    setDropdownVisible(false);
  };

  const getAllDescendants = (parentId: any, tree: any[], flag?: boolean) => {
    const descendants = [];
    const queue = [parentId];
  
    while (queue.length > 0) {
      const currentId = queue.shift();
      const node: any = findNodeByIdData(currentId, tree);
      
  
      if (node) {
        if (parentId != currentId)
          descendants.push(currentId);
        else if (flag && parentId == currentId)
          descendants.push(currentId);
        if (node?.children?.length)
          queue.push(...node?.children?.map((child: any) => child.id));
      }
    }
    return descendants;
  };

  const findNodeByIdData = (id: any, node: any) => {
    
    if (node.id === id) {
      return node;
    }
  
    if (node?.children?.length) {
      for (const child of node.children) {
        const found: any = findNodeByIdData(id, child);
        if (found) {
          return found;
        }
      }
    }
    return null;
  };

  const onClick: MenuProps["onClick"] = ({ key }) => {
    switch (key) {
      case "1": {
        // Copy functionality invoked...
        setDropdownVisible(false);
        setCopiedRecord({ ...rightClickedRecord });
        break;
      }
      case "2": {
        setDropdownVisible(false);
        // set Visible/Invisible functionality invoked...
        setVisibleRecord();  
        break;
      }
      case "3": {
        // Delete functionality invoked (Double confirmation modal)
        setDropdownVisible(false);
        setIsModalOpen(true);
        break;
      }
      case "4": {
        // Copy/Paste functionality invoked..
        setDropdownVisible(false);
       
        setCopiedRecord({});
        setRightClickedRecord({});
        break;
      }
      case "5": {
        // Add new node // open quick create form
        setDropdownVisible(false);
        const selectedKey: string = (rightClickedRecord as any).key;
        const type: string = checkType(rightClickedRecord);

        if (type === "NOTHING") break;
        setType(type);
        openSidePaneHandler({...rightClickedRecord, webMessage: {errorText, dataLoadingFailed, addProcessFailed, somethingWentWrong}}, (response: any) => {
          console.log('final res ====> ', response);
          
          if (response.success && response.dataLoadSuccess) {
            setDeleteLoader(true);
            const res_two = response.data;
            if (rightClickedRecord.level === 1) {
              setGData([]);
              setExpandedKeys([]);
              setTimeout(() => {
                setGData(res_two);
                setDeleteLoader(false);
              }, 400)
              // setGData(res_two);
            } else { 
              let expanedList = expandedKeys;
              setExpandedKeys([]);
              addObjectToTree(gData[0], rightClickedRecord.key, res_two)
                  setGData((prevTreeData: any) => {
                    const updatedTreeData = cloneDeep(gData);
                    const parentNode = updatedTreeData.find((n: { key: any; }) => n?.key === rightClickedRecord.key);
                      if (parentNode) {
                        // Update the parent node with the new child nodes
                        parentNode.children = res_two;
                        Object.assign(parentNode.children, res_two);
                      }
                      return updatedTreeData;
              });
              const descendants: any = getAllDescendants(rightClickedRecord.key, rightClickedRecord);
              
              setExpandedKeys((prevNodes) => expanedList.filter((id: any) => !descendants.includes(id)));
              setDeleteLoader(false)
            }
            
          }
        });
        break;
        // setAddFormVisible(true);
      }
      default:
        break;
    }
    setGData([...gData]);
  };

  const nodeDelete = async () => {
    setIsModalOpen(false);
    let response:any ={};
    setDeleteLoader(true);
    findParent(gData[0], rightClickedRecord?.key, {});
    if((rightClickedRecord as any)?.status === 1){
      response = await deleteRequest(
      (rightClickedRecord as any)?.a_attr?.LogicalName,
      (rightClickedRecord as any)?.key
      );
    }else{
      response = await updateDataRequest(
        (rightClickedRecord as any)?.a_attr?.LogicalName,
        (rightClickedRecord as any)?.key,
        {statuscode: STATUS_CODE, statecode: 1}
      );
    }
    console.log("res....", response);
    // setDeleteLoader(true);
    if (response && response.error) {
      parentValue = null;
      notification.error({
        message: errorText,
        description: somethingWentWrong,
      });
      setDeleteLoader(false);
    } else {
      console.log('success delete');
      
      if (rightClickedRecord.level == 2) {
        const nodeData = await createDataLoadRequest();
        console.log("treeData pppp ",nodeData);
        setExpandedKeys([]);
        setTimeout(() => {
          setGData(nodeData);
        }, 400)
        
      } else {
        const nodeData = await createDataLoadRequest(parentValue);
        console.log("treeData1 pppp ",nodeData);
        const expanedList = expandedKeys;
        setExpandedKeys([]);
        addObjectToTree(gData[0], parentValue.key, nodeData);
        setGData(() => {
          const updatedTreeData = cloneDeep(gData);
          const parentNode = updatedTreeData.find(
              (n) => n?.key === parentValue.key
          );
          if (parentNode) {
            parentNode.children = nodeData;
            Object.assign(parentNode.children, nodeData);
          }
          return updatedTreeData;
        });
        
        const nodeRelateds: any = [];
        findIds(expandedNodeDataArray, parentValue.key, nodeRelateds);
        const descendants: any = getAllDescendants(parentValue.key, parentValue);

        setExpandedKeys((prevNodes) => expanedList.filter((id: any) => !nodeRelateds.includes(id)));
        setDeleteLoader(false)
        
      }
      
      setDeleteLoader(false);
      parentValue = null;
    }
  };

  const findIds = (expandedNodeDataArray: any[], parentValuekey: string, keySet: any[]) => {
    keySet.push(parentValuekey);
    let expandedDataGet = expandedNodeDataArray?.find((exData) => exData.parentKey == parentValuekey)

    if (expandedDataGet?.data?.length) {
      expandedDataGet?.data?.map((item: any) => {
        findIds(expandedNodeDataArray, item?.key, keySet);
      });
    }
      
  }

  const setVisibleRecord = async() => {
    setDeleteLoader(true);
    const response = await updateDataRequest(
      (rightClickedRecord as any)?.a_attr?.LogicalName,
      (rightClickedRecord as any)?.key, {gyde_isvisible:!(rightClickedRecord as any)?.isVisible}
    );

    if(response.error){
      setDeleteLoader(false);
      notification.error({
        message: errorText,
        description: somethingWentWrong,
      });
    } else {
      const dataVal = gData;
      findParent(gData[0],(rightClickedRecord as any)?.key, {});
      const updatedNode = rightClickedRecord;      
      updatedNode.isVisible = !rightClickedRecord.isVisible;

      findAndChange(dataVal, (rightClickedRecord as any)?.key, updatedNode, "isVisible");

      setGData(dataVal);
      
      setGData(() => {
        const updatedTreeData = cloneDeep(gData);
        findAndChange(updatedTreeData, updatedNode.id, updatedNode, "isVisible");
        return updatedTreeData;
      });
      setRightClickedRecord(updatedNode);
      parentValue = null;
      setDeleteLoader(false);
    }
  }

  const onClickNode = (selectedKeys: any, e: any) => {
    const { node } = e;
    const info = { expanded: true, node: {} };
    // handleExpand(selectedKeys, info)
    openSidePane(node.a_attr.LogicalName, node.id, node);
  };

  const handleExpand = (
    expandedKeys: Key[],
    info: { expanded: boolean; node: any }
  ) => {
    const { node, expanded } = info;
    setExpandedKeys(expandedKeys);
  };

  let data = gData;

  function addObjectToTree(tree: any, key: any, newObject: any, isReset?: boolean) {        
    if (tree.key === key) {
      isReset ? tree.children = newObject?.children
      : tree.children = newObject;
    } else if (tree.children) {
      tree.children.forEach((child: any) =>
        addObjectToTree(child, key, newObject)
      );
    } else {
      // console.log('elese [[[[[[[');
    }
  }

  function findAndChange(arr: any, id: any, newValue: any, attry: any) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id === id) {
        arr[i] = newValue;
        Object.assign(arr[i], newValue);
        return true;
      }
      if (arr[i].children && arr[i].children.length > 0) {
        if (findAndChange(arr[i].children, id, newValue, attry)) {
          return true;
        }
      }
    }
    return false;
  }

  const getNode = (key: string, nodes: any[] = data): any | undefined => {
    for (const node of nodes) {
      if (node.key === key) {
        return node;
      } else if (node.children) {
        const childNode = getNode(key, node.children);
        if (childNode) {
          return childNode;
        }
      }
    }
  };

  const iconStyle = {
    display: 'inline-block',
    verticalAlign: 'middle',
    marginRight: '10px',
    width: '25px',
    height: '25px',
  };
  
  const titleStyle = {
    display: 'inline-block',
    verticalAlign: 'middle',
    paddingRight: '5px',
  };

  const onLoadHandler = async(node: any) => {
    if (
      !(node.a_attr.LogicalName === LogicalNames.SURVEY) &&
      node.hasChildren
    ) {
      const res_two = await createDataLoadRequest({...node, isSubLocation: false});
      setExpandedNodeDataArray([...expandedNodeDataArray, {data: res_two, parentKey: node.key,}]);
      console.log('res two ===> ', res_two);
      
      node.children = res_two;
      if (
        res_two.length === 0 ||
        node.level + 1 === res_two[0].level
      ) {
        if (isSubLocation) {
          gData.map((gItem: any) => addObjectToTree(gItem, node.key, res_two))
          // addObjectToTree([{...gData}], node.key, res_two);
        } else {
          addObjectToTree(gData[0], node.key, res_two);
        }
      }
        // addObjectToTree(gData[0], node.key, res_two);
      setGData((prevTreeData: any) => {
        // const updatedTreeData = [...prevTreeData]
        const updatedTreeData = cloneDeep(gData);
        // Find the parent node in the tree data array
        const parentNode = updatedTreeData.find(
          (n) => n?.key === node.key
        );
        if (parentNode) {
          // Update the parent node with the new child nodes
          parentNode.children = res_two;
          Object.assign(parentNode.children, res_two);
        }
        return updatedTreeData;
      });
    }
    return node;
  }

  return (
    <div className="custom-container" id="custom-container">
      { !initialLoading ? (
        <div id="treeElement">
          <Spin spinning={deleteLoader}>
            <DirectoryTree
              className="draggable-tree"
              defaultExpandedKeys={expandedKeys}
              expandedKeys={expandedKeys}
              draggable={!isSubLocation && !isDisable}
              blockNode
              onDrop={onDrop}
              treeData={gData}
              selectable={true}
              style={{ paddingRight: '10px' }}
              onRightClick={onRightClick}
              onExpand={handleExpand}
              showLine={true}
              showIcon={false}//
              onSelect={(selectedKeys, e) => onClickNode(selectedKeys, e)}
              switcherIcon={<DownOutlined />}
              loadData={onLoadHandler}
              loadedKeys={expandedKeys}
              titleRender={(node: any) => {
                return (
                  <span className="ant-tree-node-content-wrapper">
                    <span className="ant-tree-node-content-icon" style={{ paddingRight: '5px' }}>
                      <img src={node?.imgUrl} alt="icon" style={iconStyle} />
                    </span>
                    <span className="ant-tree-title" style={titleStyle}>
                      {node.title}
                    </span>
                  </span>
                );
              }}
            />
          </Spin>
          {dropdownVisible && !isSubLocation && !isDisable && (
            <Dropdown
              menu={{ items, onClick }}
              open={dropdownVisible}
              onOpenChange={hideDropDown}
              trigger={["click"]}
            >
              <div
                style={{
                  position: "absolute",
                  top: dropdownY,
                  left: dropdownX,
                  marginTop:"-250px",
                  marginLeft:"-70px"
                }}
              ></div>
            </Dropdown>
          )}
          <Modal
            title="Delete"
            open={isModalOpen}
            onOk={() => {
              nodeDelete();
            }}
            onCancel={() => {
              setIsModalOpen(false);
            }}
          >
            <p>{deleteConfirmation}</p>
          </Modal>
        </div>
      ) : (
        <div>
          <p>Loading ....</p>
        </div>
      )}
    </div>
  );
};


export default TreeView;
