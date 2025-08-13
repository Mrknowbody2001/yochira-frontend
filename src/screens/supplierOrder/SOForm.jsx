import React, { useEffect, useState } from "react";
import {
  Label,
  TextInput,
  Select,
  Textarea,
  Button,
  Card,
} from "flowbite-react";
import { matchPath, useNavigate } from "react-router-dom";

const SupplierOrderForm = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [formData, setFormData] = useState({
    SONo: "",
    date: new Date().toISOString().split("T")[0],
    supplierId: "",
    paymentType: "cash",
    deliveryDate: "",
    remark: "",
    materialId: "",
    materialName: "",
    qty: "",
    unitPrice: "",
    unitName: "",
  });

  const navigate = useNavigate();
  // Fetch suppliers + SO number
  useEffect(() => {
    fetch(
      "http://localhost:5007/api/supplier/getAllApprovedSuppliers?status=approved"
    )
      .then((res) => res.json())
      .then((data) => setSuppliers(data.suppliers || []))
      .catch(() => setSuppliers([]));

    // fetch("http://localhost:5007/api/supplier-order/new-so-number")
    //   .then((res) => res.json())
    //   .then((data) =>
    //     setFormData((prev) => ({ ...prev, soNo: data.soNumber || "ERROR" }))
    //   )
    //   .catch(() => {});
  }, []);

  // Fetch mapped materials when supplier changes
  useEffect(() => {
    if (!formData.supplierId) return;
    fetch(`http://localhost:5007/api/mapping/supplier/${formData.supplierId}`)
      .then((res) => res.json())
      .then((data) => setMaterials(data.materials || []))
      .catch(() => setMaterials([]));
  }, [formData.supplierId]);

  //get sono

  useEffect(() => {
    const fetchSONo = async () => {
      try {
        const res = await fetch(
          "http://localhost:5007/api/supplier-orders/SoNo"
        );
        const data = await res.json();
        setFormData((prev) => ({
          ...prev,
          SONo: data.SONo || "ERROR",
        }));
      } catch (err) {
        console.error("Failed to fetch SONo", err);
      }
    };

    fetchSONo();
  }, []);
  // When material selected → auto fill price & unit
  const handleMaterialSelect = (materialId) => {
    const mat = materials.find((m) => m.materialId === materialId);
    if (!mat) return;
    setFormData((prev) => ({
      ...prev,
      materialId: mat.materialId,
      materialName: mat.materialName,
      unitPrice: Number(mat.defaultUnitPrice) || 0, // <== FIXED here
      unitName: mat.unit,
      qty: "",
    }));
  };

  const totalValueForOne =
    formData.qty && formData.unitPrice
      ? Number(formData.qty) * Number(formData.unitPrice)
      : 0;

  const handleAddMaterial = () => {
    if (!formData.materialId || !formData.qty) return;
    const mat = materials.find((m) => m.materialId === formData.materialId);
    if (!mat) {
      console.error("Material not found in the materials list");
      return;
    }

    const item = {
      materialId: mat.materialId,
      materialName: mat.materialName,
      qty: Number(formData.qty),
      unitPrice: Number(mat.defaultUnitPrice), // <== FIXED here
      unitName: mat.unit,
      value: totalValueForOne,
    };
    setSelectedItems((prev) => [...prev, item]);
    setFormData((prev) => ({
      ...prev,
      materialId: "",
      materialName: "",
      qty: "",
      unitPrice: 0,
      unitName: "",
    }));
  };

  const grandTotal = selectedItems.reduce((sum, i) => sum + i.value, 0);

  const handleSaveOrder = async () => {
    if (!formData.supplierId) {
      alert("Please select a supplier.");
      return;
    }
    if (!formData.deliveryDate) {
      alert("Please select a delivery date.");
      return;
    }
    if (selectedItems.length === 0) {
      alert("Please add at least one material.");
      return;
    }

    // Prepare payload matching backend expected field names
    const orderPayload = {
      SONo: formData.SONo,
      supplierId: formData.supplierId,
      paymentType: formData.paymentType,
      deliveryDate: formData.deliveryDate,
      remark: formData.remark, 
      items: selectedItems.map(({ value, unitPrice, ...rest }) => ({
        ...rest,
        unitPrice: Number(unitPrice), // ensure number
        value: Number(value), // ensure number
      })),
      orderTotalValue: grandTotal,
    };
    console.log("Order Payload:", orderPayload); // debug before sending
    try {
      const res = await fetch(
        "http://localhost:5007/api/supplier-orders/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderPayload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Unknown error");
      alert("Supplier Order created successfully");
      navigate("/dashboard?tab=SORegister");
    } catch (err) {
      console.error(err);
      alert(`Failed to create supplier order: ${err.message}`);
    }
  };

  //! Remove material from selected items
  const handleRemoveMaterial = async (materialId) => {
  if (!formData.supplierId) {
    alert("Please select a supplier before removing materials.");
    return;
  }

  if (!window.confirm("Are you sure you want to remove this material?")) {
    return;
  }

  try {
    const res = await fetch(
      `http://localhost:5007/api/mapping/removeMaterial-Mapping`,
      {
        method: "put",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supplierId: formData.supplierId,
          materialId: materialId,
        }),
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to remove material");

    // Update frontend list
    setSelectedItems((prev) =>
      prev.filter((item) => item.materialId !== materialId)
    );

    alert("Material removed successfully.");
  } catch (err) {
    console.error(err);
    alert(`Error: ${err.message}`);
  }
};


  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Supplier Order Register</h2>

      {/* Card 1 - Order Details */}
      <Card className="bg-gray-800 mb-6">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="SONo">SO No</Label>
            <TextInput id="SONo" name="SONo" value={formData.SONo} readOnly />
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
              <option value="cash">Cash</option>
              <option value="cheque">Cheque</option>
              <option value="card">Card</option>
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
              name="remark"
              value={formData.remark}
              onChange={(e) =>
                setFormData((p) => ({ ...p, remark: e.target.value }))
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
            <TextInput readOnly value={totalValueForOne.toFixed(2)} />
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
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {selectedItems.map((i, idx) => (
                  <tr key={idx} className="bg-gray-600">
                    <td className="px-4 py-2">{i.materialId}</td>
                    <td className="px-4 py-2">{i.materialName}</td>
                    <td className="px-4 py-2">{i.qty}</td>
                    <td className="px-4 py-2">{i.unitPrice.toFixed(2)}</td>
                    <td className="px-4 py-2">{i.unitName}</td>
                    <td className="px-4 py-2">{i.value.toFixed(2)}</td>
                    <td className="px-4 py-2">
                      <Button
                        color="failure"
                        size="xs"
                        onClick={() => handleRemoveMaterial(i.materialId)}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-700 font-semibold">
                  <td colSpan="5" className="text-right px-4 py-2">
                    Grand Total
                  </td>
                  <td className="px-4 py-2">{grandTotal.toFixed(2)}</td>
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
        <Button
          color="gray"
          onClick={() => navigate("/dashboard?tab=SORegister")}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default SupplierOrderForm;
