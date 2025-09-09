import React, { useEffect, useState } from "react";
import { Label, TextInput, Textarea, Button, Card } from "flowbite-react";
import { useNavigate } from "react-router-dom";

const GetOnePendingPSN = () => {
  const [psnData, setPsnData] = useState(null);

  const navigate = useNavigate();
  const psnId = new URLSearchParams(window.location.search).get("id");

  useEffect(() => {
    if (psnId) {
      fetch(`http://localhost:5009/api/psn/pending/${psnId}`)
        .then((res) => res.json())
        .then((data) => setPsnData(data))
        .catch((err) => console.error("Error fetching PSN:", err));
    }
  }, [psnId]);

  if (!psnData) return <p className="text-white">Loading PSN details...</p>;
  console.log("PSN Data:", psnData); // Debugging line
  //   const finishedDate = new Date().toISOString().split("T")[0]; // Today

  const handleApprove = async () => {
    try {
      const res = await fetch(`http://localhost:5009/api/psn/start/${psnId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update PSN");
      //
      alert("PSN marked as Started successfully");
      //
      navigate("/dashboard?tab=PSNRegister");
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg">
      <h2 className="text-xl font-semibold mb-4">PSN Details</h2>

      {/* Customer & CO Details */}
      <Card className="bg-gray-800 mb-6">
        <div className="grid grid-cols-4 gap-3">
          <div>
            <Label>PSN No</Label>
            <TextInput readOnly value={psnData.PSNNo} />
          </div>
          <div>
            <Label>CO No</Label>
            <TextInput readOnly value={psnData.coNo} />
          </div>
          <div>
            <Label>Customer</Label>
            <TextInput
              readOnly
              value={`${psnData.customerId} - ${psnData.customerName}`}
            />
          </div>
          <div>
            <Label>Order Date</Label>
            <TextInput
              readOnly
              type="date"
              value={psnData.orderDate?.split("T")[0] || ""}
            />
          </div>
          <div className="flex col-span-3 gap-4">
            <div className="flex-1">
              <Label>Remark</Label>
              <Textarea
                readOnly
                value={psnData.remark || ""}
                className="w-full"
              />
            </div>
            <div className="w-1/3">
              <Label>PSN created date</Label>
              <TextInput
                type="text"
                readOnly
                value={
                  psnData.createdAt
                    ? new Date(psnData.createdAt).toLocaleDateString()
                    : ""
                }
                className="w-full"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* CO Items Table */}
      <Card className="bg-gray-800 mb-6">
        <h3 className="text-lg mb-2">Customer Order Items</h3>
        <table className="w-full text-sm text-white border border-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-2">Product Name</th>
              <th className="px-4 py-2">Qty</th>
              <th className="px-4 py-2">Selling Price</th>
              <th className="px-4 py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {psnData.items.map((i, idx) => (
              <tr key={idx} className="bg-gray-600">
                <td className="px-4 py-2">{i.productName}</td>
                <td className="px-4 py-2 text-center">{i.qty}</td>
                <td className="px-4 py-2 text-center">
                  {(i.unitPrice || 0).toFixed(2)}
                </td>
                <td className="px-4 py-2 text-center">
                  {(i.totalValue || 0).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-700 font-semibold">
              <td colSpan="3" className="text-right px-4 py-2">
                Order Total Value
              </td>
              <td className="px-4 py-2">{psnData.orderTotalValue}</td>
            </tr>
          </tfoot>
        </table>
      </Card>

      {/* Extra Materials Table */}
      <Card className="bg-gray-800 mb-6">
        <h3 className="text-lg mb-2">Extra Materials</h3>
        {psnData.extraMaterials.length > 0 ? (
          <table className="w-full text-sm text-white border border-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-2">Material</th>
                <th className="px-4 py-2">Qty</th>
                <th className="px-4 py-2">Unit Price</th>
                <th className="px-4 py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {psnData.extraMaterials.map((m, idx) => (
                <tr key={idx} className="bg-gray-600">
                  <td className="px-4 py-2">{m.materialName}</td>
                  <td className="px-4 py-2 text-center">{m.qty}</td>
                  <td className="px-4 py-2 text-center">
                    {(m.unitPrice || 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {(m.totalValue || 0).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No extra materials</p>
        )}
        <div className="flex col-span-3 gap-3">
          <div className="w-1/3">
            <Label>Total Material Cost</Label>
            <TextInput readOnly value={psnData.extraMaterialTotal.toFixed(2)} />
          </div>
          <div className="w-1/3">
            <Label>Other Cost</Label>
            <TextInput readOnly value={psnData.otherCost.toFixed(2)} />
          </div>
          <div className="w-1/3">
            <Label>Final Cost</Label>
            <TextInput readOnly value={psnData.finalValue.toFixed(2)} />
          </div>
        </div>
      </Card>

      {/* Buttons */}
      <div className="flex gap-4">
        <Button color="green" onClick={handleApprove}>
          Start PSN
        </Button>
        <Button
          color="gray"
          onClick={() => navigate("/dashboard?tab=PendingPsnList")}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default GetOnePendingPSN;
