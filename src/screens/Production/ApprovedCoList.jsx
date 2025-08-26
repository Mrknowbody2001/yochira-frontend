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

const ApprovedCoList = () => {
  const [orderList, setOrderList] = useState([]);
  const navigate = useNavigate();
  // Fetch approved customer orders
  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:5009/api/co/approved-all");
      const data = await res.json();
      setOrderList(data || []);
      console.log("Fetched Approved Customer Orders:", data);
    } catch (err) {
      console.error("Error loading approved orders:", err.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="bg-[#172e75] text-white min-h-screen w-full p-6 rounded overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Approved Customer Orders</h2>
        <button
          onClick={() => navigate("/dashboard?tab=ProductionStartNote")}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
        >
          NEW
        </button>
      </div>

      <div className="w-full bg-[#243b55] border border-2 rounded p-4 overflow-x-auto">
        <div className="inline-block min-w-[800px] max-h-[400px] overflow-y-auto">
          <Table striped>
            <TableHead>
              <TableRow>
                <TableHeadCell>CO No</TableHeadCell>
                <TableHeadCell>Customer</TableHeadCell>
                <TableHeadCell>Total Value</TableHeadCell>
                <TableHeadCell>Payment Status</TableHeadCell>
                <TableHeadCell>Order Date</TableHeadCell>
                <TableHeadCell>Status</TableHeadCell>
                <TableHeadCell>Remark</TableHeadCell>
                <TableHeadCell>Action</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody className="divide-y">
              {orderList.length > 0 ? (
                orderList.map((order, index) => (
                  <TableRow key={order._id || index}>
                    <TableCell>{order.coNo}</TableCell>
                    <TableCell>
                      {order.customerId} - {order.customerName}
                    </TableCell>
                    <TableCell>{order.orderTotalValue?.toFixed(2)}</TableCell>
                    <TableCell>{order.paymentStatus}</TableCell>
                    <TableCell>
                      {order.orderDate
                        ? new Date(order.orderDate).toLocaleDateString()
                        : ""}
                    </TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>{order.remark}</TableCell>
                    <TableCell>
                      <Link
                        to={`/dashboard?tab=ProductionStartNote&id=${order._id}`}
                        className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1 rounded"
                      >
                        View
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="8" className="text-center py-4">
                    No approved orders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ApprovedCoList;
