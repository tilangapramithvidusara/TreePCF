import React from "react";
import {
  SmileOutlined,
  RocketOutlined,
  // FileOutlined,
  BookOutlined,
  // ToolOutlined,
  ScheduleOutlined
} from "@ant-design/icons";
import type { DataNode } from "antd/es/tree";

export const res_one: any[] = [{
  title: "DATBC1 - Datacom BC template",
  key: "173d7d50-d196-ed11-aad1-0022481b7ce9", // to identify key to access react-ant-tree component
  icon: <img src="https://cdn.pixabay.com/photo/2017/01/10/03/54/icon-1968240_960_720.png" width={25} height={25} alt="ïmg" />,
  hasChildren: true, // if has children node
  id: '173d7d50-d196-ed11-aad1-0022481b7ce9',
  imgUrl: "https://cdn.pixabay.com/photo/2017/01/10/03/54/icon-1968240_960_720.png",
  formId: null,
  a_attr: {
    LogicalName: 'gyde_surveytemplate',
  },
  text: 'DATBC1 - Datacom BC template',
  state: {
    disabled: false,
    opened: true,
    selected: false
  },
  level: 1,
  haveNextlevel: true,
  nextLevelLogicalName: 'gyde_surveytemplatechapter',
  nextLevelDisplayName: "Chapter",
  children: [
    {
      title: "BC V1_CH1 - Chapter One - BC",
      key: "133D7D50-D196-ED11-AAD1-0022481B7CE9",
      icon: <img src="https://cdn.pixabay.com/photo/2017/01/10/03/54/icon-1968240_960_720.png" width={20} height={20} alt="ïmg" />,
      hasChildren: false,
      disableExpand: true,
      isVisible: true,
      // switcherIcon: false,
      switcherIcon: () => null, // hide the expand icon
      // disabled: true,
      id: '133D7D50-D196-ED11-AAD1-0022481B7CE9',
      formId: null,
      a_attr: {
        LogicalName: 'gyde_surveytemplatechapter'
      },
      text: 'BC V1_CH1 - Chapter One - BC"',
      state: {
        disabled: false,
        opened: false,
        selected: false
      },
      level: 2,
      haveNextlevel: true,
      nextLevelLogicalName: 'gyde_surveytemplatechaptersection',
      nextLevelDisplayName: "Section",
      // children: [{}],
    },
    {
      title: "BC V1_CH1 - Chapter One - NEW DATA",
      key: "133D7D50-D196-ED11-AAD1-0022481B7DASD9",
      icon: <img src="https://cdn.pixabay.com/photo/2017/01/10/03/54/icon-1968240_960_720.png" width={25} height={25} alt="ïmg" />,
      hasChildren: false,
      disableExpand: true,
      isVisible: false,
      // switcherIcon: false,
      switcherIcon: () => null, // hide the expand icon
      // disabled: true,
      id: '133D7D50-D196-ED11-AAD1-0022481B7DASD9',
      formId: null,
      a_attr: {
        LogicalName: 'gyde_surveytemplatechapter'
      },
      text: 'BC V1_CH1 - Chapter One - NEW DATA"',
      state: {
        disabled: false,
        opened: false,
        selected: false
      },
      level: 2,
      haveNextlevel: true,
      nextLevelLogicalName: 'gyde_surveytemplatechaptersection',
      nextLevelDisplayName: "Section",
      // children: [{}],
    },
    {
      title: "BC V1_CH1 - Chapter Two - BC",
      key: "133D7D50-D196-ED11-AAD1-0022481B7CE8",
      icon: <img src="https://cdn.pixabay.com/photo/2017/01/10/03/54/icon-1968240_960_720.png" width={25} height={25} alt="ïmg" />,
      hasChildren: true,
      id: '133D7D50-D196-ED11-AAD1-0022481B7CE8',
      formId: null,
      isVisible: null,
      a_attr: {
        LogicalName: 'gyde_surveytemplatechapter'
      },
      text: 'BC V1_CH1 - Chapter One - BC"',
      state: {
        disabled: false,
        opened: false,
        selected: false
      },
      level: 2,
      haveNextlevel: true,
      nextLevelLogicalName: 'gyde_surveytemplatechaptersection',
      nextLevelDisplayName: "Section",
      // children: [{}],
    },
    {
      title: "BC V1_CH1 - Chapter One - 1111111111",
      key: "133D7D50-D196-ED11-AAD1-0022481B7DA23SD9",
      icon: <img src="https://cdn.pixabay.com/photo/2017/01/10/03/54/icon-1968240_960_720.png" width={25} height={25} alt="ïmg" />,
      hasChildren: false,
      disableExpand: true,
      // switcherIcon: false,
      switcherIcon: () => null, // hide the expand icon
      // disabled: true,
      id: '133D7D50-D196-ED11-AAD1-0022481B7DA23SD9',
      formId: null,
      a_attr: {
        LogicalName: 'gyde_surveytemplatechapter'
      },
      text: 'BC V1_CH1 - Chapter One - NEW DATA"',
      state: {
        disabled: false,
        opened: false,
        selected: false
      },
      level: 2,
      haveNextlevel: true,
      nextLevelLogicalName: 'gyde_surveytemplatechaptersection',
      nextLevelDisplayName: "Section",
      // children: [{}],
    },
    {
      title: "BC V1_CH1 - Chapter One - 22222222",
      key: "133D7D50-D196-ED11-AAD1-0022481234A23SD9",
      icon: <img src="https://cdn.pixabay.com/photo/2017/01/10/03/54/icon-1968240_960_720.png" width={25} height={25} alt="ïmg" />,
      hasChildren: false,
      disableExpand: true,
      // switcherIcon: false,
      switcherIcon: () => null, // hide the expand icon
      // disabled: true,
      isVisible: true,
      id: '133D7D50-D196-ED11-AAD1-0022481234A23SD9',
      formId: null,
      a_attr: {
        LogicalName: 'gyde_surveytemplatechapter'
      },
      text: 'BC V1_CH1 - Chapter One - NEW DATA"',
      state: {
        disabled: false,
        opened: false,
        selected: false
      },
      level: 2,
      haveNextlevel: true,
      nextLevelLogicalName: 'gyde_surveytemplatechaptersection',
      nextLevelDisplayName: "Section",
      // children: [{}],
    },
    {
      title: "BC V1_CH1 - Chapter One - 3333333333",
      key: "133D7D50-D196-ED11-AAD1-023423423SD9",
      icon: <img src="https://cdn.pixabay.com/photo/2017/01/10/03/54/icon-1968240_960_720.png" width={25} height={25} alt="ïmg" />,
      hasChildren: false,
      disableExpand: true,
      // isVisible: false,
      isVisible: null,
      // switcherIcon: false,
      switcherIcon: () => null, // hide the expand icon
      // disabled: true,
      id: '133D7D50-D196-ED11-AAD1-023423423SD9',
      formId: null,
      a_attr: {
        LogicalName: 'gyde_surveytemplatechapter'
      },
      text: 'BC V1_CH1 - Chapter One - NEW DATA"',
      state: {
        disabled: false,
        opened: false,
        selected: false
      },
      level: 2,
      haveNextlevel: true,
      nextLevelLogicalName: 'gyde_surveytemplatechaptersection',
      nextLevelDisplayName: "Section",
      // children: [{}],
    },
  ],
},
{
  title: "DATBC1 - Datacom BC TEST",
  key: "173d7d50-d196-ed11-aad1-024481b7ce9", // to identify key to access react-ant-tree component
  icon: <img src="https://cdn.pixabay.com/photo/2017/01/10/03/54/icon-1968240_960_720.png" width={25} height={25} alt="ïmg" />,
  hasChildren: true, // if has children node
  id: '173d7d50-d196-ed11-aad1-024481b7ce9',
  formId: null,
  a_attr: {
    LogicalName: 'gyde_surveytemplate',
  },
  text: 'DATBC1 - Datacom BC template',
  state: {
    disabled: false,
    opened: true,
    selected: false
  },
  level: 1,
}];

