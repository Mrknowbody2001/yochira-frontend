import {
  Table,
  TableBody,
  TableHead,
  TableHeadCell,
  TableRow,
  TableCell,
} from "flowbite-react";
import React, { useState, useEffect } from "react";
import COForm from "./COForm";
import GetOneCO from "./getOneCO";
import { Link } from "react-router-dom";

const CoRegister = () => {
  const [showForm, setShowForm] = useState(false);
  const [coList, setCoList] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // Fetch CO data from backend
  const fetchCON = async () => {
    try {
      const res = await fetch(
        "http://localhost:5004/api/Customer-Order/co-list"
      );
      const data = await res.json();
      setCoList(data.customerOrders || []);
    } catch (err) {
      console.error("Error loading CO list:", err.message);
    }
  };

  // Delete a CO entry
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5004/api/Customer-Order/delete/${id}`, {
        method: "DELETE",
      });
      fetchCON();
    } catch (err) {
      console.error("Delete failed:", err.message);
    }
  };

  useEffect(() => {
    fetchCON();
  }, []);

  if (selectedOrderId) {
    return (
      <GetOneCO
        id={selectedOrderId}
        onBack={() => {
          setSelectedOrderId(null); // ← go back to list
          fetchCON();
        }}
      />
    );
  }

  return (
    <div className="bg-[#172e75] text-white min-h-screen w-full p-6 rounded overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Customer Order List</h2>
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
        <COForm onCancel={() => setShowForm(false)} onSuccess={fetchCON} />
      ) : (
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
                  <TableHeadCell>Action</TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody className="divide-y">
                {coList.map((order, orderIndex) => (
                  <TableRow key={orderIndex}>
                    <TableCell>{order.coNo}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    {/* <TableCell>
                      {order.items.reduce(
                        (sum, item) => sum + (item.itemTotalValue || 0),
                        0
                      )}
                    </TableCell> */}
                    <TableCell>{order.items[0]?.status || "pending"}</TableCell>
                    <TableCell>{order.orderDate?.slice(0, 10)}</TableCell>
                    <TableCell>{order.orderTotalValue}</TableCell>
                    <TableCell>{order.paymentStatus}</TableCell>
                    <TableCell>
                      <Link
                        to={`/dashboard?tab=GetOneCO&id=${order._id}`}
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
      )}
    </div>
  );
};

export default CoRegister;
