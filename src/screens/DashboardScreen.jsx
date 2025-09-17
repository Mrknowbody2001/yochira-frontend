import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  TableHead,
  TableHeadCell,
  TableBody,
  TableRow,
  TableCell,
} from "flowbite-react";
import { Link } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DashboardPage = () => {
  const [summary, setSummary] = useState({
    customers: 0,
    suppliers: 0,
    customerOrders: 0,
    supplierOrders: 0,
    deliveredOrders: 0,
  });

  const [finishedGoods, setFinishedGoods] = useState([]);
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    // Fetch counts from backend
    const fetchSummary = async () => {
      try {
        const res = await fetch("http://localhost:5012/api/dashboard/summary");
        const data = await res.json();

        // Map backend response to expected state structure
        setSummary({
          customers: data.CustomerCount || 0,
          suppliers: data.SupplerCount || 0,
          customerOrders: data.CustomerOrderCount || 0,
          supplierOrders: data.SORNCount || 0,
          deliveryNotes: data.DeliveryNoteCount || 0, // or handle delivered orders if added later
        });
      } catch (err) {
        console.error("Failed to load summary:", err);
      }
    };

    // Fetch tables data
    const fetchTables = async () => {
      try {
        const fgRes = await fetch("http://localhost:5007/api/finishedgoods");
        const fgData = await fgRes.json();
        setFinishedGoods(fgData);

        const matRes = await fetch("http://localhost:5012/api/material/store");
        const matData = await matRes.json();
        console.log("Material Store Data:", matData);
        setMaterials(matData);
      } catch (err) {
        console.error("Failed to load tables:", err);
      }
    };

    fetchSummary();
    fetchTables();
  }, []);

  // Chart Data
  const chartData = {
    labels: ["Customer Orders", "Supplier Orders"],
    datasets: [
      {
        label: "This Month",
        data: [summary.customerOrders, summary.supplierOrders],
        backgroundColor: ["#3b82f6", "#38bdf8"], // Blue & Light Blue
      },
    ],
  };

  return (
    <div className="bg-[#1d2a5b] text-white min-h-screen w-full p-6 overflow-auto">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {[
          { title: "Customers", value: summary.customers },
          { title: "Suppliers", value: summary.suppliers },
          { title: "Customer Orders", value: summary.customerOrders },
          { title: "Supplier Orders", value: summary.supplierOrders },
          { title: "Delivery Notes", value: summary.deliveryNotes },
        ].map((item, i) => (
          <Card
            key={i}
            className="bg-[#243b70] w-30 h-20 text-center  shadow-lg hover:bg-[#2d4a88] transition"
          >
            <h3 className="text-sm font-semibold  ">{item.title}</h3>
            <p className="text-sm text  font-bold">{item.value}</p>
          </Card>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-[#243b70] p-4 rounded-lg mb-6 shadow hover:bg-[#2d4a88] transition">
        <h3 className="text-md font-semibold mb-2">Orders Overview</h3>
        <Bar data={chartData} />
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {["CS Pass List", "Rework List", "Fail List"].map((title, index) => (
          <Card
            key={index}
            className="bg-[#2a407a] text-center shadow-md hover:bg-[#355190] transition"
          >
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <Link
              to={`/dashboard/${title.toLowerCase().replace(/\s/g, "-")}`}
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white"
            >
              View
            </Link>
          </Card>
        ))}
      </div>

      {/* Two Tables */}
      <div className="grid grid-cols-2 gap-3">
        {/* Finished Goods Table */}
        <div className="bg-[#243b70] p-4 rounded-lg overflow-auto shadow hover:bg-[#2d4a88] transition">
          <h3 className="text-md font-semibold mb-4">Finished Goods</h3>
          <Table striped>
            <TableHead>
              <TableRow>
                <TableHeadCell>Item</TableHeadCell>
                <TableHeadCell>Qty</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {finishedGoods.map((fg, i) => (
                <TableRow key={i}>
                  <TableCell>{fg.itemName}</TableCell>
                  <TableCell>{fg.qty}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Material Table */}
        <div className="bg-[#243b70] p-4 rounded-lg overflow-auto shadow hover:bg-[#2d4a88] transition">
          <h3 className="text-md font-semibold mb-4">Materials</h3>
          <Table striped>
            <TableHead>
              <TableRow>
                <TableHeadCell>Material</TableHeadCell>
                <TableHeadCell>Stock</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {materials.map((mat, i) => (
                <TableRow key={i}>
                  <TableCell>{mat.materialName}</TableCell>
                  <TableCell>{mat.stock}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
