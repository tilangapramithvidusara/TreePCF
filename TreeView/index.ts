import {IInputs, IOutputs} from "./generated/ManifestTypes";
import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App"

export class TreeView implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private container: HTMLDivElement;
    constructor() {}

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement
      ) {
        // Save the container element for later use
        this.container = container;
        
      }


    public updateView(context: ComponentFramework.Context<IInputs>): void {
        // Render the React component using ReactDOM.render
        ReactDOM.render(React.createElement(App, { context: context }), this.container);
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    // public getOutputs(): IOutputs
    // {
    //     return {};
    // }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void
    {
        // Add code to cleanup control if necessary
    }
}
