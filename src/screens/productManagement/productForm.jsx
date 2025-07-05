// src/screens/ProductForm.jsx
import React, { useEffect } from "react";
const baseUrl = import.meta.env.VITE_API_BASE_URL;
import {
  Button,
  Label,
  TextInput,
  Textarea,
  FileInput,
  Select,
  Alert,
} from "flowbite-react";

const ProductForm = ({ onCancel }) => {
  const [formData, setFormData] = React.useState({
    productId: "",
    productName: "",
    category: "",
    subCategory: "",
    unit: "",
    sellingPrice: "",
    description: "",

    productStatus: "pending",
  });
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  //!
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };
  console.log(formData);
  //!
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(false);

      const res = await fetch(`${baseUrl}/api/product/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }

      console.log("Product Created:", data);
      setLoading(false);
    } catch (error) {
      setError(error.message || "Unknown error occurred");
      console.error("Error:", error);
      setLoading(false);
    }
  };
  //fetch product id
  useEffect(() => {
    const fetchPreviewProductId = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/product/preview-id`, {
          method: "GET",
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(
            errorData.message || "Failed to get preview product ID"
          );
        }

        const data = await res.json();

        if (!data.previewId) {
          throw new Error("previewId not found in response");
        }

        setFormData((prev) => ({
          ...prev,
          productId: data.previewId,
        }));
        console.log("Preview Product ID:", data.previewId); // Optional
      } catch (err) {
        console.error("Failed to fetch preview product ID:", err.message);
      }
    };

    fetchPreviewProductId();
  }, []);
  return (
    <form
      onSubmit={handleSubmit}
      className="flex max-w-full w-auto flex-col gap-4 bg-[#1f2937] rounded shadow text-black p-5"
    >
      <h3 className="text-xl font-semibold text-gray-400">Add New Product</h3>

      {/* Product ID */}
      <div className=" flex flex-row gap-4">
        <div className="w-[10%] ">
          <Label htmlFor="productId" className="mb-1 block ">
            Product ID
          </Label>
          <TextInput
            id="productId"
            type="text"
            name="productId"
            placeholder="Enter Product ID"
            className="border-gray-300"
            readOnly
            required
            onChange={handleChange}
            value={formData.productId}
          />
        </div>

        {/* Product Name */}
        <div className="w-full">
          <Label htmlFor="productName" className="mb-1 block">
            Product Name
          </Label>
          <TextInput
            id="productName"
            type="text"
            name="productName"
            placeholder="Enter Product Name"
            required
            onChange={handleChange}
            value={formData.productName}
          />
        </div>
      </div>

      {/* Category */}
      <div className="flex flex-row   gap-4 ">
        <div className="w-[40%]">
          <Label htmlFor="category" className="mb-1 block">
            Category
          </Label>
          <TextInput
            id="category"
            type="text"
            name="category"
            placeholder="Enter Category"
            required
            onChange={handleChange}
            value={formData.category}
          />
        </div>

        {/* Subcategory */}
        <div className="w-[40%]">
          <Label htmlFor="subCategory" className="mb-1 block">
            Subcategory
          </Label>
          <TextInput
            id="subCategory"
            type="text"
            name="subCategory"
            placeholder="Enter Subcategory"
            required
            onChange={handleChange}
            value={formData.subcategory}
          />
        </div>
      </div>

      {/* Unit (Dropdown) */}
      <div className=" flex flex-row gap-4">
        <div className="w-[40%]">
          <Label htmlFor="unit" className="mb-1 block">
            Unit
          </Label>
          <Select
            id="unit"
            name="unit"
            required
            onChange={handleChange}
            value={formData.unit}
          >
            <option value="">Select Unit</option>
            <option value="each">Each</option>
            <option value="Kg">Set</option>
            <option value="Meter">Meter</option>
          </Select>
        </div>

        {/* Selling Price */}
        <div className="w-[40%]">
          <Label htmlFor="sellingPrice" className="mb-1 block">
            Selling Price
          </Label>
          <TextInput
            id="sellingPrice"
            type="number"
            name="sellingPrice"
            min="0"
            placeholder="Enter Selling Price"
            required
            onChange={handleChange}
            value={formData.sellingPrice}
          />
        </div>
      </div>
      {/* Description */}
      <div>
        <Label htmlFor="description" className="mb-1 block">
          Product Description
        </Label>
        <Textarea
          id="description"
          rows={3}
          name="description"
          placeholder="Enter Product Description"
          required
          onChange={handleChange}
          value={formData.description}
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-4">
        <Button
          type="submit"
          color="success"
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
        >
          {loading ? "Loading..." : "save"}
        </Button>
        <Button type="button" color="gray" onClick={onCancel}>
          Cancel
        </Button>
        {error && (
          <Alert className="text-sm" color="red">
            {error}
          </Alert>
        )}
      </div>
    </form>
  );
};

export default ProductForm;
