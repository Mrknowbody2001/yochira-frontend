import React, { useEffect, useState } from "react";
import { Button, Label, TextInput, Select, Alert } from "flowbite-react";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const SubCategoryForm = ({ onCancel, onSuccess }) => {
const [formData, setFormData] = useState({ name: "", categoryId: "" });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/category/get-all-main`);
      const data = await res.json();
      setCategories(data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/subcategory/create-sub`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log("Subcategory Created:", data);
      if (!res.ok) throw new Error(data.message || "Failed to create");

      setSuccess(true);
      onSuccess();
      onCancel();
    } catch (err) {
      console.error("Error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex max-w-full w-auto flex-col gap-4 bg-[#1f2937] rounded shadow text-white p-5"
    >
      <h3 className="text-xl font-semibold text-gray-300">
        Add New Subcategory
      </h3>

      <div>
        <Label htmlFor="name" className="mb-1 block">
          Subcategory Name
        </Label>
        <TextInput
          id="name"
          type="text"
          name="name"
          placeholder="Enter Subcategory Name"
          required
          onChange={handleChange}
          value={formData.name}
        />
      </div>

      <div>
        <Label htmlFor="parentCategory" className="mb-1 block">
          Select Parent Category
        </Label>
        <Select
          id="categoryId"
          name="categoryId"
          required
          onChange={handleChange}
          value={formData.parentCategory}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex gap-4 mt-4">
        <Button
          type="submit"
          color="success"
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
        >
          {loading ? "Saving..." : "Save"}
        </Button>
        <Button type="button" color="gray" onClick={onCancel}>
          Cancel
        </Button>
        {error && (
          <Alert className="text-sm mt-2" color="red">
            {error}
          </Alert>
        )}
        {success && (
          <Alert className="text-sm mt-2" color="green">
            Subcategory Created Successfully
          </Alert>
        )}
      </div>
    </form>
  );
};

export default SubCategoryForm;
