import React, { useEffect, useState, useRef } from "react";
import { Label, TextInput, Button, Textarea } from "flowbite-react";
import {  useNavigate, useSearchParams } from "react-router-dom";

const GetOneSupplier = () => {
  const [formData, setFormData] = useState({
    supplierId: "",
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

 const navigate = useNavigate();
const [searchParams] = useSearchParams();  // <-- read query params
const id = searchParams.get("id");         // <-- get the value of ?id=
const printRef = useRef();

  // Fetch the supplier by ID
  useEffect(() => {
     if (!id) return; // safety check
    fetch(`http://localhost:5007/api/supplier/getOneSupplier/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setFormData(data.supplier);
      })
      .catch((err) => {
        console.error("Failed to load supplier:", err);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(
        `http://localhost:5007/api/supplier/update/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      alert("Supplier updated successfully");
      navigate("/dashboard?tab=SupplierRegister");
    } catch (err) {
      alert("Failed to update supplier: " + err.message);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <form
      ref={printRef}
      className="flex max-w-full w-auto flex-col gap-4 bg-gray-900 text-white p-6 rounded-lg shadow"
    >
      <h2 className="text-xl font-bold text-gray-300 mb-2">Supplier Details</h2>

      <div className="flex flex-row gap-4">
        <div className="w-[25%]">
          <Label htmlFor="supplierId">Supplier ID</Label>
          <TextInput
            id="supplierId"
            readOnly
            name="supplierId"
            value={formData.supplierId}
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
        <div className="w-[35%]">
          <Label htmlFor="email">Email (optional)</Label>
          <TextInput
            id="email"
            name="email"
            onChange={handleChange}
            value={formData.email}
          />
        </div>
      </div>

      <div className="flex flex-row gap-4">
        <div className="w-1/2">
          <Label htmlFor="primaryContactNo">Primary Contact No</Label>
          <TextInput
            id="primaryContactNo"
            name="primaryContactNo"
            required
            onChange={handleChange}
            value={formData.primaryContactNo}
          />
        </div>
        <div className="w-1/2">
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
          onChange={handleChange}
          value={formData.address}
          rows={2}
          required
        />
      </div>

      <div className="flex flex-row gap-4">
        <div className="w-1/2">
          <Label htmlFor="province">Province</Label>
          <TextInput
            id="province"
            name="province"
            onChange={handleChange}
            value={formData.province}
            required
          />
        </div>
        <div className="w-1/2">
          <Label htmlFor="district">District</Label>
          <TextInput
            id="district"
            name="district"
            onChange={handleChange}
            value={formData.district}
            required
          />
        </div>
      </div>

      <div className="flex flex-row gap-4">
        <div className="w-1/2">
          <Label htmlFor="nominatedPerson">Nominated Person</Label>
          <TextInput
            id="nominatedPerson"
            name="nominatedPerson"
            onChange={handleChange}
            value={formData.nominatedPerson}
            required
          />
        </div>
        <div className="w-1/2">
          <Label htmlFor="nominatedPersonNo">Nominated Person No</Label>
          <TextInput
            id="nominatedPersonNo"
            name="nominatedPersonNo"
            onChange={handleChange}
            value={formData.nominatedPersonNo}
            required
          />
        </div>
      </div>

      <div className="flex flex-row gap-4">
        <div className="w-1/3">
          <Label htmlFor="bank">Bank</Label>
          <TextInput
            id="bank"
            name="bank"
            onChange={handleChange}
            value={formData.bank}
            required
          />
        </div>
        <div className="w-1/3">
          <Label htmlFor="bankBranch">Bank Branch</Label>
          <TextInput
            id="bankBranch"
            name="bankBranch"
            onChange={handleChange}
            value={formData.bankBranch}
            required
          />
        </div>
        <div className="w-1/3">
          <Label htmlFor="bankAccNo">Bank Account Number</Label>
          <TextInput
            id="bankAccNo"
            name="bankAccNo"
            onChange={handleChange}
            value={formData.bankAccNo}
            required
          />
        </div>
      </div>

      <div className="flex gap-4 mt-4">
        <Button
          type="button"
          color="success"
          className="bg-green-600 hover:bg-green-700"
          onClick={handleUpdate}
        >
          Update
        </Button>
        <Button type="button" color="purple" onClick={handlePrint}>
          Print
        </Button>
        <Button type="button" color="gray" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>
    </form>
  );
};

export default GetOneSupplier;
