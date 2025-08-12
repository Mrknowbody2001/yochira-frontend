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

const PendingSO = () => {
  const [orderList, setOrderList] = useState([]);
  const navigate = useNavigate();

  // Fetch supplier orders from the backend
  const fetchOrders = async () => {
    try {
      const res = await fetch(
        "http://localhost:5007/api/supplier-orders/pending-orders"
      );
      const data = await res.json();
      
      setOrderList(data || []);
       console.log("Fetched orders:", data);
    } catch (err) {
      console.error("Error loading order list:", err.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="bg-[#172e75] text-white min-h-screen w-full p-6 rounded overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Supplier Pending Order List</h2>
        
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
                <TableHeadCell>Total Value</TableHeadCell>
                <TableHeadCell>Order Status</TableHeadCell>
                <TableHeadCell>Action</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody className="divide-y">
              {orderList.map((order, index) => (
                <TableRow key={order._id || index}>
                  <TableCell>{order.SONo}</TableCell>
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
                  <TableCell>{order.orderTotalValue}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>
                    <Link
                      to={`/dashboard?tab=GetOnePendingSo&id=${order._id}`}
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

export default PendingSO;
