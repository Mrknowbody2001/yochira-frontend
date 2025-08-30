import {
  Table,
  TableBody,
  TableHead,
  TableHeadCell,
  TableRow,
  TableCell,
} from "flowbite-react";
import React, { useEffect, useState } from "react";

const QCFailList = () => {
  const [failList, setFailList] = useState([]);

  const fetchQCFailList = async () => {
    try {
      const res = await fetch("http://localhost:5010/api/qc/fail/all");
      const data = await res.json();
      setFailList(data || []);
    } catch (err) {
      console.error("Error fetching QC Fail list:", err.message);
    }
  };

  useEffect(() => {
    fetchQCFailList();
  }, []);

  return (
    <div className="bg-[#172e75] text-white min-h-screen w-full p-6 rounded overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">QC Fail Register</h2>
      </div>

      <div className="w-full overflow-auto bg-[#243b55] border border-2 rounded p-4">
        <h3 className="text-lg font-semibold mb-2">QC Fail List</h3>
        <div className="min-w-[1300px] max-h-[500px] overflow-auto">
          <Table striped>
            <TableHead>
              <TableRow>
                <TableHeadCell>QC Fail No</TableHeadCell>
                <TableHeadCell>PSN No</TableHeadCell>
                <TableHeadCell>CO No</TableHeadCell>
                <TableHeadCell>Product ID</TableHeadCell>
                <TableHeadCell>Product Name</TableHeadCell>
                <TableHeadCell>Qty</TableHeadCell>
                <TableHeadCell>Unit Price</TableHeadCell>
                <TableHeadCell>Total Value</TableHeadCell>
                <TableHeadCell>Date</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody className="divide-y">
              {failList.length > 0 ? (
                failList.map((item, index) => (
                  <TableRow key={item._id || index}>
                    <TableCell>
                      {item.qcFailNo || `FAIL-${index + 1}`}
                    </TableCell>
                    <TableCell>{item.psnNo}</TableCell>
                    <TableCell>{item.coNo}</TableCell>
                    <TableCell>{item.productId}</TableCell>
                    <TableCell>{item.productName}</TableCell>
                    <TableCell>{item.qty}</TableCell>
                    <TableCell>{item.unitPrice.toFixed(2)}</TableCell>
                    <TableCell>{item.totalValue.toFixed(2)}</TableCell>
                    <TableCell>
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString()
                        : ""}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="9" className="text-center py-4">
                    No QC Fail records found.
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

export default QCFailList;
