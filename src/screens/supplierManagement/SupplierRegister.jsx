import {
  Table,
  TableBody,
  TableHead,
  TableHeadCell,
  TableRow,
  TableCell,
} from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SupplierRegister = () => {
  const [supplierList, setSupplierList] = useState([]);
  const navigate = useNavigate();

  const fetchSuppliers = async () => {
    try {
      const res = await fetch(
        "http://localhost:5007/api/supplier/getAllSuppliers"
      );
      const data = await res.json();
      setSupplierList(data.suppliers || []);
    } catch (err) {
      console.error("Error loading supplier list:", err.message);
    }
  };

  const handleView = (id) => {
    navigate(`/dashboard/viewSupplier/${id}`);
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  return (
    <div className="bg-[#172e75] text-white min-h-screen w-full p-6 rounded overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Supplier List</h2>
        <button
          onClick={() => navigate("/dashboard?tab=SupplierForm")}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
        >
          NEW
        </button>
      </div>

      <div className="w-full overflow-auto bg-[#243b55] border border-2 rounded p-4">
        <div className="min-w-[1000px] max-h-[500px] overflow-auto">
          <Table striped>
            <TableHead>
              <TableRow>
                <TableHeadCell>Supplier ID</TableHeadCell>
                <TableHeadCell>Name</TableHeadCell>
                <TableHeadCell>Email</TableHeadCell>
                <TableHeadCell>Phone No</TableHeadCell>
                <TableHeadCell>Address</TableHeadCell>
                <TableHeadCell>Status</TableHeadCell>
                <TableHeadCell>Action</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody className="divide-y">
              {supplierList.map((supplier, index) => (
                <TableRow key={index}>
                  <TableCell>{supplier.supplierId}</TableCell>
                  <TableCell>{supplier.name}</TableCell>
                  <TableCell>{supplier.email}</TableCell>
                  <TableCell>{supplier.primaryContactNo}</TableCell>
                  <TableCell>{supplier.address}</TableCell>
                  <TableCell>{supplier.status}</TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleView(supplier._id)}
                      className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
                    >
                      View
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default SupplierRegister;
