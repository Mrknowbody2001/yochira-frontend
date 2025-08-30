import {
  Table,
  TableBody,
  TableHead,
  TableHeadCell,
  TableRow,
  TableCell,
} from "flowbite-react";
import React, { useEffect, useState } from "react";

const FinishedGoodStockList = () => {
  const [stockList, setStockList] = useState([]);

  const fetchStockList = async () => {
    try {
      const res = await fetch("http://localhost:5010/api/finished-stock/all");
      const data = await res.json();
      setStockList(data || []);
    } catch (err) {
      console.error("Error fetching Finished Good Stock list:", err.message);
    }
  };

  useEffect(() => {
    fetchStockList();
  }, []);

  return (
    <div className="bg-[#172e75] text-white min-h-screen w-full p-6 rounded overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Finished Good Stock Register</h2>
      </div>

      <div className="w-full overflow-auto bg-[#243b55] border border-2 rounded p-4">
        <h3 className="text-lg font-semibold mb-2">Finished Good Stock List</h3>
        <div className="min-w-[1200px] max-h-[500px] overflow-auto">
          <Table striped>
            <TableHead>
              <TableRow>
                <TableHeadCell>Product ID</TableHeadCell>
                <TableHeadCell>Product Name</TableHeadCell>
                <TableHeadCell>Qty</TableHeadCell>
                <TableHeadCell>Unit Price</TableHeadCell>
                <TableHeadCell>Total Value</TableHeadCell>
                <TableHeadCell>Last Updated</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody className="divide-y">
              {stockList.length > 0 ? (
                stockList.map((item, index) => (
                  <TableRow key={item._id || index}>
                    <TableCell>{item.productId}</TableCell>
                    <TableCell>{item.productName}</TableCell>
                    <TableCell>{item.qty}</TableCell>
                    <TableCell>{item.unitPrice.toFixed(2)}</TableCell>
                    <TableCell>{item.totalValue.toFixed(2)}</TableCell>
                    <TableCell>
                      {item.updatedAt
                        ? new Date(item.updatedAt).toLocaleDateString()
                        : ""}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="6" className="text-center py-4">
                    No Finished Good Stock records found.
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

export default FinishedGoodStockList;
