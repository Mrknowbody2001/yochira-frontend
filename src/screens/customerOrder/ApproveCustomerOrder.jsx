import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { TextInput, Textarea, Label, Button } from "flowbite-react";

const ApproveCustomerOrder = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get("id");

  const [orderData, setOrderData] = useState(null);
  const [approving, setApproving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(
          `http://localhost:5004/api/Customer-Order/${orderId}`
        );
        if (!res.ok) throw new Error("Failed to fetch order");
        const data = await res.json();
        setOrderData(data.order || data); // support both formats
      } catch (err) {
        console.error(err.message);
        setError("Failed to load order.");
      }
    };

    if (orderId) fetchOrder();
  }, [orderId]);

  const handleApproveOrder = async () => {
    setApproving(true);
    try {
      const res = await fetch(
        `http://localhost:5004/api/Customer-Order/approve/${orderId}`,
        {
          method: "PUT",
        }
      );

      if (!res.ok) throw new Error("Approval failed");

      alert("Order approved successfully");
      navigate("/dashboard?tab=CoApproval");
    } catch (err) {
      alert("Failed to approve order");
      console.error(err);
    } finally {
      setApproving(false);
    }
  };

  if (!orderData) return <p className="text-white">Loading order...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const orderTotal = orderData.items?.reduce(
    (sum, item) => sum + (item.itemTotalValue || 0),
    0
  );

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">
        Approve Customer Order (CO No: {orderData.coNo})
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

      {orderData.items?.length > 0 && (
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-sm text-white border border-gray-700">
            <thead className="bg-gray-800 text-gray-300">
              <tr>
                <th className="px-4 py-2">Product ID</th>
                <th className="px-4 py-2">Product Name</th>
                <th className="px-4 py-2">Status</th>
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
                <td colSpan="5" className="text-right px-4 py-2">
                  Order Total
                </td>
                <td className="px-4 py-2">{orderTotal}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      <div className="flex gap-4 mt-6">
        <Button color="green" onClick={handleApproveOrder} disabled={approving}>
          {approving ? "Approving..." : "Approve Order"}
        </Button>
        <Button
          color="gray"
          onClick={() => navigate("/dashboard?tab=PendingCO")}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default ApproveCustomerOrder;
