import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button, Card } from "flowbite-react";

export default function GetOnePendingSo() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);

  // Fetch pending order by id
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5007/api/supplier-orders/${id}`);
        if (!res.ok) throw new Error("Failed to fetch order");
        const data = await res.json();
        setOrder(data);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  const handleApprove = async () => {
    if (!id) return;

    try {
      setApproving(true);
      const res = await fetch(`http://localhost:5007/api/supplier-orders/approve/${id}`, {
        method: "PUT",
      });
      if (!res.ok) throw new Error("Failed to approve order");

      alert("Order approved successfully!");
      navigate("/dashboard?tab=PendingSO"); // or wherever you want to go after
    } catch (error) {
      console.error("Approval error:", error);
      alert("Approval failed!");
    } finally {
      setApproving(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!order) return <p>Order not found</p>;

  // Calculate grand total from order.items
  const grandTotal = order.items
    ? order.items.reduce((sum, i) => sum + (i.value ?? (i.qty * (i.unitPrice ?? 0))), 0)
    : 0;

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg max-w-5xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Pending Supplier Order Details</h2>

      <Card className="bg-gray-800 mb-6">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">SO No</label>
            <p className="mt-1 text-white">{order.SONo}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Supplier ID</label>
            <p className="mt-1 text-white">{order.supplierId}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Delivery Date</label>
            <p className="mt-1 text-white">
              {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : "-"}
            </p>
          </div>
          <div className="col-span-3">
            <label className="block text-sm font-medium text-gray-300">Remarks</label>
            <p className="mt-1 text-white whitespace-pre-wrap">{order.remark || "-"}</p>
          </div>
        </div>
      </Card>

      <Card className="bg-gray-800">
        <h3 className="font-semibold mb-4">Materials</h3>
        {order.items && order.items.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-white border border-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-2 py-1">Material ID</th>
                  <th className="px-2 py-1">Material Name</th>
                  <th className="px-2 py-1">Qty</th>
                  <th className="px-2 py-1">Unit Price</th>
                  <th className="px-2 py-1">Unit Name</th>
                  <th className="px-2 py-1">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, idx) => (
                  <tr key={idx} className="bg-gray-600">
                    <td className="px-2 py-1">{item.materialId}</td>
                    <td className="px-2 py-1">{item.materialName}</td>
                    <td className="px-2 py-1">{item.qty}</td>
                    <td className="px-2 py-1">{(item.unitPrice ?? 0).toFixed(2)}</td>
                    <td className="px-2 py-1">{item.unitName}</td>
                    <td className="px-2 py-1">{((item.value ?? (item.qty * (item.unitPrice ?? 0))) ?? 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-700 font-semibold">
                  <td colSpan="5" className="text-right px-4 py-2">
                    Grand Total
                  </td>
                  <td className="px-2 py-1">{grandTotal.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <p>No materials added.</p>
        )}
      </Card>

      <div className="flex gap-4 mt-6">
        <Button color="green" onClick={handleApprove} disabled={approving}>
          {approving ? "Approving..." : "Approve"}
        </Button>
        <Button color="gray" onClick={() => navigate("/dashboard?tab=PendingSo")}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
