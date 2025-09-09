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

const FinishedPSN = () => {
  const [psnList, setPsnList] = useState([]);
  const navigate = useNavigate();

  // Fetch all finished PSNs
  const fetchPSNs = async () => {
    try {
      const res = await fetch("http://localhost:5009/api/psn/finished/all");
      const data = await res.json();
      setPsnList(data || []);
      console.log("Fetched PSNs:", data);
    } catch (err) {
      console.error("Error fetching PSNs:", err.message);
    }
  };

  useEffect(() => {
    fetchPSNs();
  }, []);

  return (
    <div className="bg-[#172e75] text-white min-h-screen w-full p-6 rounded overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">PSN Register</h2>
        <button
          onClick={() => navigate("/dashboard?tab=StartedPSN")}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
        >
          NEW PSN
        </button>
      </div>

      <div className="w-full overflow-auto bg-[#243b55] border border-2 rounded p-4 overflow-x-auto">
        <div className="min-w-[1000px] max-h-[500px] overflow-y-auto">
          <Table striped>
            <TableHead>
              <TableRow>
                <TableHeadCell>PSN No</TableHeadCell>
                <TableHeadCell>CO No</TableHeadCell>
                <TableHeadCell>Customer</TableHeadCell>
                <TableHeadCell>Order Date</TableHeadCell>
                <TableHeadCell>Final Cost</TableHeadCell>
                <TableHeadCell>Remark</TableHeadCell>
                <TableHeadCell>Status</TableHeadCell>
                <TableHeadCell>PSN Date</TableHeadCell>
                <TableHeadCell>PSN Finished Date</TableHeadCell>
                <TableHeadCell>Action</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody className="divide-y">
              {psnList.length > 0 ? (
                psnList.map((psn, index) => (
                  <TableRow key={psn._id || index}>
                    <TableCell>{psn.PSNNo}</TableCell>
                    <TableCell>{psn.CONo}</TableCell>
                    <TableCell>
                      {psn.customerId} - {psn.customerName}
                    </TableCell>
                    <TableCell>
                      {psn.orderDate
                        ? new Date(psn.orderDate).toLocaleDateString()
                        : ""}
                    </TableCell>
                    <TableCell>{psn.finalValue?.toFixed(2)}</TableCell>
                    <TableCell>{psn.remark}</TableCell>
                    <TableCell>{psn.status}</TableCell>
                    <TableCell>
                      {" "}
                      {psn.createdAt
                        ? new Date(psn.createdAt).toLocaleDateString()
                        : ""}
                    </TableCell>
                    <TableCell>
                      {" "}
                      {psn.finishedPSNDate
                        ? new Date(psn.finishedPSNDate).toLocaleDateString()
                        : ""}
                    </TableCell>
                    <TableCell>
                      <Link
                        to={`/dashboard?tab=GetOneFinishedPSN&id=${psn._id}`}
                        className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1 rounded"
                      >
                        View
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="10" className="text-center py-4">
                    No PSNs found.
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

export default FinishedPSN;
