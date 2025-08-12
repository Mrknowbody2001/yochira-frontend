import {
  Label,
  TextInput,
  Select,
  Textarea,
  Button,
  Card,
} from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function GetOneSupplierOrder() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [formData, setFormData] = useState({
    SONo: "",
    supplierId: "",
    paymentType: "",
    deliveryDate: "",
    remark: "",
    status: "pending",
  });

  const [materialForm, setMaterialForm] = useState({
    materialId: "",
    materialName: "",
    qty: "",
    unitPrice: 0,
    unitName: "",
  });

  const [selectedItems, setSelectedItems] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Total for one selected material
  const totalValueForOne =
    materialForm.qty && materialForm.unitPrice
      ? Number(materialForm.qty) * Number(materialForm.unitPrice)
      : 0;

  // Grand total for all selected items
  const grandTotal = selectedItems.reduce((sum, i) => sum + i.value, 0);

  // Fetch order data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const orderRes = await fetch(
          `http://localhost:5007/api/supplier-orders/${id}`
        );
        if (!orderRes.ok) throw new Error("Failed to fetch order");

        const order = await orderRes.json();
        console.log("Fetched Order:", order);

        setFormData({
          SONo: order.SONo || "",
          supplierId: order.supplierId || "",
          paymentType: order.paymentType || "",
          deliveryDate: order.deliveryDate
            ? order.deliveryDate.split("T")[0]
            : "",
          remark: order.remark || "",
          status: order.status || "pending",
        });

        setSelectedItems(order.items || []);
      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchInitialData();
  }, [id]);

  // Fetch materials for supplier
  useEffect(() => {
    const fetchMaterialsBySupplier = async () => {
      if (!formData.supplierId) {
        setMaterials([]);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:5007/api/mapping/supplier/${formData.supplierId}`
        );
        if (!res.ok) throw new Error("Failed to fetch materials");

        const materialsData = await res.json();
        console.log("Fetched Materials:", materialsData);
        setMaterials(materialsData.materials || []);
      } catch (error) {
        console.error("Error loading materials:", error);
        setMaterials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterialsBySupplier();
  }, [formData.supplierId]);

  // When supplier changes, reset materials
  const handleSupplierChange = (supplierId) => {
    setFormData((prev) => ({ ...prev, supplierId }));
    setSelectedItems([]);
    setMaterialForm({
      materialId: "",
      materialName: "",
      qty: "",
      unitPrice: 0,
      unitName: "",
    });
  };

  // Handle selecting a material
  const handleMaterialSelect = (materialId) => {
    const mat = materials.find(
      (m) => String(m.materialId) === String(materialId)
    );
    if (!mat) return;

    setMaterialForm({
      materialId: mat.materialId,
      materialName: mat.materialName,
      qty: "",
      unitPrice: Number(mat.defaultUnitPrice) || 0, // fixed to SOForm logic
      unitName: mat.unit || "",
    });
  };

  // Add material to order
  const handleAddMaterial = () => {
    if (!materialForm.materialId || !materialForm.qty) {
      alert("Please select a material and enter quantity");
      return;
    }

    const value = Number(materialForm.qty) * Number(materialForm.unitPrice);

    const newItem = {
      materialId: materialForm.materialId,
      materialName: materialForm.materialName,
      qty: Number(materialForm.qty),
      unitPrice: Number(materialForm.unitPrice),
      unitName: materialForm.unitName,
      value,
    };

    setSelectedItems((prev) => [...prev, newItem]);

    // Reset material form
    setMaterialForm({
      materialId: "",
      materialName: "",
      qty: "",
      unitPrice: 0,
      unitName: "",
    });
  };

  // Update order in DB
  const handleUpdate = async () => {
    try {
      const payload = {
        ...formData,
        items: selectedItems.map((i) => ({
          materialId: i.materialId,
          materialName: i.materialName,
          qty: Number(i.qty),
          unitPrice: Number(i.unitPrice),
          unitName: i.unitName,
          value: Number(i.value),
        })),
      };

      const res = await fetch(
        `http://localhost:5007/api/supplier-orders/update/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Failed to update order");

      alert("Order updated successfully!");
      navigate("/dashboard?tab=SORegister");
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Update failed!");
    }
  };

  if (loading) return <p>Loading...</p>;

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
      <h2 className="text-xl font-semibold mb-4">Update Supplier Order</h2>

      {/* Card 1 - Order Details */}
      <Card className="bg-gray-800 mb-6">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>SO No</Label>
            <TextInput name="SONo" value={formData.SONo} readOnly />
          </div>
          <div>
            <Label>Supplier</Label>
            <TextInput value={formData.supplierId} readOnly />
          </div>
          <div>
            <Label>Payment Type</Label>
            <Select
              value={formData.paymentType}
              onChange={(e) =>
                setFormData((p) => ({ ...p, paymentType: e.target.value }))
              }
            >
              <option value="">Select</option>
              <option value="cash">Cash</option>
              <option value="cheque">Cheque</option>
              <option value="card">Card</option>
            </Select>
          </div>
          <div>
            <Label>Delivery Date</Label>
            <TextInput
              type="date"
              value={formData.deliveryDate}
              onChange={(e) =>
                setFormData((p) => ({ ...p, deliveryDate: e.target.value }))
              }
            />
          </div>
          <div className="col-span-3">
            <Label>Remarks</Label>
            <Textarea
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
            <Label>Material</Label>
            <Select
              value={materialForm.materialId}
              onChange={(e) => handleMaterialSelect(e.target.value)}
            >
              <option value="">Select Material</option>
              {materials.map((m) => (
                <option key={m.materialId} value={String(m.materialId)}>
                  {m.materialId} - {m.materialName}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Qty</Label>
            <TextInput
              type="number"
              value={materialForm.qty}
              onChange={(e) =>
                setMaterialForm((prev) => ({ ...prev, qty: e.target.value }))
              }
            />
          </div>
          <div>
            <Label>Unit Price</Label>
            <TextInput readOnly value={materialForm.unitPrice} />
          </div>
          <div>
            <Label>Unit Name</Label>
            <TextInput readOnly value={materialForm.unitName} />
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
                  <th>Material ID</th>
                  <th>Material Name</th>
                  <th>Qty</th>
                  <th>Unit Price</th>
                  <th>Unit Name</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {selectedItems.map((i, idx) => (
                  <tr key={idx} className="bg-gray-600">
                    <td>{i.materialId}</td>
                    <td>{i.materialName}</td>
                    <td>{i.qty}</td>
                    <td>{(i.unitPrice ?? 0).toFixed(2)}</td>
                    <td>{i.unitName}</td>
                    <td>{(i.value ?? 0).toFixed(2)}</td>
                    <td>
                      {" "}
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
                <tr className="bg-gray-700 font-semibold ">
                  <td colSpan="5" className="text-right px-4 py-2">
                    Grand Total
                  </td>
                  <td>{grandTotal.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </Card>

      {/* Buttons */}
      <div className="flex gap-4 mt-6">
        <Button color="green" onClick={handleUpdate}>
          Update Order
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
}
