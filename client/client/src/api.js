const API_BASE_URL = "http://localhost:5000/api";

export async function getTransactions() {
  const response = await fetch(`${API_BASE_URL}/transactions`);
  return response.json();
}

export async function addTransaction(transaction) {
  const response = await fetch(`${API_BASE_URL}/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(transaction),
  });
  return response.json();
}

export async function updateTransaction(id, transaction) {
  const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(transaction),
  });
  return response.json();
}

export async function deleteTransaction(id) {
  const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
    method: "DELETE",
  });
  // Return an empty object if there's no content in the response
  return response.status !== 204 ? response.json() : {};
}

export async function getDeleteTransactions() {
    const response = await fetch(`${API_BASE_URL}/transactions`, {
        method: "DELETE",
    });

    // Return an empty object if there's no content in the response
    return response.status !== 204 ? response.json() : {};
}

export async function getCategoryTotals() {
    const response = await fetch(`${API_BASE_URL}/category-totals`);
    return response.json();
}
