import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import CustomerForm from "./CustomerForm"; // You'll create this separately

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const CustomerRegister = () => {
  const [showForm, setShowForm] = useState(false);
  const [customerList, setCustomerList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCustomers = async () => {
    try {
      const res = await fetch(`http://localhost:5003/api/customer/getAllCustomers`);
      const data = await res.json();
      setCustomerList(data.customers);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this customer?")) {
      try {
        const res = await fetch(`${baseUrl}/api/customer/delete/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete");
        setCustomerList((prev) => prev.filter((item) => item._id !== id));
      } catch (err) {
        console.error("Delete error:", err.message);
      }
    }
  };

  return (
    <div className="bg-[#172e75] text-white min-h-screen w-full p-6 rounded overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Customer List</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
          >
            NEW
          </button>
        )}
      </div>

      {showForm ? (
        <CustomerForm
          onCancel={() => setShowForm(false)}
          onSuccess={fetchCustomers}
        />
      ) : (
        <div className="w-full overflow-auto bg-[#243b55] border border-2 rounded p-4">
          <div className="min-w-[1200px] max-h-[500px] overflow-x-auto overflow-y-auto">
            <Table striped>
              <TableHead>
                <TableRow>
                  <TableHeadCell>Customer ID</TableHeadCell>
                  <TableHeadCell>Name</TableHeadCell>
                  <TableHeadCell>Email</TableHeadCell>
                  <TableHeadCell>Contact</TableHeadCell>
                  <TableHeadCell>NIC</TableHeadCell>
                  <TableHeadCell>Address</TableHeadCell>
                  <TableHeadCell>District</TableHeadCell>
                  <TableHeadCell>Province</TableHeadCell>
                  <TableHeadCell>Nominated Person</TableHeadCell>
                  <TableHeadCell>Bank</TableHeadCell>
                  <TableHeadCell>Bank Account</TableHeadCell>
                  <TableHeadCell>Action</TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody className="divide-y">
                {customerList.map((customer, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-white">
                      {customer.customerId}
                    </TableCell>
                    <TableCell className="text-white">
                      {customer.name}
                    </TableCell>
                    <TableCell className="text-white">
                      {customer.email}
                    </TableCell>
                    <TableCell className="text-white">
                      {customer.primaryContactNo}
                    </TableCell>
                    <TableCell className="text-white">{customer.nic}</TableCell>
                    <TableCell className="text-white">
                      {customer.address}
                    </TableCell>
                    <TableCell className="text-white">
                      {customer.district}
                    </TableCell>
                    <TableCell className="text-white">
                      {customer.province}
                    </TableCell>
                    <TableCell className="text-white">
                      {customer.nominatedPerson} ({customer.nominatedPersonNo})
                    </TableCell>
                    <TableCell className="text-white">
                      {customer.bank} / {customer.bankBranch}
                    </TableCell>
                    <TableCell className="text-white">
                      {customer.bankAccNo}
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleDelete(customer._id)}
                        className="bg-red-700 hover:bg-red-800 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerRegister;
