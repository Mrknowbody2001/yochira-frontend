import React, { useEffect, useState } from "react";
import { Button, Label, TextInput, Textarea, Alert } from "flowbite-react";

const baseUrl2 = import.meta.env.VITE_API_BASE_URL_2;

const CustomerForm = ({ onCancel, onSuccess }) => {
  const [formData, setFormData] = useState({
    customerId: "",
    name: "",
    email: "",
    primaryContactNo: "",
    nic: "",
    address: "",
    province: "",
    district: "",
    nominatedPerson: "",
    nominatedPersonNo: "",
    bank: "",
    bankBranch: "",
    bankAccNo: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto-fill customerId
  useEffect(() => {
    const fetchPreviewCustomerId = async () => {
      try {
        const res = await fetch(
          `http://localhost:5003/api/customer/getPreviewCustomerId`
        );
        const data = await res.json();
        if (!res.ok)
          throw new Error(data.message || "Failed to get preview ID");
        setFormData((prev) => ({ ...prev, customerId: data.previewId }));
      } catch (err) {
        console.error("Preview ID Error:", err.message);
      }
    };
    fetchPreviewCustomerId();
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
      const res = await fetch(`http://localhost:5003/api/customer/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      onSuccess();
      onCancel();
    } catch (err) {
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
      <h3 className="text-xl font-semibold text-gray-300">Add New Customer</h3>

      <div className=" flex flex-row gap-4 ">
        <div className="w-[20%] ">
          <Label htmlFor="customerId">Customer ID</Label>
          <TextInput
            id="customerId"
            name="customerId"
            readOnly
            value={formData.customerId}
          />
        </div>
        <div className="w-[40%]">
          <Label htmlFor="name">Name</Label>
          <TextInput
            id="name"
            name="name"
            required
            onChange={handleChange}
            value={formData.name}
          />
        </div>
        <div className="w-[40%]">
          <Label htmlFor="email">Email</Label>
          <TextInput
            id="email"
            name="email"
            type="email"
            onChange={handleChange}
            value={formData.email}
          />
        </div>
      </div>
      <div className=" flex  flex-row gap-4  ">
        <div className="w-[50%]">
          <Label htmlFor="primaryContactNo">Primary Contact No</Label>
          <TextInput
            id="primaryContactNo"
            name="primaryContactNo"
            required
            onChange={handleChange}
            value={formData.primaryContactNo}
          />
        </div>
        <div className="w-[50%]">
          <Label htmlFor="nic">NIC</Label>
          <TextInput
            id="nic"
            name="nic"
            required
            onChange={handleChange}
            value={formData.nic}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          name="address"
          required
          onChange={handleChange}
          value={formData.address}
          rows={2}
        />
      </div>
      <div className="flex flex-row gap-4">
        <div className="w-[50%]">
          <Label htmlFor="province">Province</Label>
          <TextInput
            id="province"
            name="province"
            required
            onChange={handleChange}
            value={formData.province}
          />
        </div>
        <div className="w-[50%]">
          <Label htmlFor="district">District</Label>
          <TextInput
            id="district"
            name="district"
            required
            onChange={handleChange}
            value={formData.district}
          />
        </div>
      </div>
      <div className="flex flex-row gap-4">
        <div className="w-[50%]">
          <Label htmlFor="nominatedPerson">Nominated Person</Label>
          <TextInput
            id="nominatedPerson"
            name="nominatedPerson"
            required
            onChange={handleChange}
            value={formData.nominatedPerson}
          />
        </div>
        <div className="w-[50%]">
          <Label htmlFor="nominatedPersonNo">Nominated Person No</Label>
          <TextInput
            id="nominatedPersonNo"
            name="nominatedPersonNo"
            required
            onChange={handleChange}
            value={formData.nominatedPersonNo}
          />
        </div>
      </div>
      <div className=" flex justify-between">
        <div className="w-[30%]">
          <Label htmlFor="bank">Bank</Label>
          <TextInput
            id="bank"
            name="bank"
            required
            onChange={handleChange}
            value={formData.bank}
          />
        </div>
        <div className="w-[30%]">
          <Label htmlFor="bankBranch">Bank Branch</Label>
          <TextInput
            id="bankBranch"
            name="bankBranch"
            required
            onChange={handleChange}
            value={formData.bankBranch}
          />
        </div>
        <div className="w-[30%]">
          <Label htmlFor="bankAccNo">Bank Account Number</Label>
          <TextInput
            id="bankAccNo"
            name="bankAccNo"
            required
            onChange={handleChange}
            value={formData.bankAccNo}
          />
        </div>
      </div>

      <div className="flex gap-4 mt-4">
        <Button
          type="submit"
          color="success"
          className="bg-green-600 hover:bg-green-700"
        >
          {loading ? "Saving..." : "Save"}
        </Button>
        <Button type="button" color="gray" onClick={onCancel}>
          Cancel
        </Button>
        {error && (
          <Alert color="red" className="text-sm">
            {error}
          </Alert>
        )}
      </div>
    </form>
  );
};

export default CustomerForm;
