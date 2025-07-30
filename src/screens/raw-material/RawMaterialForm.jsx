import React, { useEffect, useState } from "react";
import { Label, TextInput, Textarea, Button, Select } from "flowbite-react";
import { useNavigate } from "react-router-dom";

const RawMaterialForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    materialId: "",
    materialName: "",
    unit: "",
    defaultUnitPrice: "",
    description: "",
  });

  // Fetch material ID when component mounts
  useEffect(() => {
    const fetchMaterialId = async () => {
      try {
        const res = await fetch(
          "http://localhost:5006/api/raw-material/materialId"
        );
        const data = await res.json();
        setFormData((prev) => ({
          ...prev,
          materialId: data.materialId || "ERROR",
        }));
      } catch (err) {
        console.error("Failed to fetch material ID", err);
      }
    };

    fetchMaterialId();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { materialId, materialName, unit, defaultUnitPrice, description } =
      formData;
    if (
      !materialId ||
      !materialName ||
      !unit ||
      !defaultUnitPrice ||
      !description
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:5006/api/raw-material/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert("Raw material created successfully");
      navigate("/dashboard?tab=RawMaterialRegister");
    } catch (err) {
      console.error("Material creation failed:", err.message);
      alert("Failed to create raw material");
    }
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg w-full  mx-auto">
      <h2 className="text-xl font-semibold mb-4">Register Raw Material</h2>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="materialId">Material ID</Label>
          <TextInput
            id="materialId"
            name="materialId"
            value={formData.materialId}
            readOnly
          />
        </div>
        <div>
          <Label htmlFor="materialName">Material Name</Label>
          <TextInput
            id="materialName"
            name="materialName"
            value={formData.materialName}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="unit">Unit</Label>
          <Select
            id="unit"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
          >
            <option value="">-- Select Unit --</option>
            <option value="each">Each</option>
            <option value="set">Set</option>
            <option value="Bulk">Bulk </option>
          </Select>
        </div>
        <div>
          <Label htmlFor="defaultUnitPrice">Default Unit Price</Label>
          <TextInput
            type="number"
            id="defaultUnitPrice"
            name="defaultUnitPrice"
            value={formData.defaultUnitPrice}
            onChange={handleChange}
          />
        </div>
        <div className="col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <Button color="green" onClick={handleSubmit}>
          Save Material
        </Button>
        <Button
          color="gray"
          onClick={() => navigate("/dashboard?tab=RawMaterialRegister")}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default RawMaterialForm;
