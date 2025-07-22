import React, { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableHeadCell,
  TableBody,
  TableRow,
  TableCell,
} from "flowbite-react";
import { useNavigate } from "react-router-dom";

const CustomerOrderApproval = () => {
  const [coList, setCoList] = useState([]);
  const navigate = useNavigate();

  // Fetch only approved customer orders
  const fetchApprovedOrders = async () => {
    try {
      const res = await fetch(
        "http://localhost:5004/api/Customer-Order/co-list"
      );
      const data = await res.json();
      const approvedOrders = (data.customerOrders || []).filter(
        (order) => order.items[0]?.status === "approved"
      );
      setCoList(approvedOrders);
    } catch (err) {
      console.error("Error fetching approved orders:", err.message);
    }
  };

  useEffect(() => {
    fetchApprovedOrders();
  }, []);

  return (
    <div className="bg-[#172e75] text-white min-h-screen w-full p-6 rounded overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Approved Customer Orders</h2>
        <button
          onClick={() => navigate("/dashboard?tab=PendingCO")}
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
                <TableHeadCell>CO NO</TableHeadCell>
                <TableHeadCell>Customer Name</TableHeadCell>
                <TableHeadCell>Status</TableHeadCell>
                <TableHeadCell>Date</TableHeadCell>
                <TableHeadCell>Order Value</TableHeadCell>
                <TableHeadCell>Payment Method</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody className="divide-y">
              {coList.map((order, orderIndex) => (
                <TableRow key={orderIndex}>
                  <TableCell>{order.coNo}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{order.items[0]?.status || "pending"}</TableCell>
                  <TableCell>{order.orderDate?.slice(0, 10)}</TableCell>
                  <TableCell>{order.orderTotalValue}</TableCell>
                  <TableCell>{order.paymentStatus}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default CustomerOrderApproval;
