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

const QcNList = () => {
  const [qcList, setQcList] = useState([]);
  const navigate = useNavigate();

  const fetchAllQCNotes = async () => {
    try {
      const res = await fetch("http://localhost:5010/api/qc/all");
      const data = await res.json();
      setQcList(data || []);
    } catch (err) {
      console.error("Error fetching QC Notes:", err.message);
    }
  };

  useEffect(() => {
    fetchAllQCNotes();
  }, []);

  return (
    <div className="bg-[#172e75] text-white min-h-screen w-full p-6 rounded overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">QC Note Register</h2>
      </div>

      <div className="w-full overflow-auto bg-[#243b55] border border-2 rounded p-4">
        <h3 className="text-lg font-semibold mb-2">QC Notes List</h3>
        <div className="min-w-[1200px] max-h-[500px] overflow-auto">
          <Table striped>
            <TableHead>
              <TableRow>
                <TableHeadCell>QC No</TableHeadCell>
                <TableHeadCell>PSN No</TableHeadCell>
                <TableHeadCell>CO No</TableHeadCell>
                <TableHeadCell>Customer</TableHeadCell>
                <TableHeadCell>QC Date</TableHeadCell>
                <TableHeadCell>Total Pass</TableHeadCell>
                <TableHeadCell>Total Rework</TableHeadCell>
                <TableHeadCell>Total Fail</TableHeadCell>
                
              </TableRow>
            </TableHead>
            <TableBody className="divide-y">
              {qcList.length > 0 ? (
                qcList.map((qc, index) => {
                  const totalPass = qc.items.reduce(
                    (sum, i) => sum + i.passQty,
                    0
                  );
                  const totalRework = qc.items.reduce(
                    (sum, i) => sum + i.reworkQty,
                    0
                  );
                  const totalFail = qc.items.reduce(
                    (sum, i) => sum + i.failQty,
                    0
                  );

                  return (
                    <TableRow key={qc._id || index}>
                      <TableCell>{qc.qcNo}</TableCell>
                      <TableCell>{qc.psnNo}</TableCell>
                      <TableCell>{qc.coNo}</TableCell>
                      <TableCell>{qc.customerName}</TableCell>
                      <TableCell>
                        {qc.qcDate
                          ? new Date(qc.qcDate).toLocaleDateString()
                          : ""}
                      </TableCell>
                      <TableCell>{totalPass}</TableCell>
                      <TableCell>{totalRework}</TableCell>
                      <TableCell>{totalFail}</TableCell>
                      
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan="9" className="text-center py-4">
                    No QC Notes found.
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

export default QcNList;
