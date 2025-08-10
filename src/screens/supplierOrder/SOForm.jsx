import React, { useEffect, useState } from "react";
import {
  Label,
  TextInput,
  Select,
  Textarea,
  Button,
  Card,
} from "flowbite-react";

const SupplierOrderForm = ({ onCancel, onSuccess }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [formData, setFormData] = useState({
    soNo: "",
    date: new Date().toISOString().split("T")[0],
    supplierId: "",
    paymentType: "Cash",
    deliveryDate: "",
    remarks: "",
    materialId: "",
    qty: "",
    unitPrice: "",
    unitName: "",
  });

  // Fetch suppliers + SO number
  useEffect(() => {
    fetch("http://localhost:5007/api/supplier/getAllApprovedSuppliers?status=approved")
      .then((res) => res.json())
      .then((data) => setSuppliers(data.suppliers || []))
      .catch(() => setSuppliers([]));

    fetch("http://localhost:5007/api/supplier-order/new-so-number")
      .then((res) => res.json())
      .then((data) =>
        setFormData((prev) => ({ ...prev, soNo: data.soNumber || "ERROR" }))
      )
      .catch(() => {});
  }, []);

  // Fetch mapped materials when supplier changes
  useEffect(() => {
    if (!formData.supplierId) return;
    fetch(`http://localhost:5007/api/mapping/supplier/${formData.supplierId}`)
      .then((res) => res.json())
      .then((data) => setMaterials(data.materials || []))
      .catch(() => setMaterials([]));
  }, [formData.supplierId]);

  // When material selected → auto fill price & unit
  const handleMaterialSelect = (materialId) => {
    const mat = materials.find((m) => m.materialId === materialId);
    if (!mat) return;
    setFormData((prev) => ({
      ...prev,
      materialId,
      unitPrice: mat.unitPrice || 0,
      unitName: mat.unitName || "",
    }));
  };

  const totalValueForOne =
    formData.qty && formData.unitPrice
      ? Number(formData.qty) * Number(formData.unitPrice)
      : 0;

  const handleAddMaterial = () => {
    if (!formData.materialId || !formData.qty) return;
    const mat = materials.find((m) => m.materialId === formData.materialId);
    const item = {
      materialId: mat.materialId,
      materialName: mat.materialName,
      qty: Number(formData.qty),
      unitPrice: Number(formData.unitPrice),
      unitName: formData.unitName,
      total: totalValueForOne,
    };
    setSelectedItems((prev) => [...prev, item]);
    setFormData((prev) => ({
      ...prev,
      materialId: "",
      qty: "",
      unitPrice: "",
      unitName: "",
    }));
  };

  const grandTotal = selectedItems.reduce((sum, i) => sum + i.total, 0);

  const handleSaveOrder = async () => {
    if (!formData.supplierId || selectedItems.length === 0) {
      alert("Supplier and at least one material required.");
      return;
    }
    const orderPayload = {
      soNo: formData.soNo,
      date: formData.date,
      supplierId: formData.supplierId,
      paymentType: formData.paymentType,
      deliveryDate: formData.deliveryDate,
      remarks: formData.remarks,
      items: selectedItems,
    };
    try {
      const res = await fetch(
        "http://localhost:5007/api/supplier-order/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderPayload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      alert("Supplier Order created successfully");
      onSuccess();
      onCancel();
    } catch (err) {
      console.error(err);
      alert("Failed to create supplier order.");
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Supplier Order Register</h2>

      {/* Card 1 - Order Details */}
      <Card className="bg-gray-800 mb-6">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="soNo">SO No</Label>
            <TextInput id="soNo" name="soNo" value={formData.soNo} readOnly />
          </div>
          <div>
            <Label htmlFor="date">Date</Label>
            <TextInput
              type="date"
              name="date"
              value={formData.date}
              onChange={(e) =>
                setFormData((p) => ({ ...p, date: e.target.value }))
              }
            />
          </div>
          <div>
            <Label htmlFor="supplierId">Supplier</Label>
            <Select
              value={formData.supplierId}
              onChange={(e) =>
                setFormData((p) => ({ ...p, supplierId: e.target.value }))
              }
            >
              <option value="">Select Supplier</option>
              {suppliers.map((s) => (
                <option key={s.supplierId} value={s.supplierId}>
                  {s.supplierId} - {s.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="paymentType">Payment Type</Label>
            <Select
              name="paymentType"
              value={formData.paymentType}
              onChange={(e) =>
                setFormData((p) => ({ ...p, paymentType: e.target.value }))
              }
            >
              <option value="Cash">Cash</option>
              <option value="Cheque">Cheque</option>
              <option value="Card">Card</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="deliveryDate">Delivery Date</Label>
            <TextInput
              type="date"
              name="deliveryDate"
              value={formData.deliveryDate}
              onChange={(e) =>
                setFormData((p) => ({ ...p, deliveryDate: e.target.value }))
              }
            />
          </div>
          <div className="col-span-3">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              name="remarks"
              value={formData.remarks}
              onChange={(e) =>
                setFormData((p) => ({ ...p, remarks: e.target.value }))
              }
            />
          </div>
        </div>
      </Card>

      {/* Card 2 - Materials */}
      <Card className="bg-gray-800">
        <div className="grid grid-cols-5 gap-4 items-end mb-4">
          <div>
            <Label>Material Name</Label>
            <Select
              value={formData.materialId}
              onChange={(e) => handleMaterialSelect(e.target.value)}
            >
              <option value="">Select Material</option>
              {materials.map((m) => (
                <option key={m.materialId} value={m.materialId}>
                  {m.materialId} - {m.materialName}
                </option>
              ))}
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
            <Label>Unit Name</Label>
            <TextInput readOnly value={formData.unitName} />
          </div>
          <div>
            <Label>Total</Label>
            <TextInput readOnly value={totalValueForOne} />
          </div>
        </div>

        <Button color="blue" onClick={handleAddMaterial} className="mb-4">
          Add Material
        </Button>

        {selectedItems.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-white border border-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-2">Material ID</th>
                  <th className="px-4 py-2">Material Name</th>
                  <th className="px-4 py-2">Qty</th>
                  <th className="px-4 py-2">Unit Price</th>
                  <th className="px-4 py-2">Unit Name</th>
                  <th className="px-4 py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedItems.map((i, idx) => (
                  <tr key={idx} className="bg-gray-600">
                    <td className="px-4 py-2">{i.materialId}</td>
                    <td className="px-4 py-2">{i.materialName}</td>
                    <td className="px-4 py-2">{i.qty}</td>
                    <td className="px-4 py-2">{i.unitPrice}</td>
                    <td className="px-4 py-2">{i.unitName}</td>
                    <td className="px-4 py-2">{i.total}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-700 font-semibold">
                  <td colSpan="5" className="text-right px-4 py-2">
                    Grand Total
                  </td>
                  <td className="px-4 py-2">{grandTotal}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </Card>

      {/* Buttons */}
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

export default SupplierOrderForm;
