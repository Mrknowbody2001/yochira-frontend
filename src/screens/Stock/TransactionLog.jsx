import React, { useEffect, useState } from "react";
import { Card } from "flowbite-react";

export default function MaterialStoreTable() {
  const [storeItems, setStoreItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const res = await fetch(
          "http://localhost:5008/api/materialStore/transactions"
        );
        const data = await res.json();
        setStoreItems(data);
        console.log("Material Store:", data);
      } catch (err) {
        console.error("Failed to fetch material store:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStore();
  }, []);

  if (loading) return <p className="text-white">Loading...</p>;
  if (!storeItems.length) return <p className="text-white">No stock found.</p>;

  return (
    <Card className="bg-gray-800 mb-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        Material Store Transaction Log
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-white border border-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-2 py-1">Material ID</th>
              <th className="px-2 py-1">Material Name</th>
              <th className="px-2 py-1">qty</th>
              <th className="px-2 py-1">Unit Price</th>
              <th className="px-2 py-1">SORN No</th>
              <th className="px-2 py-1">UOM</th>
              <th className="px-2 py-1">Date</th>
              <th className="px-2 py-1">user</th>
            </tr>
          </thead>
          <tbody>
            {storeItems.map((item, idx) => (
              <tr key={idx} className="bg-gray-600 border-b border-gray-700">
                <td className="px-2 py-1 text-center">{item.materialId}</td>
                <td className="px-2 py-1 text-center">{item.materialName}</td>
                <td className="px-2 py-1 text-center">{item.qty}</td>
                <td className="px-2 py-1 text-center">
                  {item.unitPrice?.toFixed(2)}
                </td>
                <td className="px-2 py-1 text-center">{item.referenceNo}</td>
                <td className="px-2 py-1 text-center">{item.uom}</td>
                <td className="px-2 py-1 text-center">
                  {new Date(item.date).toLocaleString()}
                </td>
                <td className="px-2 py-1 text-center">Chamith sandeepa</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
