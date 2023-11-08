declare namespace Xrm {
  interface EntityReference {
    id: string;
    entityType: string;
    name?: string;
  }

  interface SidePanes {
    getAllPanes(): SidePaneItem[];
    getPane(paneId: string): SidePane;
    createPane(options: SidePaneOptions): Promise<SidePane>;
  }

  interface SidePaneItem {
    paneId: string;
    paneTitle: string;
    visible: boolean;
  }

  interface SidePane {
    close(): void;
    navigate(options: SidePaneNavigateOptions): void;
  }

  interface SidePaneOptions {
    title?: string;
    imageSrc?: string;
    hideHeader?: boolean;
    paneId?: string,
    canClose?: boolean;
    width?: number;
  }

  interface SidePaneNavigateOptions {
    pageType: string;
    entityName: string;
    entityId?: string;
    formId?: string;
    data?: any;
  }

  namespace App {
    const sidePanes: SidePanes;
  }
}

const openSidePane = (
  entName: string,
  entId: string,
  e: any
) => {
  const openPanes = Xrm.App.sidePanes.getAllPanes();
  openPanes.forEach((item) => {
    Xrm.App.sidePanes.getPane(item.paneId).close();
  });

  if (entId != null) {
    Xrm.App.sidePanes
      .createPane({
        title: e?.title,
        imageSrc: e?.imgUrl,
        paneId: e?.id,
        hideHeader: false,
        canClose: true,
        width: 800,
      })
      .then((pane) => {
        pane.navigate({
          pageType: "entityrecord",
          entityName: entName,
          entityId: entId,
        });
      });
  } else {
    entId = "";
  }
};

export default openSidePane;
