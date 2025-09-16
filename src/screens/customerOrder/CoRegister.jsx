import {
  Table,
  TableBody,
  TableHead,
  TableHeadCell,
  TableRow,
  TableCell,
} from "flowbite-react";
import React, { useState, useEffect } from "react";
import SearchBar from "../../components/SearchBar"; // search bar component
import COForm from "./COForm";
import GetOneCO from "./getOneCO";
import { Link, Navigate, useNavigate } from "react-router-dom";

const CoRegister = () => {
  const [showForm, setShowForm] = useState(false);
  const [coList, setCoList] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [searchCode, setSearchCode] = useState("");
  const [searchName, setSearchName] = useState("");

  const Navigate = useNavigate();
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

  //! search con
  const searchCON = async () => {
    if (!searchCode.trim() && !searchName.trim()) {
      console.log("No search criteria provided, skipping search.");
      return; // stop search if nothing is typed
    }

    try {
      const query = new URLSearchParams({
        code: searchCode.trim(),
        name: searchName.trim(),
      });
      const res = await fetch(
        `http://localhost:5004/api/Customer-Order/search-co-list?${query.toString()}`
      );
      const data = await res.json();
      setCoList(data.customerOrders || []);
      console.log("Search results:", data);
    } catch (err) {
      console.error("Search failed:", err.message);
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
    <div className="bg-[#172e75] text-white min-h-screen w-full p-4   rounded overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Customer Order List</h2>
        <button
          onClick={() => Navigate("/dashboard?tab=CoForm")}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
        >
          NEW
        </button>
      </div>

      {/*  Search Bar Section */}
      <div className="flex gap-3 mb-4">
        <SearchBar
          value={searchCode}
          onChange={setSearchCode}
          placeholder="Search by CO No..."
        />
        <SearchBar
          value={searchName}
          onChange={setSearchName}
          placeholder="Search by Customer Name..."
        />
        <button
          onClick={searchCON}
          className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-full text-white"
        >
          Search
        </button>
        <button
          onClick={() => {
            setSearchCode("");
            setSearchName("");
            fetchCON(); // reload all
          }}
          className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded-full text-white"
        >
          Reset
        </button>
      </div>

      <div className="w-full overflow-auto bg-[#243b55]  border-2 rounded p-4">
        <div className="min-w-[1200px] max-h-[500px] overflow-auto">
          <Table striped>
            <TableHead>
              <TableRow>
                <TableHeadCell className="w-3.5">CO NO</TableHeadCell>
                <TableHeadCell className="w-2">Customer Name</TableHeadCell>
                <TableHeadCell className="w-2">Status</TableHeadCell>
                <TableHeadCell className="w-2">Date</TableHeadCell>
                <TableHeadCell className="w-2">Order Value</TableHeadCell>
                <TableHeadCell className="w-2">Payment Method</TableHeadCell>
                <TableHeadCell className="w-2">Action</TableHeadCell>
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
                  <TableCell>{order.status}</TableCell>
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
    </div>
  );
};

export default CoRegister;
