import React, { useState, useEffect } from "react";
import { getTransactions, addTransaction, getDeleteTransactions, getCategoryTotals, updateTransaction, deleteTransaction } from "./api";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrash, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import './Transactions.css';

ChartJS.register(ArcElement, Tooltip, Legend);

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [newTransaction, setNewTransaction] = useState({
    amount: "",
    description: "",
    date: "",
    category: ""
  });
  const [deleteTransactions, setDeleteTransactions] = useState([]);
  const [categoryTotals, setCategoryTotals] = useState([]);

  // State for edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTransaction, setEditTransaction] = useState({
    id: "",
    amount: "",
    description: "",
    date: "",
    category: ""
  });

  // Collapsible section states
  const [transactionsCollapsed, setTransactionsCollapsed] = useState(false);
  const [chartCollapsed, setChartCollapsed] = useState(false);
  const [addTransactionCollapsed, setAddTransactionCollapsed] = useState(false);
  const [categoryViewCollapsed, setCategoryViewCollapsed] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await getTransactions();
      setTransactions(data);

      const categoryData = await getCategoryTotals();
      setCategoryTotals(categoryData);
    })();
  }, []);

  const handleAdd = async () => {
    await addTransaction(newTransaction);
    // Refresh transaction list
    const data = await getTransactions();
    setTransactions(data);

    // Update category totals
    const categoryData = await getCategoryTotals();
    setCategoryTotals(categoryData);

    setNewTransaction({ amount: "", description: "", date: "", category: "" });
  };

  const handleDelete = async () => {
    const data = await getDeleteTransactions(deleteTransactions);
    setDeleteTransactions(data);

    // Refresh transaction list
    const transactionData = await getTransactions();
    setTransactions(transactionData);

    // Update category totals
    const categoryData = await getCategoryTotals();
    setCategoryTotals(categoryData);
  };

  // Handle opening the edit modal
  const handleEditClick = (transaction) => {
    setEditTransaction({
      id: transaction.id,
      amount: transaction.amount,
      description: transaction.description,
      date: transaction.date,
      category: transaction.category
    });
    setShowEditModal(true);
  };

  // Handle closing the edit modal
  const handleCloseModal = () => {
    setShowEditModal(false);
  };

  // Handle saving the edited transaction
  const handleSaveEdit = async () => {
    await updateTransaction(editTransaction.id, {
      amount: editTransaction.amount,
      description: editTransaction.description,
      date: editTransaction.date,
      category: editTransaction.category
    });

    // Refresh transaction list
    const data = await getTransactions();
    setTransactions(data);

    // Update category totals
    const categoryData = await getCategoryTotals();
    setCategoryTotals(categoryData);

    // Close the modal
    setShowEditModal(false);
  };

  // Handle deleting a specific transaction
  const handleDeleteTransaction = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      await deleteTransaction(id);

      // Refresh transaction list
      const data = await getTransactions();
      setTransactions(data);

      // Update category totals
      const categoryData = await getCategoryTotals();
      setCategoryTotals(categoryData);
    }
  };

  // Function to prepare data for the pie chart
  const preparePieChartData = () => {
    // Define colors for the chart
    const backgroundColors = [
      'rgba(255, 99, 132, 0.6)',
      'rgba(54, 162, 235, 0.6)',
      'rgba(255, 206, 86, 0.6)',
      'rgba(75, 192, 192, 0.6)',
      'rgba(153, 102, 255, 0.6)',
      'rgba(255, 159, 64, 0.6)',
      'rgba(199, 199, 199, 0.6)',
      'rgba(83, 102, 255, 0.6)',
      'rgba(40, 159, 64, 0.6)',
    ];

    const borderColors = [
      'rgba(255, 99, 132, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 206, 86, 1)',
      'rgba(75, 192, 192, 1)',
      'rgba(153, 102, 255, 1)',
      'rgba(255, 159, 64, 1)',
      'rgba(199, 199, 199, 1)',
      'rgba(83, 102, 255, 1)',
      'rgba(40, 159, 64, 1)',
    ];

    // Check if we have any data
    if (!categoryTotals || categoryTotals.length === 0) {
      return {
        labels: ['No Data'],
        datasets: [
          {
            label: 'No spending data available',
            data: [100],
            backgroundColor: ['rgba(200, 200, 200, 0.6)'],
            borderColor: ['rgba(200, 200, 200, 1)'],
            borderWidth: 1,
          },
        ],
      };
    }

    // Calculate total spending
    const totalSpending = categoryTotals.reduce((sum, category) => sum + parseFloat(category.total || 0), 0);

    // If total spending is 0, show a placeholder
    if (totalSpending === 0) {
      return {
        labels: ['No Spending'],
        datasets: [
          {
            label: 'No spending data available',
            data: [100],
            backgroundColor: ['rgba(200, 200, 200, 0.6)'],
            borderColor: ['rgba(200, 200, 200, 1)'],
            borderWidth: 1,
          },
        ],
      };
    }

    return {
      labels: categoryTotals.map(category => category.category),
      datasets: [
        {
          label: 'Spending by Category',
          data: categoryTotals.map(category => ((parseFloat(category.total || 0) / totalSpending) * 100).toFixed(2)),
          backgroundColor: backgroundColors.slice(0, categoryTotals.length),
          borderColor: borderColors.slice(0, categoryTotals.length),
          borderWidth: 1,
        },
      ],
    };
  };

