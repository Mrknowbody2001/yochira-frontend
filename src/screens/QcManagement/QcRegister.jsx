import {
  Table,
  TableBody,
  TableHead,
  TableHeadCell,
  TableRow,
  TableCell,
} from "flowbite-react";

import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

const QcRegister = () => {
  const [psnList, setPsnList] = useState([]);
  const navigate = useNavigate();

  // Fetch all PSNs
  const fetchFinishedPSNs = async () => {
    try {
      const res = await fetch("http://localhost:5010/api/psn/finished");
      const data = await res.json();
      setPsnList(data || []);
      console.log("Fetched PSNs:", data);
    } catch (err) {
      console.error("Error fetching PSNs:", err.message);
    }
  };

  useEffect(() => {
    fetchFinishedPSNs();
  }, []);

  return (
    <div className="bg-[#172e75] text-white min-h-screen w-full p-6 rounded overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">QC Register</h2>
      </div>

      <div className="w-full overflow-auto bg-[#243b55] border border-2 rounded p-4">
        <h3 className="text-lg font-semibold mb-2">Finished PSN List</h3>
        <div className="min-w-[1200px] max-h-[500px] overflow-auto">
          <Table striped>
            <TableHead>
              <TableRow>
                <TableHeadCell>PSN No</TableHeadCell>
                <TableHeadCell>CO No</TableHeadCell>
                <TableHeadCell>Customer</TableHeadCell>
                <TableHeadCell>Order Date</TableHeadCell>
                <TableHeadCell>Final Value</TableHeadCell>
                <TableHeadCell>Remark</TableHeadCell>
                <TableHeadCell>Finished Date</TableHeadCell>
                <TableHeadCell>Status</TableHeadCell>
                <TableHeadCell>Action</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody className="divide-y">
              {psnList.length > 0 ? (
                psnList.map((psn, index) => (
                  <TableRow key={psn._id || index}>
                    <TableCell>{psn.PSNNo}</TableCell>
                    <TableCell>{psn.coNo}</TableCell>
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
                    <TableCell>
                      {psn.finishedDate
                        ? new Date(psn.finishedDate).toLocaleDateString()
                        : ""}
                    </TableCell>
                    <TableCell>{psn.status}</TableCell>
                    <TableCell>
                      <Link
                        to={`/dashboard?tab=GetOneQCN&id=${psn._id}`}
                        className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1 rounded"
                      >
                        View
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="9" className="text-center py-4">
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

export default QcRegister;
