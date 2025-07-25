import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import CategoryForm from "./CategoryForm"; //
const baseUrl = import.meta.env.VITE_API_BASE_URL;

const CategoryRegister = () => {
  const [showForm, setShowForm] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCategoryList = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/category/get-all-main`);
      const data = await res.json();
      setCategoryList(data.categories); // ✅ match your backend key
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryList();
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        const res = await fetch(`${baseUrl}/api/category/delete-main/${id}`, {
          method: "DELETE",
        });

        if (!res.ok) throw new Error("Failed to delete");

        // Update the list by filtering out the deleted item
        setCategoryList((prev) => prev.filter((item) => item._id !== id));
      } catch (err) {
        console.error("Delete error:", err.message);
      }
    }
  };

  return (
    <div className="bg-[#172e75] text-white min-h-screen w-full p-6 rounded overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Category List</h2>
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
        <CategoryForm
          onCancel={() => setShowForm(false)}
          onSuccess={fetchCategoryList}
        />
      ) : (
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto bg-[#243b55] border border-2 rounded p-4">
          <Table striped>
            <TableHead>
              <TableRow>
                <TableHeadCell>Category ID</TableHeadCell>
                <TableHeadCell>Category Name</TableHeadCell>
                <TableHeadCell>Description</TableHeadCell>
                <TableHeadCell>Action</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody className="divide-y">
              {categoryList.map((category, index) => (
                <TableRow key={index}>
                  <TableCell className="text-white">
                    {category.categoryId}
                  </TableCell>
                  <TableCell className="text-white">{category.name}</TableCell>
                  <TableCell className="text-white">
                    {category.description}
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleDelete(category._id)}
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

export default CategoryRegister;
