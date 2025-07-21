import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import ProductForm from "./productForm";
const baseUrl = import.meta.env.VITE_API_BASE_URL;
const ProductRegister = () => {
  const [showForm, setShowForm] = useState(false);
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(false);

  // const productList = [
  //   {
  //     barcode: "010100503433",
  //     name: "WOODEN BATIK DESIGN MAT",
  //     category: "Art & Crafts",
  //     material: "Wooden",
  //     price: 550,
  //   },
  //   {
  //     barcode: "050102010405",
  //     name: "WOODEN EDUCATIONAL PUZZLE",
  //     category: "Puzzles",

  //     material: "Wooden",
  //     price: 450,
  //   },
  // ];
  useEffect(() => {
    const fetchProductList = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/product`, {
          method: "GET",
        });
        const data = await res.json();
        setProductList(data.product);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductList();
  }, []);

  return (
    <div className="bg-[#172e75] text-white min-h-screen w-full p-6 rounded overflow-auto">
      {/* Top Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Product List</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
          >
            NEW
          </button>
        )}
      </div>

      {/* Conditional content */}
      {showForm ? (
        <ProductForm onCancel={() => setShowForm(false)} />
      ) : (
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto bg-[#243b55] border border-2 rounded p-4">
          <Table striped>
            <TableHead>
              <TableRow>
                <TableHeadCell>Barcode</TableHeadCell>
                <TableHeadCell>Product Name</TableHeadCell>
                <TableHeadCell>product ID</TableHeadCell>
                <TableHeadCell>Category</TableHeadCell>
                <TableHeadCell>Sub-category</TableHeadCell>
                <TableHeadCell>Unit</TableHeadCell>
                <TableHeadCell>Selling Price</TableHeadCell>
                <TableHeadCell>Product Status</TableHeadCell>
                <TableHeadCell>description</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody className="divide-y">
              {productList.map((product, index) => (
                <TableRow
                  key={index}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <TableCell className="font-medium text-gray-900 dark:text-white">
                    {product.productCode}
                  </TableCell>
                  <TableCell className="text-white">
                    {product.productName}
                  </TableCell>
                  <TableCell className="text-white">
                    {product.productId}
                  </TableCell>
                  <TableCell className="text-white">
                    {product.category}
                  </TableCell>
                  <TableCell className="text-white">
                    {product.subCategory}
                  </TableCell>
                  <TableCell className="text-white">{product.unit}</TableCell>
                  <TableCell className="text-white">
                    {product.sellingPrice}
                  </TableCell>
                  <TableCell className="text-white">
                    {product.productStatus}
                  </TableCell>
                  <TableCell className="text-white">
                    {product.description}
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

export default ProductRegister;
