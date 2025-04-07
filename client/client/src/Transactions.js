import React, { useState, useEffect } from "react";
import { getTransactions, addTransaction } from "./api";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [newTransaction, setNewTransaction] = useState({
    amount: "",
    description: "",
    date: "",
  });

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
    setNewTransaction({ amount: "", description: "", date: "" });
  };

  return (
    <div>
      <h2>Transactions</h2>
      <ul>
        {transactions.map((t) => (
          <li key={t.id}>
            {t.date} - ${t.amount} - {t.description}
          </li>
        ))}
      </ul>
      <h3>Add Transaction</h3>
      <input
        type="number"
        placeholder="Amount"
        value={newTransaction.amount}
        onChange={(e) =>
          setNewTransaction({ ...newTransaction, amount: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Description"
        value={newTransaction.description}
        onChange={(e) =>
          setNewTransaction({ ...newTransaction, description: e.target.value })
        }
      />
      <input
        type="date"
        value={newTransaction.date}
        onChange={(e) =>
          setNewTransaction({ ...newTransaction, date: e.target.value })
        }
      />
      <button onClick={handleAdd}>Add</button>
    </div>
  );
}

export default Transactions;