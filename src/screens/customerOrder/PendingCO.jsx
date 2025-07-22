// src/screens/customerOrder/PendingCO.jsx
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { useNavigate } from "react-router-dom";

const PendingCO = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5004/api/Customer-Order/co-list")
      .then((res) => res.json())
      .then((data) => {
        const filtered = (data.customerOrders || []).filter(
          (order) => order.status === "pending"
        );
        setPendingOrders(filtered);
      })
      .catch((err) => console.error("Error fetching orders:", err.message));
  }, []);

  return (
    <div className="bg-[#172e75] text-white min-h-screen w-full p-6 rounded overflow-auto">
      <h2 className="text-xl font-semibold mb-4">Pending Customer Orders</h2>
      <div className="overflow-auto bg-[#243b55] border rounded p-4">
        <Table striped>
          <TableHead>
            <TableRow>
              <TableHeadCell>CO No</TableHeadCell>
              <TableHeadCell>Customer</TableHeadCell>
              <TableHeadCell>Status</TableHeadCell>
              <TableHeadCell>Date</TableHeadCell>
              <TableHeadCell>Total</TableHeadCell>
              <TableHeadCell>Action</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingOrders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order.coNo}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{order.orderDate?.slice(0, 10)}</TableCell>
                <TableCell>{order.orderTotalValue}</TableCell>
                <TableCell>
                  <button
                    onClick={() =>
                      navigate(
                        `/dashboard?tab=ApproveCustomerOrder&id=${order._id}`
                      )
                    }
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                  >
                    View & Approve
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PendingCO;
