import * as React from "react";
import TreeView from "./components/TreeView";
import { render } from 'react-dom';

const App = () => {

  // const [rerender, setRerender] = React.useState(false);

  // function triggerRerender(): void {
  //   setRerender(prev => !prev);
  // }

  // const container = document.getElementById('custom-container');
  // render(<TreeView triggerRerender={triggerRerender}/>, container);

  return (
    <>
      <TreeView />
    </>
  );
};

export default App;
