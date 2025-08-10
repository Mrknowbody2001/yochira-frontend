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

const SupplierOrderRegister = () => {
  const [orderList, setOrderList] = useState([]);
  const navigate = useNavigate();

  // Fetch supplier orders from the backend
  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:5006/api/supplier-orders/");
      const data = await res.json();
      setOrderList(data.orders || []);
    } catch (err) {
      console.error("Error loading order list:", err.message);
    }
  };

  // Delete an order
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5006/api/supplier-orders/delete/${id}`, {
        method: "DELETE",
      });
      fetchOrders();
    } catch (err) {
      console.error("Delete failed:", err.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="bg-[#172e75] text-white min-h-screen w-full p-6 rounded overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Supplier Order List</h2>
        <button
          onClick={() => navigate("/dashboard?tab=SupplierOrderForm")}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
        >
          NEW
        </button>
      </div>

      <div className="w-full overflow-auto bg-[#243b55] border border-2 rounded p-4">
        <div className="min-w-[1200px] max-h-[500px] overflow-auto">
          <Table striped>
            <TableHead>
              <TableRow>
                <TableHeadCell>SO No</TableHeadCell>
                <TableHeadCell>Supplier ID</TableHeadCell>
                <TableHeadCell>Supplier Name</TableHeadCell>
                <TableHeadCell>Date Created</TableHeadCell>
                <TableHeadCell>Payment Type</TableHeadCell>
                <TableHeadCell>Delivery Date</TableHeadCell>
                <TableHeadCell>Total Price</TableHeadCell>
                <TableHeadCell>Action</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody className="divide-y">
              {orderList.map((order, index) => (
                <TableRow key={index}>
                  <TableCell>{order.soNumber}</TableCell>
                  <TableCell>{order.supplierId}</TableCell>
                  <TableCell>{order.supplierName}</TableCell>
                  <TableCell>
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : ""}
                  </TableCell>
                  <TableCell>{order.paymentType}</TableCell>
                  <TableCell>
                    {order.deliveryDate
                      ? new Date(order.deliveryDate).toLocaleDateString()
                      : ""}
                  </TableCell>
                  <TableCell>{order.totalPrice}</TableCell>
                  <TableCell>
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this order?"
                          )
                        ) {
                          handleDelete(order._id);
                        }
                      }}
                      className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
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
    </div>
  );
};

export default SupplierOrderRegister;