return (
    <div>
        {/* Edit Transaction Modal */}
        {showEditModal && (
            <div className="modal show d-block" tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Edit Transaction</h5>
                            <button type="button" className="btn-close" onClick={handleCloseModal} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="editAmount" className="form-label">Amount</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="editAmount"
                                    value={editTransaction.amount}
                                    onChange={(e) => setEditTransaction({ ...editTransaction, amount: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="editDescription" className="form-label">Description</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="editDescription"
                                    value={editTransaction.description}
                                    onChange={(e) => setEditTransaction({ ...editTransaction, description: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="editDate" className="form-label">Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="editDate"
                                    value={editTransaction.date}
                                    onChange={(e) => setEditTransaction({ ...editTransaction, date: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="editCategory" className="form-label">Category</label>
                                <select
                                    className="form-select"
                                    id="editCategory"
                                    value={editTransaction.category}
                                    onChange={(e) => setEditTransaction({ ...editTransaction, category: e.target.value })}
                                >
                                    <option value="" disabled>Select Category...</option>
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
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
                            <button type="button" className="btn btn-primary" onClick={handleSaveEdit}>Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        )}
        {/* Modal backdrop */}
        {showEditModal && <div className="modal-backdrop show"></div>}

        {/* Transactions and Chart Section */}
        <div className="row">
            {/* Transactions List */}
            <div className="col-md-8">
                <div className="card">
                    <div className="card-header" onClick={() => setTransactionsCollapsed(!transactionsCollapsed)}>
                        <h2>Transactions</h2>
                        <div className="toggle-icon">
                            <FontAwesomeIcon icon={transactionsCollapsed ? faChevronDown : faChevronUp} />
                        </div>
                    </div>
                    <div className={`card-body ${transactionsCollapsed ? 'collapsed' : ''}`}>
                        <ul className="list-group">
                            {transactions
                                .sort((a, b) => new Date(b.date) - new Date(a.date)) // Newest first
                                .map((t) => (
                                    <li key={t.id} className="list-group-item d-flex justify-content-between align-items-center">
                                        <div>
                                            <span className="transaction-date">{t.date}</span>
                                            <span> - </span>
                                            <span className="transaction-amount">${t.amount}</span>
                                            <span> - </span>
                                            <span>{t.description}</span>
                                            <span> - </span>
                                            <span className="transaction-category">{t.category}</span>
                                        </div>
                                        <div>
                                            <button
                                                className="btn btn-icon btn-icon-edit me-2"
                                                onClick={() => handleEditClick(t)}
                                                title="Edit transaction"
                                            >
                                                <FontAwesomeIcon icon={faPencilAlt} />
                                            </button>
                                            <button
                                                className="btn btn-icon btn-icon-delete"
                                                onClick={() => handleDeleteTransaction(t.id)}
                                                title="Delete transaction"
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                        </ul>
                        <div className="mt-4">
                            <button className="btn btn-danger" onClick={handleDelete}>Delete All Transactions</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chart Section */}
            <div className="col-md-4">
                <div className="card">
                    <div className="card-header" onClick={() => setChartCollapsed(!chartCollapsed)}>
                        <h2>Spending by Category</h2>
                        <div className="toggle-icon">
                            <FontAwesomeIcon icon={chartCollapsed ? faChevronDown : faChevronUp} />
                        </div>
                    </div>
                    <div className={`card-body chart-container ${chartCollapsed ? 'collapsed' : ''}`}>
                        <Pie
                            data={preparePieChartData()}
                            options={{
                                plugins: {
                                    tooltip: {
                                        callbacks: {
                                            label: function(context) {
                                                return `${context.label}: ${context.raw}%`;
                                            }
                                        }
                                    },
                                    legend: {
                                        position: 'bottom',
                                        labels: {
                                            boxWidth: 15,
                                            padding: 15,
                                            font: {
                                                size: 12
                                            }
                                        }
                                    },
                                    title: {
                                        display: true,
                                        text: 'Spending Distribution',
                                        font: {
                                            size: 16,
                                            weight: 'bold'
                                        },
                                        color: '#6a4c93',
                                        padding: {
                                            bottom: 20
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>

        {/* Add Transaction Section */}
        <div className={`add-transaction-section mt-4 ${addTransactionCollapsed ? 'collapsed' : ''}`}>
            <div className="section-header" onClick={() => setAddTransactionCollapsed(!addTransactionCollapsed)}>
                <h3>Add Transaction</h3>
                <div className="toggle-icon">
                    <FontAwesomeIcon icon={addTransactionCollapsed ? faChevronDown : faChevronUp} />
                </div>
            </div>
            <div className="section-content">
                <div className="row gy-3 gx-3 align-items-center">
                    <div className="col-md-2">
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Amount"
                            value={newTransaction.amount}
                            onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                        />
                    </div>
                    <div className="col-md-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Description"
                            value={newTransaction.description}
                            onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                        />
                    </div>
                    <div className="col-md-2">
                        <input
                            type="date"
                            className="form-control"
                            value={newTransaction.date}
                            onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                        />
                    </div>
                    <div className="col-md-3">
                        <select
                            className="form-select"
                            value={newTransaction.category}
                            onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                        >
                            <option value="" disabled>Select Category...</option>
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
                    <div className="col-md-2">
                        <button className="btn btn-coral w-100" onClick={handleAdd}>
                            Add Transaction
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* View by Category Section */}
        <div className="card mt-4">
            <div className="card-header" onClick={() => setCategoryViewCollapsed(!categoryViewCollapsed)}>
                <h2>View by Category</h2>
                <div className="toggle-icon">
                    <FontAwesomeIcon icon={categoryViewCollapsed ? faChevronDown : faChevronUp} />
                </div>
            </div>
            <div className={`card-body ${categoryViewCollapsed ? 'collapsed' : ''}`}>
                <div className="row mb-4">
                    <div className="col-md-4">
                        <select
                            className="form-select"
                            value={newTransaction.category}
                            onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                        >
                            <option value="" disabled>Select Category...</option>
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
                </div>

                <ul className="list-group">
                {transactions
                    .sort((a, b) => new Date(b.date) - new Date(a.date)) // Newest first
                    .filter((t) => t.category === newTransaction.category)
                    .map((t) => (
                        <li key={t.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <span className="transaction-date">{t.date}</span>
                                <span> - </span>
                                <span className="transaction-amount">${t.amount}</span>
                                <span> - </span>
                                <span>{t.description}</span>
                                <span> - </span>
                                <span className="transaction-category">{t.category}</span>
                            </div>
                            <div>
                                <button
                                    className="btn btn-icon btn-icon-edit me-2"
                                    onClick={() => handleEditClick(t)}
                                    title="Edit transaction"
                                >
                                    <FontAwesomeIcon icon={faPencilAlt} />
                                </button>
                                <button
                                    className="btn btn-icon btn-icon-delete"
                                    onClick={() => handleDeleteTransaction(t.id)}
                                    title="Delete transaction"
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
);
}

export default Transactions;
