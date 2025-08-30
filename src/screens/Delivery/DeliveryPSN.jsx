import {
  Table,
  TableBody,
  TableHead,
  TableHeadCell,
  TableRow,
  TableCell,
} from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const DeliveryPSN = () => {
  const [deliveryList, setDeliveryList] = useState([]);

  // Fetch PSNs ready for delivery
  const fetchDeliveryPSNs = async () => {
    try {
      const res = await fetch("http://localhost:5011/api/delivery/ready-for-delivery");
      const data = await res.json();
      if (data && data.data) {
        setDeliveryList(data.data);
      } else {
        setDeliveryList([]);
      }
      console.log("Fetched Delivery PSNs:", data);
    } catch (err) {
      console.error("Error fetching Delivery PSNs:", err.message);
    }
  };

  useEffect(() => {
    fetchDeliveryPSNs();
  }, []);

  return (
    <div className="bg-[#172e75] text-white min-h-screen w-full p-6 rounded overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Delivery PSN List</h2>
      </div>

      <div className="w-full overflow-auto bg-[#243b55] border border-2 rounded p-4">
        <div className="min-w-[1200px] max-h-[500px] overflow-auto">
          <Table striped>
            <TableHead>
              <TableRow>
                <TableHeadCell>PSN No</TableHeadCell>
                <TableHeadCell>CO No</TableHeadCell>
                <TableHeadCell>Customer</TableHeadCell>
                <TableHeadCell>Order Date</TableHeadCell>
                <TableHeadCell>Final Value</TableHeadCell>
                <TableHeadCell>Status</TableHeadCell>
                <TableHeadCell>Action</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody className="divide-y">
              {deliveryList.length > 0 ? (
                deliveryList.map((psn, index) => (
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
                    <TableCell>{psn.status}</TableCell>
                    <TableCell>
                      <Link
                        to={`/dashboard?tab=CreateDN&id=${psn._id}`}
                        className="bg-green-700 hover:bg-green-800 text-white px-3 py-1 rounded"
                      >
                        Deliver
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="7" className="text-center py-4">
                    No PSNs ready for delivery.
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

export default DeliveryPSN;
