import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Table,
  TableHead,
  TableHeadCell,
  TableBody,
  TableRow,
  TableCell,
} from "flowbite-react";

const SOReceiveNoteList = () => {
  const navigate = useNavigate();
  const [sornList, setSornList] = useState([]);

  useEffect(() => {
    const fetchSorns = async () => {
      try {
        const res = await fetch("http://localhost:5007/api/sorn/all");
        const data = await res.json();
        setSornList(data);
        console.log("SORN List:", data);
      } catch (err) {
        console.error("Failed to fetch SORN list:", err);
      }
    };

    fetchSorns();
  }, []);

  return (
    <div className="bg-[#172e75] text-white min-h-screen w-full p-6 rounded overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">SORN List</h2>
        <button
          onClick={() => navigate("/dashboard?tab=ApprovedSOList")}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
        >
          NEW
        </button>
      </div>

      <div className="w-full overflow-auto bg-[#243b55] border border-2 rounded p-4">
        <div className="min-w-[1300px] max-h-[500px] overflow-auto">
          <Table striped>
            <TableHead>
              <TableRow>
                <TableHeadCell>SORN No</TableHeadCell>
                <TableHeadCell>SO No</TableHeadCell>
                <TableHeadCell>Supplier ID</TableHeadCell>
                <TableHeadCell>Supplier Name</TableHeadCell>
                <TableHeadCell>Date Created</TableHeadCell>
                <TableHeadCell>Payment Type</TableHeadCell>
                <TableHeadCell>Delivery Date</TableHeadCell>
                <TableHeadCell>Grand Total</TableHeadCell>
                <TableHeadCell>Qty Difference</TableHeadCell>
                <TableHeadCell>Total Price Diff.</TableHeadCell>
                <TableHeadCell>Action</TableHeadCell>
              </TableRow>
            </TableHead>

            <TableBody className="divide-y">
              {sornList.map((sorn, index) => (
                <TableRow key={index}>
                  <TableCell>{sorn.SORNNo}</TableCell>
                  <TableCell>{sorn.SONo}</TableCell>
                  <TableCell>{sorn.supplierId}</TableCell>
                  <TableCell>{sorn.supplierName}</TableCell>
                  <TableCell>
                    {sorn.sornCreatedDate
                      ? new Date(sorn.sornCreatedDate).toLocaleDateString()
                      : ""}
                  </TableCell>
                  <TableCell>{sorn.paymentType}</TableCell>
                  <TableCell>
                    {sorn.deliveryDate
                      ? new Date(sorn.deliveryDate).toLocaleDateString()
                      : ""}
                  </TableCell>
                  <TableCell>{sorn.grandTotal}</TableCell>
                  <TableCell>
                    {/* Calculate Qty Difference from items */}
                    {sorn.items
                      ? sorn.items.reduce(
                          (acc, item) =>
                            acc + ((item.receiveQty ?? 0) - (item.qty ?? 0)),
                          0
                        )
                      : 0}
                  </TableCell>
                  <TableCell>{sorn.totalPriceDifference}</TableCell>
                  <TableCell>
                    <Link
                      to={`/dashboard?tab=GetOneSORN&id=${sorn._id}`}
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

export default SOReceiveNoteList;
