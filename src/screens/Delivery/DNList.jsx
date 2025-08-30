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

const DNList = () => {
  const [dnList, setDnList] = useState([]);
  const navigate = useNavigate();

  // Fetch all Delivery Notes
  const fetchDeliveryNotes = async () => {
    try {
      const res = await fetch("http://localhost:5011/api/delivery/all");
      const data = await res.json();
      setDnList(data.data || []);
      console.log("Fetched Delivery Notes:", data.data);
    } catch (err) {
      console.error("Error fetching Delivery Notes:", err.message);
    }
  };

  useEffect(() => {
    fetchDeliveryNotes();
  }, []);

  return (
    <div className="bg-[#172e75] text-white min-h-screen w-full p-6 rounded overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Delivery Note Register</h2>
        <button
          onClick={() => navigate("/dashboard?tab=DeliveryPSN")}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
        >
          NEW DELIVERY NOTE
        </button>
      </div>

      <div className="w-full overflow-auto bg-[#243b55] border border-2 rounded p-4">
        <div className="min-w-[1200px] max-h-[500px] overflow-auto">
          <Table striped>
            <TableHead>
              <TableRow>
                <TableHeadCell>DN No</TableHeadCell>
                <TableHeadCell>PSN No</TableHeadCell>
                <TableHeadCell>CO No</TableHeadCell>
                <TableHeadCell>Customer</TableHeadCell>
                <TableHeadCell>Delivery Date</TableHeadCell>
                <TableHeadCell>Status</TableHeadCell>
                <TableHeadCell>Action</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody className="divide-y">
              {dnList.length > 0 ? (
                dnList.map((dn, index) => (
                  <TableRow key={dn._id || index}>
                    <TableCell>{dn.dnNo || `DN-${index + 1}`}</TableCell>
                    <TableCell>{dn.psnNo}</TableCell>
                    <TableCell>{dn.coNo}</TableCell>
                    <TableCell>
                      {dn.customerId} - {dn.customerName}
                    </TableCell>
                    <TableCell>
                      {dn.deliveryDate
                        ? new Date(dn.deliveryDate).toLocaleDateString()
                        : ""}
                    </TableCell>
                    <TableCell>{dn.status || "Delivered"}</TableCell>
                    <TableCell>
                      <Link
                        to={`/dashboard?tab=ViewDN&id=${dn._id}`}
                        className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1 rounded"
                      >
                        View
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="7" className="text-center py-4">
                    No Delivery Notes found.
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

export default DNList;
