import React from "react";
import Transactions from "./Transactions";
import './App.css';

function App() {
  return (
    <div className="app-container">
      <div className="app-header">
        <h1>Finance Tracker</h1>
        <p className="app-subtitle">Track your spending with style</p>
      </div>
      <div className="finance-container">
        <Transactions />
      </div>
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
