import {
  Table,
  TableBody,
  TableHead,
  TableHeadCell,
  TableRow,
  TableCell,
} from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SupplierApproval = () => {
  const [supplierList, setSupplierList] = useState([]);
  const navigate = useNavigate();

  // Fetch suppliers
  const fetchSuppliers = async () => {
    try {
      const res = await fetch(
        "http://localhost:5007/api/supplier/getAllSuppliers"
      );
      const data = await res.json();

      // Only suppliers with status = pending
      const pendingSuppliers = (data.suppliers || []).filter(
        (s) => s.status === "pending"
      );
      setSupplierList(pendingSuppliers);
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
      <h2 className="text-xl font-semibold mb-4">Supplier Approval List</h2>
      <div className="w-full overflow-auto bg-[#243b55] border rounded p-4">
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
                    <Link
                      to={`/dashboard?tab=OneSupplierApproval&id=${supplier._id}`}
                      className="bg-green-700 hover:bg-green-800 text-white px-3 py-1 rounded"
                    >
                      View
                    </Link>
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

export default SupplierApproval;
