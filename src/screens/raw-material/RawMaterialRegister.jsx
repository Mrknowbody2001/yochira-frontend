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

const RawMaterialRegister = () => {
  const [materialList, setMaterialList] = useState([]);
  const navigate = useNavigate();



  // Fetch raw materials from the backend
  const fetchMaterials = async () => {
    try {
      const res = await fetch("http://localhost:5006/api/raw-material/");
      const data = await res.json();
      setMaterialList(data.materials || []);
    } catch (err) {
      console.error("Error loading material list:", err.message);
    }
  };

  // Delete a material
  const handleDelete = async (id) => {
    console.log("Deleting by ID:", id);
    try {
      await fetch(`http://localhost:5006/api/raw-material/delete/${id}`, {
        method: "DELETE",
      });
      fetchMaterials();
    } catch (err) {
      console.error("Delete failed:", err.message);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  return (
    <div className="bg-[#172e75] text-white min-h-screen w-full p-6 rounded overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Raw Material List</h2>
        <button
          onClick={() => navigate("/dashboard?tab=RawMaterialForm")}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
        >
          NEW
        </button>
      </div>

      <div className="w-full overflow-auto bg-[#243b55] border border-2 rounded p-4">
        <div className="min-w-[1000px] max-h-[500px] overflow-auto">
          <Table striped>
            <TableHead>
              <TableRow>
                <TableHeadCell>Material ID</TableHeadCell>
                <TableHeadCell>Material Name</TableHeadCell>
                <TableHeadCell>Unit</TableHeadCell>
                <TableHeadCell>Unit Price</TableHeadCell>
                <TableHeadCell>Description</TableHeadCell>
                <TableHeadCell>Action</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody className="divide-y">
              {materialList.map((material, index) => (
                <TableRow key={index}>
                  <TableCell>{material.materialId}</TableCell>
                  <TableCell>{material.materialName}</TableCell>
                  <TableCell>{material.unit}</TableCell>
                  <TableCell>{material.defaultUnitPrice}</TableCell>
                  <TableCell>{material.description}</TableCell>
                  <TableCell>
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this material?"
                          )
                        ) {
                          handleDelete(material._id);
                        }
                      }}
                      className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
                    >
                      Delete
                    </button>
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

export default RawMaterialRegister;
