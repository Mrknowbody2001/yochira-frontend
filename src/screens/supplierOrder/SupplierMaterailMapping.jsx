import React, { useEffect, useState, useCallback } from "react";
import {
  Button,
  Select,
  Label,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";

const SupplierMaterialMapping = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [mappedMaterials, setMappedMaterials] = useState([]);
  const [existingMappings, setExistingMappings] = useState([]);

  // Fetch all suppliers
  useEffect(() => {
    fetch(
      "http://localhost:5007/api/supplier/getAllApprovedSuppliers?status=approved"
    )
      .then((res) => res.json())
      .then((data) => setSuppliers(data.suppliers || []))
      .catch((err) => console.error("Error fetching suppliers:", err));
  }, []);

  // Fetch all materials
  useEffect(() => {
    fetch("http://localhost:5007/api/materials/all")
      .then((res) => res.json())
      .then((data) => setMaterials(data.materials || []))
      .catch((err) => {
        console.error("Error fetching materials:", err);
        setMaterials([]);
      });
  }, []);

  // Helper: fetch latest mapping for a given supplier (supplier _id or default to current selection)
  const fetchExistingMapping = useCallback(
    async (supplierMongoId = selectedSupplier) => {
      if (!supplierMongoId) {
        setExistingMappings([]);
        return;
      }

      const supplier = suppliers.find((s) => s._id === supplierMongoId);
      if (!supplier) {
        setExistingMappings([]);
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:5007/api/mapping/supplier/${supplier.supplierId}`
        );
        if (!res.ok) {
          // mapping not found or other server response -> clear
          setExistingMappings([]);
          return;
        }

        const json = await res.json();

        // backend might return { mapping }, { data }, or the mapping directly
        const mapping = json.mapping || json.data || json;
        const mats = (mapping.materials || []).map((m) => ({
          materialName: m.materialName,
          materialId: m.materialId,
        }));
        setExistingMappings(mats);
      } catch (err) {
        console.error("Error fetching mapping:", err);
        setExistingMappings([]);
      }
    },
    [selectedSupplier, suppliers]
  );

  // call fetchExistingMapping when user changes supplier
  useEffect(() => {
    fetchExistingMapping();
  }, [selectedSupplier, suppliers, fetchExistingMapping]);

  // Add material to mapped list (local new mappings)
  const handleAddMaterial = () => {
    if (!selectedSupplier || !selectedMaterial) {
      alert("Select both supplier and material");
      return;
    }

    const supplier = suppliers.find((s) => s._id === selectedSupplier);
    const material = materials.find((m) => m._id === selectedMaterial);
    if (!supplier || !material) return;

    const alreadyExists = mappedMaterials.some(
      (m) =>
        m.materialId === material.materialId &&
        m.supplierId === supplier.supplierId
    );
    if (alreadyExists) return;

    setMappedMaterials((prev) => [
      ...prev,
      {
        supplierName: supplier.name,
        supplierId: supplier.supplierId,
        materialName: material.materialName,
        materialId: material.materialId,
        materialMongoId: material._id,
        supplierMongoId: supplier._id,
      },
    ]);

    setSelectedMaterial("");
  };

  // Remove material from local mapped list
  const handleRemoveMaterial = (index) => {
    setMappedMaterials((prev) => prev.filter((_, i) => i !== index));
  };

  // Save mapping (grouped by supplier) and refresh server mapping for selected supplier
  const handleSaveMapping = async () => {
    if (mappedMaterials.length === 0) {
      alert("Add at least one mapping");
      return;
    }

    try {
      // Group mappings by supplierId
      const supplierMap = {};
      mappedMaterials.forEach((m) => {
        if (!supplierMap[m.supplierId]) supplierMap[m.supplierId] = [];
        supplierMap[m.supplierId].push(m.materialId);
      });

      // send requests (sequentially here; you can use Promise.all for parallel)
      for (const [supplierId, materialIds] of Object.entries(supplierMap)) {
        const payload = { supplierId, materialIds };

        const res = await fetch("http://localhost:5007/api/mapping/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || "Failed to save mapping.");
        }
      }

      alert("All mappings saved.");

      // Refresh server mapping for currently selected supplier (so UI shows latest)
      await fetchExistingMapping();

      // clear local staged mappings
      setMappedMaterials([]);
    } catch (err) {
      console.error(err);
      alert("Error saving mappings: " + err.message);
    }
  };

  // Remove one material from existing mapping on server, then refresh
  const handleRemoveExistingMaterial = async (materialIdToRemove) => {
    const supplier = suppliers.find((s) => s._id === selectedSupplier);
    if (!supplier) return;
    if (!window.confirm("Are you sure you want to remove this material?"))
      return;

    try {
      const res = await fetch(
        "http://localhost:5007/api/mapping/removeMaterial-Mapping",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            supplierId: supplier.supplierId,
            materialId: materialIdToRemove,
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to remove material.");
      }

      // we don't rely on the exact response shape; refresh from server to be safe
      await fetchExistingMapping();
    } catch (err) {
      console.error(err);
      alert("Error removing material: " + err.message);
    }
  };

  return (
    <div className="bg-[#172e75] text-white min-h-screen w-full p-6 rounded overflow-auto">
      <Card>
        <h2 className="text-xl text-white font-bold mb-4">
          Supplier-Material Mapping
        </h2>

        <div className="mb-4 ">
          <Label htmlFor="supplier">Select Supplier</Label>
          <Select
            id="supplier"
            value={selectedSupplier}
            onChange={(e) => setSelectedSupplier(e.target.value)}
          >
            <option value="">-- Select Supplier --</option>
            {suppliers.map((supplier) => (
              <option key={supplier._id} value={supplier._id}>
                {supplier.name} ({supplier.supplierId})
              </option>
            ))}
          </Select>
        </div>

        <div className="mb-4">
          <Label htmlFor="material">Select Material</Label>
          <div className="flex gap-2 p-2">
            <Select
              id="material"
              value={selectedMaterial}
              onChange={(e) => setSelectedMaterial(e.target.value)}
            >
              <option value="">-- Select Material --</option>
              {(materials || []).map((mat) => (
                <option key={mat._id} value={mat._id}>
                  {mat.materialName} ({mat.materialId})
                </option>
              ))}
            </Select>
            <Button onClick={handleAddMaterial}>Add</Button>
          </div>
        </div>

        {mappedMaterials.length > 0 && (
          <div className="mb-4">
            <Table striped>
              <TableHead>
                <TableRow>
                  <TableHeadCell>Supplier Name</TableHeadCell>
                  <TableHeadCell>Supplier ID</TableHeadCell>
                  <TableHeadCell>Material Name</TableHeadCell>
                  <TableHeadCell>Material ID</TableHeadCell>
                  <TableHeadCell>Action</TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mappedMaterials.map((map, index) => (
                  <TableRow key={map.materialId + index}>
                    <TableCell>{map.supplierName}</TableCell>
                    <TableCell>{map.supplierId}</TableCell>
                    <TableCell>{map.materialName}</TableCell>
                    <TableCell>{map.materialId}</TableCell>
                    <TableCell>
                      <Button
                        size="xs"
                        color="failure"
                        onClick={() => handleRemoveMaterial(index)}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="flex justify-end">
          <Button
            onClick={handleSaveMapping}
            disabled={!selectedSupplier || mappedMaterials.length === 0}
          >
            Save Mapping
          </Button>
        </div>
      </Card>

      {existingMappings.length > 0 && (
        <Card className="mt-6">
          <h3 className="text-lg font-semibold mb-4">
            Existing Mappings for{" "}
            {suppliers.find((s) => s._id === selectedSupplier)?.name ||
              "Selected Supplier"}
          </h3>

          <Table striped>
            <TableHead>
              <TableRow>
                <TableHeadCell>Material Name</TableHeadCell>
                <TableHeadCell>Material ID</TableHeadCell>
                <TableHeadCell>Action</TableHeadCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {existingMappings.map((map, index) => (
                <TableRow key={map.materialId + index}>
                  <TableCell>{map.materialName}</TableCell>
                  <TableCell>{map.materialId}</TableCell>
                  <TableCell>
                    <Button
                      size="xs"
                      color="failure"
                      onClick={() =>
                        handleRemoveExistingMaterial(map.materialId)
                      }
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
};

export default SupplierMaterialMapping;
