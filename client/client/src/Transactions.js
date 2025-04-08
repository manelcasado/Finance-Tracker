import React, { useState, useEffect } from "react";
import { getTransactions, addTransaction, getDeleteTransactions } from "./api";
import 'bootstrap/dist/css/bootstrap.min.css';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [newTransaction, setNewTransaction] = useState({
    amount: "",
    description: "",
    date: "",
    category: ""
  });
  // const [deleteTransactions, setDeleteTransactions] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await getTransactions();
      setTransactions(data);
    })();
  }, []);

  const handleAdd = async () => {
    await addTransaction(newTransaction);
    // Refresh transaction list
    const data = await getTransactions();
    setTransactions(data);
    setNewTransaction({ amount: "", description: "", date: "", category: "" });
  };

//   const handleDelete = async () => {
//     const data = await getDeleteTransactions();
//     setDeleteTransactions(data);
//     // Refresh transaction list
//   };

return (
    <div>
        <h2>Transactions</h2>
        <ul>
            {transactions.map((t) => (
                <li key={t.id}>
                    {t.date} - ${t.amount} - {t.description} - {t.category}
                </li>
            ))}
        </ul>
        <div className="col mb-3">
                <button className="btn btn-primary" onClick={handleAdd /*handleDelete*/}>Remove transactions</button>
        </div>
        <h3>Add Transaction</h3>
        <div className="row gy-2 gx-3 align-items-center">
            <div className="col-auto">
                <input
                    type="number"
                    className="form-control"
                    placeholder="Amount"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                />
            </div>
            <div className="col-auto">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Description"
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                />
            </div>
            <div className="col-auto">
                <input
                    type="date"
                    className="form-control"
                    value={newTransaction.date}
                    onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                />
            </div>
            <div className="col-auto">
                <label htmlFor="inputState" className="visually-hidden">Category</label>
                <select
                    id="inputState"
                    className="form-select"
                    value={newTransaction.category}
                    onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                >
                    <option value="" disabled>Choose...</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Groceries">Groceries</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Rent">Rent</option>
                    <option value="Insurance">Insurance</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div className="col-auto">
                <button className="btn btn-primary" onClick={handleAdd}>Add</button>
            </div>
        </div>
    </div>
);
}

export default Transactions;
