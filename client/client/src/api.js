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

// export async function getDeleteTransactions() {
//     const response = await fetch(`${API_BASE_URL}/transactions`, {
//         method: "DELETE",
//     });
//     return response.json();
// }