import { Card, Label, TextInput, Button } from "flowbite-react";
import React, { useCallback, useEffect, useState } from "react";
import debounce from "lodash.debounce";

const StockIn = () => {
  const [formData, setFormData] = React.useState({
    material: "",
    uom: "",
    qty: "",
  });

  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  //fetch material from backend
  const fetchMaterials = async (query) => {
    if (!query) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5008/api/rawMaterial/search?query=${query}`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Error fetching materials:", error);
    } finally {
      setLoading(false);
    }
  };

  //debounce search function
  const debouncedFetch = useCallback(debounce(fetchMaterials, 300), []);

  const handleMaterialChange = (e) => {
    const value = e.target.value;
    setIsSearching(true);
    setFormData((prev) => ({
      ...prev,
      material: value,
    }));
    debouncedFetch(value);
  };

  const handleSelectMaterial = (material) => {
    setFormData((prev) => ({
      ...prev,
      material: `${material.materialId} - ${material.materialName}`,
      uom: material.unit,
      unitPrice: material.defaultUnitPrice,
    }));
    setSearchResults([]); //hide search results after selection
    setIsSearching(false);
  };

  useEffect(() => {
    return () => debouncedFetch.cancel();
  }, [debouncedFetch]);

  const handleAddMaterial = async () => {
    if (!formData.material || !formData.qty || !formData.unitPrice) {
      return alert("Please select material and enter quantity & unit price");
    }

    const [materialId, ...rest] = formData.material.split(" - ");
    const materialName = rest.join(" - ");

    const payload = {
      referenceNo: `REF-${Date.now()}`,
      items: [
        {
          materialId: materialId.trim(),
          materialName: materialName.trim(),
          receiveQty: Number(formData.qty),
          uom: formData.uom,
          unitPrice: Number(formData.unitPrice),
        },
      ],
    };

    try {
      const response = await fetch(
        "http://localhost:5008/api/rawMaterial/update-store",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setFormData({ material: "", uom: "", qty: "", unitPrice: "" });
      } else {
        alert(data.message || "Failed to update material store");
      }
    } catch (error) {
      console.error("Error updating material store:", error);
      alert("Error updating material store");
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg">
      <div className="test-xl font-semibold mb-4">Stock In</div>
      {/* card for stock in  */}
      <Card className="bg-gray-800 mb-6 relative">
        <div className="flex gap-2">
          {/* Material Field with Dropdown */}
          <div className="w-1/4 relative">
            <Label htmlFor="material">Material</Label>
            <TextInput
              id="material"
              name="material"
              value={formData.material}
              onChange={handleMaterialChange}
              placeholder="Type material ID or name..."
            />

            {/* Dropdown */}
            {formData.material && searchResults.length > 0 && (
              <ul className="absolute w-full bg-white text-black border max-h-40 overflow-y-auto rounded mt-1 z-10 shadow">
                {loading && (
                  <li className="px-2 py-1 text-gray-500">Loading...</li>
                )}
                {searchResults.map((m) => (
                  <li
                    key={m._id}
                    className="px-2 py-1 hover:bg-gray-200 cursor-pointer"
                    onClick={() => handleSelectMaterial(m)}
                  >
                    {m.materialId} - {m.materialName}
                  </li>
                ))}
              </ul>
            )}

            {/* No results */}
            {formData.material &&
              isSearching &&
              !loading &&
              searchResults.length === 0 && (
                <ul className="absolute w-full bg-white text-black border rounded mt-1 z-10 shadow">
                  <li className="px-2 py-1 text-gray-500">No results found</li>
                </ul>
              )}
          </div>
          {/* UOM */}
          <div className="w-1/3">
            <Label htmlFor="uom">UOM</Label>
            <TextInput
              id="uom"
              name="uom"
              type="text"
              value={formData.uom}
              readOnly={true}
            />
          </div>

          {/* QTY */}
          <div className="w-1/3">
            <Label htmlFor="qty">QTY</Label>
            <TextInput
              id="qty"
              name="qty"
              type="number"
              value={formData.qty}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, qty: e.target.value }))
              }
            />
          </div>
          {/* Unit Price */}
          <div className="w-1/4">
            <Label htmlFor="unitPrice">Unit Price</Label>
            <TextInput
              id="unitPrice"
              name="unitPrice"
              type="number"
              value={formData.unitPrice}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, unitPrice: e.target.value }))
              }
            />
          </div>
        </div>

        <Button color="blue" onClick={handleAddMaterial} className="mb-4 mt-4">
          Add Material
        </Button>
      </Card>
    </div>
  );
};

export default StockIn;
