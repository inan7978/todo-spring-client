import { useState } from "react";
import logo from "./logo.svg";
import List from "./List";
import "./App.css";

function App() {
  const [remaining, setRemaining] = useState(0);
  function getRemaining(childData) {
    setRemaining(childData);
  }

  return (
    <div className="App">
      <header className="App-header">
        {remaining > 0 ? (
          <h1>
            {" "}
            ToDo: {remaining}{" "}
            {(remaining > 1 && "Items remain") ||
              (remaining === 1 && "Item left!") ||
              (remaining < 1 && "left. Nice work!")}
          </h1>
        ) : (
          <h1>All done!</h1>
        )}
      </header>
      <List getRemaining={getRemaining} />
    </div>
  );
}

export default App;