export const res_two: any[] = [{
  title: "BC V1_CH1_SC1 - Section number 1",
  key: "1813d7d50-d1296-ed113-aad1-002248435b7ce19",
  icon: <img src="https://cdn.pixabay.com/photo/2017/01/10/03/54/icon-1968240_960_720.png" width={25} height={25} alt="ïmg" />,
  hasChildren: true,
  id: '1813d7d50-d1296-ed113-aad1-002248435b7ce19',
  formId: null,
  a_attr: {
    LogicalName: 'gyde_surveytemplatechaptersection'
  },
  text: 'BC V1_CH1_SC1 - Section number 1',
  state: {
    disabled: false,
    opened: false,
    selected: false
  },
  level: 3,
  // children: [
  //   {}
  // ],
}];

export const res_three: any[] = [{
  title: "BC V1_CH1_SC1_001 - Q1",
  key: "1b3d7d50-d196-ed11-aad1-0022481b7ce9",
  icon: <img src="https://cdn.pixabay.com/photo/2017/01/10/03/54/icon-1968240_960_720.png" width={25} height={25} alt="ïmg" />,
  hasChildren: true,
  id: '1b3d7d50-d196-ed11-aad1-0022481b7ce9',
  formId: null,
  a_attr: {LogicalName: 'gyde_surveytemplatechaptersectionquestion'},
  text: 'BC V1_CH1_SC1_001 - Q1',
  state: {
    disabled: false,
    opened: false,
    selected: false
  },
  level: 4
  // children: [
  //   {}
  // ],
}];