import React, { useEffect, useState } from "react";
import {
  Label,
  TextInput,
  Select,
  Textarea,
  Button,
  Card,
} from "flowbite-react";
import { useNavigate } from "react-router-dom";

const ProductionStartNote = () => {
  const [items, setItems] = useState([]); // Items from Customer Order
  const [extraMaterials, setExtraMaterials] = useState([]); // Added extra materials
  const [customers, setCustomers] = useState([]); // Customer list
  const [formData, setFormData] = useState({
    CONo: "",
    customerId: "",
    customerName: "",
    orderDate: new Date().toISOString().split("T")[0],
    remark: "",
    PSNNo: "",
    materialId: "",
    materialName: "",
    qty: "",
    unitPrice: "",
    otherCost: "",
  });

  const navigate = useNavigate();

  // Fetch customers and CO No
  useEffect(() => {
    fetch("http://localhost:5007/api/customers")
      .then((res) => res.json())
      .then((data) => setCustomers(data.customers || []))
      .catch(() => setCustomers([]));

    // Fetch CO No
    fetch("http://localhost:5007/api/customer-orders/new-co-number")
      .then((res) => res.json())
      .then((data) =>
        setFormData((prev) => ({ ...prev, CONo: data.CONo || "ERROR" }))
      )
      .catch(() => {});
  }, []);

  // Fetch PSN No
  useEffect(() => {
    fetch("http://localhost:5007/api/production/psn-number")
      .then((res) => res.json())
      .then((data) =>
        setFormData((prev) => ({ ...prev, PSNNo: data.PSNNo || "ERROR" }))
      )
      .catch(() => {});
  }, []);

  // Handle extra material select (you can replace with real API call)
  const handleMaterialSelect = (id) => {
    const mat = {
      materialId: id,
      materialName: `Material ${id}`,
      unitPrice: 100,
    }; // Demo data
    setFormData((prev) => ({
      ...prev,
      materialId: mat.materialId,
      materialName: mat.materialName,
      unitPrice: mat.unitPrice,
      qty: "",
    }));
  };

  // Calculate totals
  const extraMaterialTotal = extraMaterials.reduce(
    (sum, i) => sum + i.value,
    0
  );
  const itemsTotal = items.reduce((sum, i) => sum + i.total, 0);
  const otherCost = Number(formData.otherCost) || 0;
  const finalValue = itemsTotal + extraMaterialTotal + otherCost;

  // Add extra material
  const handleAddMaterial = () => {
    if (!formData.materialId || !formData.qty) return;
    const value = Number(formData.qty) * Number(formData.unitPrice);
    const newItem = {
      materialId: formData.materialId,
      materialName: formData.materialName,
      qty: Number(formData.qty),
      unitPrice: Number(formData.unitPrice),
      value,
    };
    setExtraMaterials((prev) => [...prev, newItem]);
    setFormData((prev) => ({
      ...prev,
      materialId: "",
      materialName: "",
      qty: "",
      unitPrice: "",
    }));
  };

  const handleSubmit = async () => {
    if (!formData.customerId) {
      alert("Please select a customer");
      return;
    }

    const payload = {
      CONo: formData.CONo,
      customerId: formData.customerId,
      orderDate: formData.orderDate,
      remark: formData.remark,
      PSNNo: formData.PSNNo,
      items,
      extraMaterials,
      otherCost,
      finalValue,
    };

    try {
      const res = await fetch(
        "http://localhost:5007/api/production/create-psn",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Unknown error");
      alert("Production Start Note created successfully");
      navigate("/dashboard?tab=PSNRegister");
    } catch (err) {
      alert(`Failed to create PSN: ${err.message}`);
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Production Start Note</h2>

      {/* Card 1 - Customer & Order Details */}
      <Card className="bg-gray-800 mb-6">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>CO No</Label>
            <TextInput readOnly value={formData.CONo} />
          </div>
          <div>
            <Label>Customer</Label>
            <Select
              value={formData.customerId}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  customerId: e.target.value,
                  customerName:
                    customers.find((c) => c.id === e.target.value)?.name || "",
                }))
              }
            >
              <option value="">Select Customer</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id} - {c.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Order Date</Label>
            <TextInput
              type="date"
              value={formData.orderDate}
              onChange={(e) =>
                setFormData((p) => ({ ...p, orderDate: e.target.value }))
              }
            />
          </div>
          <div className="col-span-3">
            <Label>Remark</Label>
            <Textarea
              value={formData.remark}
              onChange={(e) =>
                setFormData((p) => ({ ...p, remark: e.target.value }))
              }
            />
          </div>
        </div>
      </Card>

      {/* Card 2 - Existing Items */}
      <Card className="bg-gray-800 mb-6">
        <h3 className="text-lg mb-2">Customer Order Items</h3>
        {items.length > 0 ? (
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
              {items.map((i, idx) => (
                <tr key={idx} className="bg-gray-600">
                  <td className="px-4 py-2">{i.materialName}</td>
                  <td className="px-4 py-2">{i.qty}</td>
                  <td className="px-4 py-2">{i.unitPrice.toFixed(2)}</td>
                  <td className="px-4 py-2">{i.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-700 font-semibold">
                <td colSpan="3" className="text-right px-4 py-2">
                  Items Total
                </td>
                <td className="px-4 py-2">{itemsTotal.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        ) : (
          <p>No items available</p>
        )}
      </Card>

      {/* Card 3 - PSN Extra Materials & Cost */}
      <Card className="bg-gray-800 mb-6">
        <h3 className="text-lg mb-4">Production Details</h3>
        <div className="mb-4">
          <Label>PSN No</Label>
          <TextInput readOnly value={formData.PSNNo} />
        </div>
        <div className="grid grid-cols-5 gap-4 items-end mb-4">
          <div>
            <Label>Material</Label>
            <Select
              value={formData.materialId}
              onChange={(e) => handleMaterialSelect(e.target.value)}
            >
              <option value="">Select Material</option>
              <option value="M001">Material 1</option>
              <option value="M002">Material 2</option>
            </Select>
          </div>
          <div>
            <Label>Qty</Label>
            <TextInput
              type="number"
              value={formData.qty}
              onChange={(e) =>
                setFormData((p) => ({ ...p, qty: e.target.value }))
              }
            />
          </div>
          <div>
            <Label>Unit Price</Label>
            <TextInput readOnly value={formData.unitPrice} />
          </div>
          <div>
            <Label>Total</Label>
            <TextInput
              readOnly
              value={
                formData.qty && formData.unitPrice
                  ? (formData.qty * formData.unitPrice).toFixed(2)
                  : 0
              }
            />
          </div>
          <Button color="blue" onClick={handleAddMaterial}>
            Add
          </Button>
        </div>

        {/* Extra Material Table */}
        {extraMaterials.length > 0 && (
          <table className="w-full text-sm text-white border border-gray-700 mb-4">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-2">Material</th>
                <th className="px-4 py-2">Qty</th>
                <th className="px-4 py-2">Unit Price</th>
                <th className="px-4 py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {extraMaterials.map((m, idx) => (
                <tr key={idx} className="bg-gray-600">
                  <td className="px-4 py-2">{m.materialName}</td>
                  <td className="px-4 py-2">{m.qty}</td>
                  <td className="px-4 py-2">{m.unitPrice.toFixed(2)}</td>
                  <td className="px-4 py-2">{m.value.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-700 font-semibold">
                <td colSpan="3" className="text-right px-4 py-2">
                  Extra Materials Total
                </td>
                <td className="px-4 py-2">{extraMaterialTotal.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        )}

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <Label>Other Cost</Label>
            <TextInput
              type="number"
              value={formData.otherCost}
              onChange={(e) =>
                setFormData((p) => ({ ...p, otherCost: e.target.value }))
              }
            />
          </div>
          <div>
            <Label>Final Value</Label>
            <TextInput readOnly value={finalValue.toFixed(2)} />
          </div>
        </div>
      </Card>

      {/* Buttons */}
      <div className="flex gap-4">
        <Button color="green" onClick={handleSubmit}>
          Submit
        </Button>
        <Button color="gray" onClick={() => navigate("/dashboard")}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default ProductionStartNote;
