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
import SearchBar from "../../components/SearchBar";
import { searchCustomerOrders } from "../../utils/searchCustomerOrder";

const PendingCO = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const navigate = useNavigate();
  const [searchCode, setSearchCode] = useState("");
  const [searchName, setSearchName] = useState("");

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

  const handleSearch = async () => {
    const data = await searchCustomerOrders({
      code: searchCode,
      name: searchName,
    });
    setCoList(data.customerOrders || []);
  };

  return (
    <div className="bg-[#172e75] text-white min-h-screen w-full p-6 rounded overflow-auto">
      <h2 className="text-xl font-semibold mb-4">Pending Customer Orders</h2>
      <div className="flex gap-2 mb-4">
        <SearchBar
          value={searchCode}
          onChange={setSearchCode}
          placeholder="Search CO No"
        />
        <SearchBar
          value={searchName}
          onChange={setSearchName}
          placeholder="Search Customer"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Search
        </button>
        <button
          onClick={() => {
            setSearchCode("");
            setSearchName("");
            fetchCON(); // reload all
          }}
          className="bg-gray-500 hover:bg-gray-600 px-3 py-1  rounded  text-white"
        >
          Reset
        </button>
      </div>
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
