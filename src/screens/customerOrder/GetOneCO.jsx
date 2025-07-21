import React, { useEffect, useState } from "react";
import { Label, TextInput, Button, Textarea } from "flowbite-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { get } from "flowbite-react/helpers/get";
const GetOneCO = () => {
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();
  const orderId = searchParams.get("id");
  //
  const [orderData, setOrderData] = useState(null);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    productSearch: "",
    productId: "",
    orderQty: "",
    sellingPrice: "",
  });
  const [selectedItems, setSelectedItems] = useState([]);
  //

  useEffect(() => {
    // Fetch existing order
    fetch(`http://localhost:5004/api/Customer-Order/${orderId}`)
      .then((res) => res.json())
      .then((data) => setOrderData(data.order))
      .catch((err) => {
        console.error("Failed to load order", err);
        alert("Order not found");
      });

    // Load products
    fetch("http://localhost:5004/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []))
      .catch((err) => {
        console.error("Failed to load products", err);
      });
  }, [orderId]);

  const totalValue =
    formData.orderQty && formData.sellingPrice
      ? Number(formData.orderQty) * Number(formData.sellingPrice)
      : 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = async () => {
    const product = products.find((p) => p.productId === formData.productId);
    if (!product || !formData.orderQty || !formData.sellingPrice) {
      alert("Invalid product details");
      return;
    }

    const newItem = {
      productId: product.productId,
      productName: product.productName,
      barcode: product.productCode,
      category: product.category,
      subCategory: product.subCategory,
      orderQty: Number(formData.orderQty),
      sellingPrice: Number(formData.sellingPrice),
      itemTotalValue: totalValue,
      status: "pending",
    };

    const updatedItems = [...orderData.items, newItem];
    const newTotal = updatedItems.reduce(
      (sum, item) => sum + (item.itemTotalValue || 0),
      0
    );

    const payload = {
      customerId: orderData.customerId,
      items: updatedItems,
      paymentStatus: orderData.paymentStatus,
      remark: orderData.remark,
    };

    try {
      const res = await fetch(
        `http://localhost:5004/api/Customer-Order/update/${orderId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error");
      alert("Product added to order successfully");
      onSuccess();
      onCancel();
    } catch (err) {
      console.error("Failed to update order:", err.message);
      alert("Failed to add product.");
    }
  };

  if (!orderData) return <p className="text-white">Loading order...</p>;

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">
        Customer Order (CO No: {orderData.coNo})
      </h2>

      <div className="grid grid-cols-4 gap-4 mb-4">
        <div>
          <Label>Customer</Label>
          <TextInput
            value={`${orderData.customerId} - ${orderData.customerName}`}
            readOnly
          />
        </div>
        <div>
          <Label>Order Date</Label>
          <TextInput
            value={new Date(orderData.orderDate).toLocaleDateString()}
            readOnly
          />
        </div>
        <div>
          <Label>Payment Status</Label>
          <TextInput value={orderData.paymentStatus} readOnly />
        </div>
        <div>
          <Label>Remark</Label>
          <Textarea rows={1} value={orderData.remark} readOnly />
        </div>
      </div>

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
          <Label>Total</Label>
          <TextInput readOnly value={totalValue} />
        </div>
      </div>
      {/* summery table */}
      {orderData.items?.length > 0 && (
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
              {orderData.items.map((item, idx) => (
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
                  {orderData.items.reduce(
                    (sum, item) => sum + (item.itemTotalValue || 0),
                    0
                  )}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      <div className="flex gap-4 mt-6">
        <Button color="green" onClick={handleAddProduct}>
          Add Product to Order
        </Button>
        <Button
          color="gray"
          onClick={() => {
            navigate("/dashboard?tab=CoRegister");
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default GetOneCO;
