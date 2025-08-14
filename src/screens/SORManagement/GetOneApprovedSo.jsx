import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button, Card } from "flowbite-react";

//!create SORN from approved SO
export default function GetOneApprovedSo() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sornNo, setSornNo] = useState("");

  //! get sorn no
  useEffect(() => {
  const fetchSORNNo = async () => {
    try {
      const res = await fetch("http://localhost:5007/api/sorn/sorn-no");
      const data = await res.json();
      setSornNo(data.SORNNo || "ERROR");
    } catch (err) {
      console.error("Failed to fetch SORNNo", err);
      setSornNo("ERROR");
    }
  };

  fetchSORNNo();
}, []);

  //! Fetch order by id
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:5007/api/supplier-orders/${id}`
        );
        if (!res.ok) throw new Error("Failed to fetch order");
        const data = await res.json();
        setOrder(data);

        // Add receiveQty default to 0
        if (data?.items) {
          setItems(data.items.map((i) => ({ ...i, receiveQty: 0 })));
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  const handleReceiveQtyChange = (idx, value) => {
    const updated = [...items];
    updated[idx].receiveQty = Number(value) || 0;
    setItems(updated);
  };

  const calculateRowValues = (item) => {
    const total = item.value ?? item.qty * (item.unitPrice ?? 0);
    const receiveTotal = (item.receiveQty ?? 0) * (item.unitPrice ?? 0);
    const priceDifference = total - receiveTotal;
    return { total, receiveTotal, priceDifference };
  };

  const grandTotal = items.reduce(
    (sum, i) => sum + calculateRowValues(i).total,
    0
  );
  const totalPriceDifference = items.reduce(
    (sum, i) => sum + calculateRowValues(i).priceDifference,
    0
  );

  if (loading) return <p>Loading...</p>;
  if (!order) return <p>Order not found</p>;

  //!Handle SORN creation
const handleCreateSORN = async () => {
  if (!order?.supplierId) {
    alert("Supplier information missing.");
    return;
  }

  if (!items || items.length === 0) {
    alert("No materials found.");
    return;
  }

  // Prepare payload
  const sornPayload = {
    SORNNo: sornNo, // new field
    SORNDate: new Date().toISOString().split("T")[0], // today's date
    SONo: order.SONo,
    supplierId: order.supplierId,
    supplierName: order.supplierName,
    paymentType: order.paymentType,
    deliveryDate: order.deliveryDate,
    remark: order.remark || "",

    // Material list with receiveQty
    items: items.map(({ value, ...rest }) => ({
      ...rest,
      receiveQty: Number(rest.receiveQty) || 0,
      unitPrice: Number(rest.unitPrice) || 0,
      value: Number(value ?? rest.qty * (rest.unitPrice ?? 0)),
    })),

    // Totals
    grandTotal: grandTotal,
    totalPriceDifference: totalPriceDifference,
  };

  console.log("SORN Payload:", sornPayload);

  try {
    const res = await fetch("http://localhost:5007/api/sorn/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sornPayload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Unknown error");

    alert("SORN created successfully");
    navigate("/dashboard?tab=SOReceiveNoteList");
  } catch (err) {
    console.error(err);
    alert(`Failed to create SORN: ${err.message}`);
  }
};


  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Create SORN</h2>

      <Card className="bg-gray-800 mb-6">
        <h3 className="text-lg font-semibold mb-2">SOR Header</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-300">
              SO No
            </label>
            <p className="mt-1 text-white">{order.SONo}</p>
          </div>
          <div className="m-2">
            <label className="block text-sm font-medium text-gray-300">
              SORN No
            </label>
            <p className="mt-1 text-white">{sornNo}</p>
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-300">
              SORN Date
            </label>
            <input
              type="date"
              value={new Date().toISOString().split("T")[0]} // today's date
              readOnly
              className="mt-1 w-full bg-gray-700 text-white rounded px-2 py-1"
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-300">
              Supplier
            </label>
            <p className="mt-1 text-white">
              {order.supplierId}-{order.supplierName}
            </p>
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-300">
              Delivery Date
            </label>
            <p className="mt-1 text-white">
              {order.deliveryDate
                ? new Date(order.deliveryDate).toLocaleDateString()
                : "-"}
            </p>
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-300">
              SO Create Date
            </label>
            <p className="mt-1 text-white">
              {order.createdAt
                ? new Date(order.createdAt).toLocaleDateString()
                : "-"}
            </p>
          </div>
          <div className="block">
            <label className="block text-sm font-medium text-gray-300">
              Remarks
            </label>
            <p className="mt-1 text-white whitespace-pre-wrap">
              {order.remark || "-"}
            </p>
          </div>
          <div className="block">
            <label className="block text-sm font-medium text-gray-300">
              Payment Type
            </label>
            <p className="mt-1 text-white whitespace-pre-wrap">
              {order.paymentType || "-"}
            </p>
          </div>
        </div>
      </Card>

      <Card className="bg-gray-800">
        <h3 className="text-lg font-semibold text-white mb-4">
          Material Details
        </h3>
        {items.length > 0 ? (
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
                  <th className="px-2 py-1">Receive Qty</th>
                  <th className="px-2 py-1">Price Difference</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => {
                  const { total, priceDifference } = calculateRowValues(item);
                  return (
                    <tr key={idx} className="bg-gray-600">
                      <td className="px-2 py-1 text-center">
                        {item.materialId}
                      </td>
                      <td className="px-2 py-1 text-center">
                        {item.materialName}
                      </td>
                      <td className="px-2 py-1 text-center">{item.qty}</td>
                      <td className="px-2 py-1 text-center">
                        {(item.unitPrice ?? 0).toFixed(2)}
                      </td>
                      <td className="px-2 py-1 text-center">{item.unitName}</td>
                      <td className="px-2 py-1 text-center">
                        {total.toFixed(2)}
                      </td>
                      <td className="px-2 py-1 text-center">
                        <input
                          type="number"
                          value={item.receiveQty}
                          onChange={(e) =>
                            handleReceiveQtyChange(idx, e.target.value)
                          }
                          className="w-20 text-black rounded px-1 py-0.5"
                        />
                      </td>
                      <td className="px-2 py-1 text-center">
                        {priceDifference.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-gray-700 font-semibold">
                  <td colSpan="7" className="text-center px-4 py-2">
                    Grand Total
                  </td>
                  <td className="px-2 py-1">{grandTotal.toFixed(2)}</td>
                  <td colSpan="2"></td>
                </tr>
                <tr className="bg-gray-700 font-semibold">
                  <td colSpan="7" className="text-center px-4 py-2">
                    Total Price Difference
                  </td>
                  <td className="px-2 py-1">
                    {totalPriceDifference.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <p>No materials added.</p>
        )}
      </Card>

      <div className="flex gap-4 mt-6">
        <Button color="green" onClick={handleCreateSORN}>
          Create SORN
        </Button>
        <Button
          color="gray"
          onClick={() => navigate("/dashboard?tab=ApprovedSOList")}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
