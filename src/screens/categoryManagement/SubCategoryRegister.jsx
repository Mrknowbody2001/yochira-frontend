import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import SubCategoryForm from "./SubCategoryForm";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const SubCategoryRegister = () => {
  const [showForm, setShowForm] = useState(false);
  const [subCategoryList, setSubCategoryList] = useState([]);

  const fetchSubCategories = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/subcategory/get-all-sub`);
      const data = await res.json();
      setSubCategoryList(data.subCategories);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  useEffect(() => {
    fetchSubCategories();
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this subcategory?")) {
      try {
        const res = await fetch(`${baseUrl}/api/subcategory/delete-sub/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete");
        setSubCategoryList((prev) => prev.filter((item) => item._id !== id));
      } catch (err) {
        console.error("Delete error:", err.message);
      }
    }
  };

  return (
    <div className="bg-[#172e75] text-white min-h-screen w-full p-6 rounded overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Subcategory List</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
          >
            NEW
          </button>
        )}
      </div>

      {showForm ? (
        <SubCategoryForm
          onCancel={() => setShowForm(false)}
          onSuccess={fetchSubCategories}
        />
      ) : (
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto bg-[#243b55] border border-2 rounded p-4">
          <Table striped>
            <TableHead>
              <TableRow>
                <TableHeadCell>Subcategory ID</TableHeadCell>
                <TableHeadCell>Name</TableHeadCell>
                <TableHeadCell>Parent Category</TableHeadCell>
                <TableHeadCell>Action</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody className="divide-y">
              {subCategoryList.map((subcategory, index) => (
                <TableRow key={index}>
                  <TableCell className="text-white">
                    {subcategory.subCategoryId}
                  </TableCell>
                  <TableCell className="text-white">
                    {subcategory.name}
                  </TableCell>
                  <TableCell className="text-white">
                    {subcategory.categoryName || "N/A"}
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleDelete(subcategory._id)}
                      className="bg-red-700 hover:bg-red-800 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default SubCategoryRegister;
