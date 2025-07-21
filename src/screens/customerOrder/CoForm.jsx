import React, { useEffect, useState } from "react";
import { Label, TextInput, Select, Textarea, Button } from "flowbite-react";

const COForm = ({ onCancel, onSuccess }) => {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [formData, setFormData] = useState({
    coNo: "",
    date: new Date().toISOString().split("T")[0],
    customerId: "",
    paymentStatus: "Cash",
    remarks: "",
    productId: "",
    orderQty: "",
    sellingPrice: "",
  });

  useEffect(() => {
    // Fetch customer list from backend
    fetch("http://localhost:5004/api/customers/getAllCustomers")
      .then((res) => res.json())
      .then((data) => {
        setCustomers(data.customers || []);
      })
      .catch((err) => {
        console.error("Failed to load customers", err);
        setCustomers([]);
      });

    // load products
    fetch("http://localhost:5004/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []))
      .catch((err) => {
        console.error("Error fetching products", err);
        setProducts([]);
      });

    //  Fetch CO number from backend
    fetch("http://localhost:5004/api/Customer-Order/new-co-number")
      .then((res) => res.json())
      .then((data) => {
        setFormData((prev) => ({
          ...prev,
          coNo: data.coNumber || "ERROR", // fallback in case backend fails
        }));
      })
      .catch((err) => {
        console.error("Failed to load CO Number", err);
      });
  }, []);

  // Live calculate total value
  const totalValue =
    formData.orderQty && formData.sellingPrice
      ? Number(formData.orderQty) * Number(formData.sellingPrice)
      : 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add current product to the selected items list
  const handleAddProduct = () => {
    const product = products.find((p) => p.productId === formData.productId);
    if (!product || !formData.orderQty || !formData.sellingPrice) return;

    const item = {
      productId: product.productId,
      productName: product.productName,
      //  customerId: product.customerId,
      // customerName:product.customerName,
      orderQty: Number(formData.orderQty),
      sellingPrice: Number(formData.sellingPrice),
      itemTotalValue: totalValue,
      status: "pending",
    };

    console.log("Added item:", item);

    setSelectedItems((prev) => [...prev, item]);

    // Clear product fields
    setFormData((prev) => ({
      ...prev,
      productId: "",
      orderQty: "",
      sellingPrice: "",
      productSearch: "",
    }));
  };

  // Post final CO to backend
  const handleSaveOrder = async () => {
    if (!formData.customerId || selectedItems.length === 0) {
      alert("Customer and at least one product required.");
      return;
    }

    const orderPayload = {
      coNo: formData.coNo,
      date: formData.date,
      customerId: formData.customerId,
      // customerName:formData.customerName,
      paymentStatus: formData.paymentStatus,
      remark: formData.remarks,
      items: selectedItems,
      
    };

    try {
      const res = await fetch(
        "http://localhost:5004/api/Customer-Order/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderPayload),
        }
      );
      const data = await res.json();
      console.log("Order Created:", data);
      if (!res.ok) throw new Error(data.message);
      alert("Order created successfully");
      onSuccess();
      onCancel();
    } catch (err) {
      console.error("Save Order Error:", err.message);
      alert("Failed to create order.");
    }
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg w-full">
      <h2 className="text-xl font-semibold mb-4">Customer Order Register</h2>

      {/* Header */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div>
          <Label htmlFor="coNo">CO No</Label>
          <TextInput id="coNo" name="coNo" readOnly value={formData.coNo} />
        </div>
        <div>
          <Label htmlFor="date">Date</Label>
          <TextInput
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="customerId">Customer</Label>
          <TextInput
            type="text"
            id="customerSearch"
            name="customerSearch"
            value={formData.customerSearch || ""}
            onChange={(e) => {
              const search = e.target.value.toLowerCase();
              setFormData((prev) => ({
                ...prev,
                customerSearch: search,
              }));
            }}
            placeholder="Type customer ID or name..."
          />

          {formData.customerSearch && (
            <ul className="bg-white text-black border max-h-40 overflow-y-auto rounded mt-1 z-10">
              {customers
                .filter(
                  (c) =>
                    c.name?.toLowerCase().includes(formData.customerSearch) ||
                    "" ||
                    c.customerId
                      ?.toLowerCase()
                      .includes(formData.customerSearch) ||
                    ""
                )
                .map((c) => (
                  <li
                    key={c.customerId}
                    className="px-2 py-1 hover:bg-gray-200 cursor-pointer"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        customerId: c.customerId,
                        customerSearch: `${c.customerId} - ${c.name}`,
                      }));
                    }}
                  >
                    {c.customerId} - {c.name}
                  </li>
                ))}
            </ul>
          )}
        </div>
        <div>
          <Label htmlFor="paymentStatus">Payment Status</Label>
          <Select
            id="paymentStatus"
            name="paymentStatus"
            value={formData.paymentStatus}
            onChange={handleChange}
          >
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
            <option value="Cheque">Cheque</option>
          </Select>
        </div>
      </div>

      <div className="mb-4">
        <Label htmlFor="remarks">Remarks</Label>
        <Textarea
          id="remarks"
          name="remarks"
          rows={2}
          value={formData.remarks}
          onChange={handleChange}
        />
      </div>

      {/* Product Section */}
      <div className="grid grid-cols-4 gap-4 items-end mb-4">
        <div>
          <Label htmlFor="productSearch">Search Product</Label>
          <TextInput
            type="text"
            id="productSearch"
            name="productSearch"
            value={formData.productSearch || ""}
            onChange={(e) => {
              const search = e.target.value.toLowerCase();
              setFormData((prev) => ({
                ...prev,
                productSearch: search,
              }));
            }}
            placeholder="Type product name or code..."
          />

          {formData.productSearch && (
            <ul className="bg-white text-black border max-h-40 overflow-y-auto rounded mt-1 z-10">
              {products
                .filter(
                  (p) =>
                    (p.productName?.toLowerCase() || "").includes(
                      formData.productSearch
                    ) ||
                    (p.productId?.toLowerCase() || "").includes(
                      formData.productSearch
                    )
                )
                .map((p) => (
                  <li
                    key={p.productId}
                    className="px-2 py-1 hover:bg-gray-200 cursor-pointer"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        productId: p.productId,
                        sellingPrice: p.sellingPrice || p.price || 0,

                        productSearch: `${p.productId} - ${p.productName}`,
                      }));
                    }}
                  >
                    {p.productId} - {p.productName}
                  </li>
                ))}
            </ul>
          )}
        </div>
        <div>
          <Label htmlFor="orderQty">Order Qty</Label>
          <TextInput
            id="orderQty"
            name="orderQty"
            type="number"
            value={formData.orderQty}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="sellingPrice">Unit Price</Label>
          <TextInput
            id="sellingPrice"
            name="sellingPrice"
            type="number"
            value={formData.sellingPrice}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label>Total Value</Label>
          <TextInput readOnly value={totalValue} />
        </div>
      </div>

      <Button color="blue" className="mb-6" onClick={handleAddProduct}>
        Add Product to Order
      </Button>

      {/* Summary Table */}
      {selectedItems.length > 0 && (
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-sm text-white border border-gray-700">
            <thead className="bg-gray-800 text-gray-300">
              <tr>
                <th className="px-4 py-2">Product ID</th>
                <th className="px-4 py-2">Product Name</th>
                <th className="px-4 py-2">status</th>
                <th className="px-4 py-2">Qty</th>
                <th className="px-4 py-2">Unit Price</th>
                <th className="px-4 py-2">Total Value</th>
              </tr>
            </thead>
            <tbody>
              {selectedItems.map((item, idx) => (
                <tr key={idx} className="bg-gray-700">
                  <td className="px-4 py-2">{item.productId}</td>
                  <td className="px-4 py-2">{item.productName}</td>
                  <td className="px-4 py-2">{item.status}</td>
                  <td className="px-4 py-2">{item.orderQty}</td>
                  <td className="px-4 py-2">{item.sellingPrice}</td>
                  <td className="px-4 py-2">{item.itemTotalValue}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-800 text-gray-100 font-semibold">
                <td colSpan="4" className="text-right px-4 py-2">
                  Order Total
                </td>
                <td className="px-4 py-2">
                  {selectedItems.reduce(
                    (sum, item) => sum + (item.itemTotalValue || 0),
                    0
                  )}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {/* Final Save and Cancel */}
      <div className="flex gap-4 mt-6">
        <Button color="green" onClick={handleSaveOrder}>
          Save Order
        </Button>
        <Button color="gray" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default COForm;
