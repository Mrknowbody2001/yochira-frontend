import React, { useEffect, useState } from "react";
import { Label, TextInput, Textarea, Button, Card } from "flowbite-react";
import { useNavigate } from "react-router-dom";

const GetOneQCN = () => {
  const [psnData, setPsnData] = useState(null);
  const [qcDate, setQcDate] = useState(new Date().toISOString().split("T")[0]);
  const [qcItems, setQcItems] = useState([]);
  const navigate = useNavigate();
  const psnId = new URLSearchParams(window.location.search).get("id");

  useEffect(() => {
    if (psnId) {
      fetch(`http://localhost:5010/api/qc/finished/${psnId}`)
        .then((res) => res.json())
        .then((data) => {
          setPsnData(data);
          setQcItems(
            data.items.map((item) => ({
              ...item,
              passQty: 0,
              reworkQty: 0,
              failQty: 0,
            }))
          );
        })
        .catch((err) => console.error("Error fetching PSN:", err));
    }
  }, [psnId]);

  const handleQtyChange = (index, field, value) => {
    const updatedItems = [...qcItems];
    updatedItems[index][field] = Number(value) || 0;
    setQcItems(updatedItems);
  };

  const validateQuantities = () => {
    for (let item of qcItems) {
      const total = item.passQty + item.reworkQty + item.failQty;
      if (total !== item.qty) {
        return `Mismatch for ${item.productName}: total = ${total}, should be ${item.qty}`;
      }
    }
    return null;
  };

  const handleSubmitQC = async () => {
    const validationError = validateQuantities();
    if (validationError) {
      alert(validationError);
      return;
    }

    const payload = {
      psnId: psnData._id,
      psnNo: psnData.PSNNo,
      coNo: psnData.coNo,
      customerName: psnData.customerName,
      qcDate,
      items: qcItems.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        orderedQty: item.qty,
        passQty: item.passQty,
        reworkQty: item.reworkQty,
        failQty: item.failQty,
        unitPrice: item.unitPrice,
        totalValue: item.totalValue,
      })),
    };

    try {
      const res = await fetch("http://localhost:5010/api/qc/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create QC Note");

      alert("QC Note created successfully");
      navigate("/dashboard?tab=QcRegister");
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  if (!psnData) return <p className="text-white">Loading QC details...</p>;

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Create QC Note</h2>

      {/* PSN Details */}
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
              <Textarea readOnly value={psnData.remark || ""} />
            </div>
            <div className="w-1/3">
              <Label>PSN Created Date</Label>
              <TextInput
                readOnly
                value={
                  psnData.createdAt
                    ? new Date(psnData.createdAt).toLocaleDateString()
                    : ""
                }
              />
            </div>
            <div className="w-1/3">
              <Label>PSN Finished Date</Label>
              <TextInput
                readOnly
                value={
                  psnData.finishedDate
                    ? new Date(psnData.finishedDate).toLocaleDateString()
                    : ""
                }
              />
            </div>
          </div>
        </div>
      </Card>

      {/* QC Table */}
      <Card className="bg-gray-800 mb-6">
        <h3 className="text-lg mb-2">QC Items</h3>
        <table className="w-full text-sm text-white border border-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-2">Product</th>
              <th className="px-4 py-2">Ordered Qty</th>
              <th className="px-4 py-2">Pass Qty</th>
              <th className="px-4 py-2">Rework Qty</th>
              <th className="px-4 py-2">Fail Qty</th>
            </tr>
          </thead>
          <tbody>
            {qcItems.map((item, idx) => (
              <tr key={idx} className="bg-gray-600">
                <td className="px-4 py-2">{item.productName}</td>
                <td className="px-4 py-2 text-center">{item.qty}</td>
                <td className="px-4 py-2">
                  <TextInput
                    type="number"
                    min="0"
                    value={item.passQty}
                    onChange={(e) =>
                      handleQtyChange(idx, "passQty", e.target.value)
                    }
                  />
                </td>
                <td className="px-4 py-2">
                  <TextInput
                    type="number"
                    min="0"
                    value={item.reworkQty}
                    onChange={(e) =>
                      handleQtyChange(idx, "reworkQty", e.target.value)
                    }
                  />
                </td>
                <td className="px-4 py-2">
                  <TextInput
                    type="number"
                    min="0"
                    value={item.failQty}
                    onChange={(e) =>
                      handleQtyChange(idx, "failQty", e.target.value)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* QC Date */}
      <Card className="bg-gray-800 mb-6">
        <div>
          <Label>QC Date</Label>
          <TextInput
            type="date"
            value={qcDate}
            onChange={(e) => setQcDate(e.target.value)}
          />
        </div>
      </Card>

      {/* Buttons */}
      <div className="flex gap-4">
        <Button color="green" onClick={handleSubmitQC}>
          Save QC
        </Button>
        <Button
          color="gray"
          onClick={() => navigate("/dashboard?tab=QCRegister")}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default GetOneQCN;
