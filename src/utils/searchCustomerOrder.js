// utils/searchCustomerOrders.js
export const searchCustomerOrders = async ({ code = "", name = "" }) => {
  if (!code.trim() && !name.trim()) {
    console.log("No search criteria provided, skipping search.");
    return { customerOrders: [] };
  }

  try {
    const query = new URLSearchParams({ code: code.trim(), name: name.trim() });
    const res = await fetch(
      `http://localhost:5004/api/Customer-Order/search-co-list?${query.toString()}`
    );

    if (!res.ok) {
      throw new Error(`Server responded with ${res.status}`);
    }

    const data = await res.json();
    console.log("Search results:", data);
    return data; // let caller decide what to do with it
  } catch (err) {
    console.error("Search failed:", err.message);
    return { customerOrders: [] };
  }
};
