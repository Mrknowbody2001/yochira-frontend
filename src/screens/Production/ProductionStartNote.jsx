import React, { useEffect, useState, useCallback } from "react";
import { Label, TextInput, Textarea, Button, Card } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";

const ProductionStartNote = () => {
  const [items, setItems] = useState([]); // CO items
  const [extraMaterials, setExtraMaterials] = useState([]); // Extra materials
  const [formData, setFormData] = useState({
    CONo: "",
    customerId: "",
    customerName: "",
    orderDate: "",
    remark: "",
    PSNNo: "",
    material: "",
    materialId: "",
    materialName: "",
    qty: "",
    unitPrice: "",
    otherCost: "",
  });
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const coId = new URLSearchParams(window.location.search).get("id");

  // Fetch CO details
  useEffect(() => {
    if (coId) {
      fetch(`http://localhost:5009/api/co/${coId}`)
        .then((res) => res.json())
        .then((data) => {
          setFormData((prev) => ({
            ...prev,
            CONo: data.coNo || "",
            customerId: data.customerId || "",
            customerName: data.customerName || "",
            orderDate: data.orderDate
              ? new Date(data.orderDate).toISOString().split("T")[0]
              : "",
            remark: data.remark || "",
            orderTotalValue: data.orderTotalValue || 0,
          }));
          setItems(data.items || []);
        })
        .catch((err) => console.error("Error fetching CO:", err));
    }
  }, [coId]);

  // Fetch PSN number
  useEffect(() => {
    fetch("http://localhost:5009/api/psn/psn-no")
      .then((res) => res.json())
      .then((data) =>
        setFormData((prev) => ({ ...prev, PSNNo: data.PSNNo || "" }))
      )
      .catch(() => {});
  }, []);

  // Fetch materials
  const fetchMaterials = async (query) => {
    if (!query) return setSearchResults([]);
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:5009/api/Material/search?query=${query}`
      );
      const data = await res.json();
      setSearchResults(data);
    } catch (err) {
      console.error("Error fetching materials:", err);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = useCallback(debounce(fetchMaterials, 300), []);
  useEffect(() => () => debouncedFetch.cancel(), [debouncedFetch]);

  // Extra material totals
  const extraMaterialTotal = extraMaterials.reduce(
    (sum, m) => sum + m.totalValue,
    0
  );
  const otherCost = Number(formData.otherCost) || 0;
  const finalValue = extraMaterialTotal + otherCost;

  // Add extra material
  const handleAddMaterial = () => {
    if (!formData.materialId || !formData.qty) return;
    const totalValue = Number(formData.qty) * Number(formData.unitPrice);
    const newMaterial = {
      materialId: formData.materialId,
      materialName: formData.materialName,
      qty: Number(formData.qty),
      unitPrice: Number(formData.unitPrice),
      totalValue,
    };
    setExtraMaterials((prev) => [...prev, newMaterial]);
    setFormData((prev) => ({
      ...prev,
      material: "",
      materialId: "",
      materialName: "",
      qty: "",
      unitPrice: "",
    }));
  };

  // Submit PSN
  const handleSubmit = async () => {
    if (!formData.customerId) {
      alert("Customer is required");
      return;
    }

    const formattedItems = items.map((i) => ({
      productId: i.productId || i.id,
      productName: i.productName || i.name,
      qty: Number(i.orderQty || i.qty || 0),
      unitPrice: Number(i.sellingPrice || 0),
      totalValue: Number(
        i.itemTotalValue || (i.qty || i.orderQty) * i.sellingPrice || 0
      ),
    }));

    const formattedExtraMaterials = extraMaterials.map((m) => ({
      materialId: m.materialId,
      materialName: m.materialName,
      qty: Number(m.qty || 0),
      unitPrice: Number(m.unitPrice || 0),
      totalValue: Number(m.value || m.qty * m.unitPrice || 0),
    }));

    const payload = {
      CONo: formData.CONo,
      customerId: formData.customerId,
      customerName: formData.customerName,
      orderDate: formData.orderDate,
      remark: formData.remark,
      PSNNo: formData.PSNNo,
      items: formattedItems,
      extraMaterials: formattedExtraMaterials,
      otherCost: Number(formData.otherCost || 0),
      extraMaterialTotal: formattedExtraMaterials.reduce(
        (sum, m) => sum + m.totalValue,
        0
      ),
      finalValue:
        formattedItems.reduce((sum, i) => sum + i.totalValue, 0) +
        formattedExtraMaterials.reduce((sum, m) => sum + m.totalValue, 0) +
        Number(formData.otherCost || 0),
    };

    try {
      const res = await fetch("http://localhost:5009/api/psn/create-psn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error creating PSN");
      alert("Production Start Note created successfully");
      navigate("/dashboard?tab=PSNRegister");
    } catch (err) {
      alert(`Failed to create PSN: ${err.message}`);
    }
  };

  //remove material form extra materials
  const handleRemoveMaterial = (index) => {
    setExtraMaterials((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Production Start Note</h2>

      {/* Customer & CO Details */}
      <Card className="bg-gray-800 mb-6">
        <div className="grid grid-cols-4 gap-3">
          <div>
            <Label>CO No</Label>
            <TextInput readOnly value={formData.CONo} />
          </div>
          <div>
            <Label>Customer</Label>
            <TextInput
              readOnly
              value={`${formData.customerId} - ${formData.customerName}`}
            />
          </div>
          <div>
            <Label>Order Date</Label>
            <TextInput readOnly type="date" value={formData.orderDate} />
          </div>
          <div>
            <Label>Order Total Value</Label>
            <TextInput readOnly value={formData.orderTotalValue} />
          </div>
          <div className="col-span-3">
            <Label>Remark</Label>
            <Textarea readOnly value={formData.remark} className="w-full" />
          </div>
        </div>
      </Card>

      {/* CO Items */}
      <Card className="bg-gray-800 mb-6">
        <h3 className="text-lg mb-2">Customer Order Items</h3>
        {items.length > 0 ? (
          <table className="w-full text-sm text-white border border-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-2">Product</th>
                <th className="px-4 py-2">Qty</th>
                <th className="px-4 py-2">Unit Price</th>
                <th className="px-4 py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((i, idx) => (
                <tr key={idx} className="bg-gray-600">
                  <td className="px-4 py-2">{i.productName}</td>
                  <td className="px-4 py-2 text-center">{i.orderQty}</td>
                  <td className="px-4 py-2 text-center">
                    {(i.sellingPrice || 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {(i.itemTotalValue || 0).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-700 font-semibold">
                <td colSpan="3" className="text-right px-4 py-2">
                  Items Total
                </td>
                <td className="px-4 py-2">
                  {(formData.orderTotalValue || 0).toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        ) : (
          <p>No items available</p>
        )}
      </Card>

      {/* Extra Materials */}
      <Card className="bg-gray-800 mb-6">
        <h3 className="text-lg mb-4">Production Details</h3>

        <div className="mb-4">
          <Label>PSN No</Label>
          <TextInput readOnly value={formData.PSNNo} />
        </div>

        <div className="grid grid-cols-5 gap-4 items-end mb-4">
          <div>
            <Label>Material</Label>
            <TextInput
              value={formData.material}
              onChange={(e) => {
                const value = e.target.value;
                setFormData((prev) => ({ ...prev, material: value }));
                setIsSearching(true);
                debouncedFetch(value);
              }}
              placeholder="Search material..."
            />
            {isSearching && searchResults.length > 0 && (
              <div className="bg-gray-700 text-white border border-gray-600 mt-1 max-h-40 overflow-auto">
                {searchResults.map((mat) => (
                  <div
                    key={mat.materialId}
                    className="px-2 py-1 hover:bg-gray-600 cursor-pointer"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        material: `${mat.materialId} - ${mat.materialName}`,
                        materialId: mat.materialId,
                        materialName: mat.materialName,
                        unitPrice: mat.defaultUnitPrice,
                      }));
                      setSearchResults([]);
                      setIsSearching(false);
                    }}
                  >
                    {mat.materialId} - {mat.materialName}
                  </div>
                ))}
              </div>
            )}
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
                  ? (
                      Number(formData.qty || 0) *
                      Number(formData.unitPrice || 0)
                    ).toFixed(2)
                  : "0.00"
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
                <th className="px-4 py-2">Action</th> {/* New column */}
              </tr>
            </thead>
            <tbody>
              {extraMaterials.map((m, idx) => (
                <tr key={idx} className="bg-gray-600">
                  <td className="px-4 py-2">{m.materialName}</td>
                  <td className="px-4 py-2 text-center">{m.qty}</td>
                  <td className="px-4 py-2 text-center">
                    {(Number(m.unitPrice) || 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {(Number(m.totalValue) || 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-white"
                      onClick={() => handleRemoveMaterial(idx)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-700 font-semibold">
                <td colSpan="4" className="text-right px-4 py-2">
                  Extra Materials Total
                </td>
                <td className="px-4 py-2">
                  {(Number(extraMaterialTotal) || 0).toFixed(2)}
                </td>
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
            <Label>Final Cost</Label>
            <TextInput readOnly value={finalValue.toFixed(2)} />
          </div>
        </div>
      </Card>

      <div className="flex gap-4">
        <Button color="green" onClick={handleSubmit}>
          Submit
        </Button>
        <Button
          color="gray"
          onClick={() => navigate("/dashboard?tab=ApprovedCoList")}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default ProductionStartNote;
