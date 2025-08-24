import { Card, Label, TextInput, Button } from "flowbite-react";
import React, { useState } from "react";

const StockOut = () => {
  const [formData, setFormData] = React.useState({
    material: "",
    uom: "",
    qty: "",
  });

  const handleAddMaterial = () => {};
  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg">
      <div className="test-xl font-semibold mb-4">Stock Out</div>
      {/* card for stock in  */}
      <Card className="bg-gray-800 mb-6">
        <div className="flex  gap-2">
          <div className="w-1/3">
            <Label htmlFor="material">Material </Label>
            <TextInput
              id="material"
              name="material"
              value={formData.material}
            />
          </div>
          <div className="w-1/3">
            <Label htmlFor="uom">UOM </Label>
            <TextInput id="uom" name="uom" value={formData.uom} readOnly />
          </div>
          <div className="w-1/3">
            <Label htmlFor="qty">QTY </Label>
            <TextInput id="qty" name="qty" value={formData.qty} />
          </div>
        </div>
        <Button color="blue" onClick={handleAddMaterial} className="mb-4">
          Add Material
        </Button>
      </Card>
    </div>
  );
};

export default StockOut;
