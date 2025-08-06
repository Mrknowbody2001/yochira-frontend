import React, { useEffect, useState, useRef } from "react";
import { Label, TextInput, Button, Textarea } from "flowbite-react";
import { useNavigate, useSearchParams } from "react-router-dom";

const ApproveSupplier = () => {
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
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const printRef = useRef();

  // Fetch supplier by ID
  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:5007/api/supplier/getOneSupplier/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setFormData(data.supplier);
      })
      .catch((err) => {
        console.error("Failed to load supplier:", err);
      });
  }, [id]);

  const handleApprove = async () => {
    try {
      const res = await fetch(
        `http://localhost:5007/api/supplier/approved/${id}`,
        {
          method: "PUT",
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      alert("Supplier approved successfully");
      navigate("/dashboard?tab=SupplierRegister");
    } catch (err) {
      alert("Approval failed: " + err.message);
    }
  };

  return (
    <form
      ref={printRef}
      className="flex max-w-full w-auto flex-col gap-4 bg-gray-900 text-white p-6 rounded-lg shadow"
    >
      <h2 className="text-xl font-bold text-gray-300 mb-2">Approve Supplier</h2>

      {/* -- You can keep all fields but make them readOnly -- */}
      <div className="flex flex-row gap-4">
        <div className="w-[25%]">
          <Label htmlFor="supplierId">Supplier ID</Label>
          <TextInput
            id="supplierId"
            name="supplierId"
            value={formData.supplierId}
            readOnly
          />
        </div>
        <div className="w-[40%]">
          <Label htmlFor="name">Name</Label>
          <TextInput id="name" name="name" value={formData.name} readOnly />
        </div>
        <div className="w-[35%]">
          <Label htmlFor="email">Email</Label>
          <TextInput id="email" name="email" value={formData.email} readOnly />
        </div>
      </div>

      <div className="flex flex-row gap-4">
        <div className="w-1/2">
          <Label htmlFor="primaryContactNo">Primary Contact No</Label>
          <TextInput
            id="primaryContactNo"
            name="primaryContactNo"
            value={formData.primaryContactNo}
            readOnly
          />
        </div>
        <div className="w-1/2">
          <Label htmlFor="nic">NIC</Label>
          <TextInput id="nic" name="nic" value={formData.nic} readOnly />
        </div>
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          name="address"
          value={formData.address}
          rows={2}
          readOnly
        />
      </div>

      <div className="flex flex-row gap-4">
        <div className="w-1/2">
          <Label htmlFor="province">Province</Label>
          <TextInput
            id="province"
            name="province"
            value={formData.province}
            readOnly
          />
        </div>
        <div className="w-1/2">
          <Label htmlFor="district">District</Label>
          <TextInput
            id="district"
            name="district"
            value={formData.district}
            readOnly
          />
        </div>
      </div>

      <div className="flex flex-row gap-4">
        <div className="w-1/2">
          <Label htmlFor="nominatedPerson">Nominated Person</Label>
          <TextInput
            id="nominatedPerson"
            name="nominatedPerson"
            value={formData.nominatedPerson}
            readOnly
          />
        </div>
        <div className="w-1/2">
          <Label htmlFor="nominatedPersonNo">Nominated Person No</Label>
          <TextInput
            id="nominatedPersonNo"
            name="nominatedPersonNo"
            value={formData.nominatedPersonNo}
            readOnly
          />
        </div>
      </div>

      <div className="flex flex-row gap-4">
        <div className="w-1/3">
          <Label htmlFor="bank">Bank</Label>
          <TextInput id="bank" name="bank" value={formData.bank} readOnly />
        </div>
        <div className="w-1/3">
          <Label htmlFor="bankBranch">Bank Branch</Label>
          <TextInput
            id="bankBranch"
            name="bankBranch"
            value={formData.bankBranch}
            readOnly
          />
        </div>
        <div className="w-1/3">
          <Label htmlFor="bankAccNo">Bank Account Number</Label>
          <TextInput
            id="bankAccNo"
            name="bankAccNo"
            value={formData.bankAccNo}
            readOnly
          />
        </div>
      </div>

      {/* Approve button only */}
      <div className="flex gap-4 mt-4">
        <Button
          type="button"
          color="success"
          className="bg-green-600 hover:bg-green-700"
          onClick={handleApprove}
        >
          Approve
        </Button>
        <Button type="button" color="gray" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>
    </form>
  );
};

export default ApproveSupplier;
