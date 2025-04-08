import React from "react";
import Transactions from "./Transactions";

function App() {
  return (
    <div>
      <h1>Finance Tracker</h1>
      <Transactions />
    </div>
  );
}

reportWebVitals(console.log)
function reportWebVitals(callback) {
  if (callback && typeof callback === "function") {
    callback();
  }
}

export default App;
