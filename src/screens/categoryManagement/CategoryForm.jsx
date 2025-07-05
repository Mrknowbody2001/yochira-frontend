// src/screens/CategoryForm.jsx
import React, { useState } from "react";
import { Button, Label, TextInput, Textarea, Alert } from "flowbite-react";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const CategoryForm = ({ onCancel, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${baseUrl}/api/category/create-main`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create category");

      console.log("Main Category Created:", data);
      setSuccess(true);
      setLoading(false);
      if (onSuccess) onSuccess();
      onCancel(); // Close the form
    } catch (err) {
      console.error("Error:", err.message);
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex max-w-full w-auto flex-col gap-4 bg-[#1f2937] rounded shadow text-white p-5"
    >
      <h3 className="text-xl font-semibold text-gray-300">
        Add New Main Category
      </h3>

      {/* Category Name */}
      <div>
        <Label htmlFor="name" className="mb-1 block">
          Category Name
        </Label>
        <TextInput
          id="name"
          type="text"
          name="name"
          placeholder="Enter Category Name"
          required
          onChange={handleChange}
          value={formData.name}
        />
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description" className="mb-1 block">
          Description (optional)
        </Label>
        <Textarea
          id="description"
          rows={3}
          name="description"
          placeholder="Enter Description"
          onChange={handleChange}
          value={formData.description}
        />
      </div>

      {/* Buttons */}
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
            Category Created Successfully
          </Alert>
        )}
      </div>
    </form>
  );
};

export default CategoryForm;
