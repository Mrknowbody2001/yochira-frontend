import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  Label,
  TextInput,
  Textarea,
  Button,
  Select,
} from "flowbite-react";
import { useNavigate } from "react-router-dom";

const CreateDN = () => {
  const navigate = useNavigate();
  const psnId = new URLSearchParams(window.location.search).get("id");

  const [loading, setLoading] = useState(true);
  const [psn, setPsn] = useState(null);
  const [stock, setStock] = useState([]); // Finished Good Stock array
  const [deliveryDate, setDeliveryDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  // Current line being prepared
  const [line, setLine] = useState({
    productId: "",
    productName: "",
    availableQty: 0,
    deliverQty: "",
  });

  // Items to deliver in this note
  const [deliverItems, setDeliverItems] = useState([]);

  // Fetch PSN + Stock
  useEffect(() => {
    const load = async () => {
      try {
        const [psnRes, stockRes] = await Promise.all([
          fetch(`http://localhost:5011/api/psn/GetONePsn/${psnId}`), // returns {data: psn}
          fetch(`http://localhost:5011/api/delivery/finished-stock`), // returns array
        ]);
        const psnData = await psnRes.json();
        if (!psnRes.ok) throw new Error(psnData.message || "Failed PSN fetch");

        const stockData = await stockRes.json();
        setPsn(psnData.data);
        setStock(stockData || []);
      } catch (e) {
        alert(e.message);
      } finally {
        setLoading(false);
      }
    };
    if (psnId) load();
  }, [psnId]);

  const orderTotalValue = useMemo(() => {
    if (!psn?.items?.length) return 0;
    return psn.items.reduce((sum, i) => sum + Number(i.totalValue || 0), 0);
  }, [psn]);

  const onSelectProduct = (pid) => {
    const s = stock.find((s) => s.productId === pid);
    if (!s) {
      setLine({
        productId: "",
        productName: "",
        availableQty: 0,
        deliverQty: "",
      });
      return;
    }
    setLine({
      productId: s.productId,
      productName: s.productName,
      availableQty: Number(s.qty || 0),
      deliverQty: "",
    });
  };

  const addLine = () => {
    if (!line.productId) return alert("Select a product");
    const qty = Number(line.deliverQty);
    if (!qty || qty <= 0) return alert("Enter a valid delivery quantity");
    if (qty > line.availableQty)
      return alert("Delivery qty exceeds available stock");

    // If same product already in list, merge
    const existingIdx = deliverItems.findIndex(
      (x) => x.productId === line.productId
    );
    let next = [...deliverItems];
    if (existingIdx >= 0) {
      next[existingIdx] = {
        ...next[existingIdx],
        deliverQty: Number(next[existingIdx].deliverQty) + qty,
      };
    } else {
      next.push({
        productId: line.productId,
        productName: line.productName,
        deliverQty: qty,
      });
    }
    setDeliverItems(next);

    // Show updated available qty immediately (UX)
    setLine((prev) => ({
      ...prev,
      availableQty: prev.availableQty - qty,
      deliverQty: "",
    }));
  };

  const removeLine = (idx) => {
    setDeliverItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const submitDelivery = async () => {
    if (!psn?._id) return alert("No PSN loaded");
    if (deliverItems.length === 0)
      return alert("Add at least one item to deliver");

    const payload = {
      psnId: psn._id,
      psnNo: psn.PSNNo,
      coNo: psn.coNo,
      customerId: psn.customerId,
      customerName: psn.customerName,
      deliveryDate,
      items: deliverItems.map((i) => ({
        productId: i.productId,
        productName: i.productName,
        qty: Number(i.deliverQty),
      })),
    };

    try {
      const res = await fetch("http://localhost:5011/api/delivery/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delivery failed");

      alert("Delivery Note created successfully");
      navigate("/dashboard?tab=DeliveryPSN");
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) {
    return <div className="p-6 text-white">Loading…</div>;
  }

  if (!psn) {
    return <div className="p-6 text-white">PSN not found</div>;
  }

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Create Delivery Note</h2>

      {/* Card 1: PSN Details */}
      <Card className="bg-gray-800 mb-6">
        <h3 className="text-lg mb-3">PSN Details</h3>
        <div className="grid grid-cols-4 gap-3">
          <div>
            <Label>PSN No</Label>
            <TextInput readOnly value={psn.PSNNo || ""} />
          </div>
          <div>
            <Label>CO No</Label>
            <TextInput readOnly value={psn.coNo || ""} />
          </div>
          <div className="col-span-2">
            <Label>Customer</Label>
            <TextInput
              readOnly
              value={`${psn.customerId || ""} - ${psn.customerName || ""}`}
            />
          </div>
          <div>
            <Label>Order Date</Label>
            <TextInput
              readOnly
              type="date"
              value={
                psn.orderDate
                  ? new Date(psn.orderDate).toISOString().slice(0, 10)
                  : ""
              }
            />
          </div>
          <div>
            <Label>Status</Label>
            <TextInput readOnly value={psn.status || ""} />
          </div>
          <div className="col-span-4">
            <Label>Remark</Label>
            <Textarea readOnly value={psn.remark || ""} />
          </div>
        </div>
      </Card>

      {/* Card 2: CO Details & Order Items */}
      <Card className="bg-gray-800 mb-6">
        <h3 className="text-lg mb-3">Customer Order Items</h3>
        {psn.items?.length ? (
          <table className="w-full text-sm text-white border border-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left">Product</th>
                <th className="px-4 py-2">Qty</th>
                <th className="px-4 py-2">Unit Price</th>
                <th className="px-4 py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {psn.items.map((i, idx) => (
                <tr key={idx} className="bg-gray-600">
                  <td className="px-4 py-2">{i.productName}</td>
                  <td className="px-4 py-2 text-center">{i.qty}</td>
                  <td className="px-4 py-2 text-center">
                    {(Number(i.unitPrice) || 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {(Number(i.totalValue) || 0).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-700 font-semibold">
                <td colSpan="3" className="text-right px-4 py-2">
                  Items Total
                </td>
                <td className="px-4 py-2">{orderTotalValue.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        ) : (
          <p>No items found.</p>
        )}
      </Card>

      {/* Card 3: Finished Goods Selection + Delivery Lines */}
      <Card className="bg-gray-800 mb-6">
        <h3 className="text-lg mb-4">Delivery Details</h3>

        <div className="grid grid-cols-5 gap-4 items-end mb-4">
          <div className="col-span-2">
            <Label>Finished Product</Label>
            <Select
              value={line.productId}
              onChange={(e) => onSelectProduct(e.target.value)}
            >
              <option value="">-- Select product --</option>
              {stock.map((s) => (
                <option key={s.productId} value={s.productId}>
                  {s.productId} - {s.productName}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label>Available Qty</Label>
            <TextInput readOnly value={line.availableQty} />
          </div>

          <div>
            <Label>Deliver Qty</Label>
            <TextInput
              type="number"
              value={line.deliverQty}
              onChange={(e) =>
                setLine((p) => ({ ...p, deliverQty: e.target.value }))
              }
              min="1"
            />
          </div>

          <div className="flex items-end">
            <Button onClick={addLine}>Add</Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <Label>Delivery Date</Label>
            <TextInput
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
            />
          </div>
        </div>

        {deliverItems.length > 0 && (
          <table className="w-full text-sm text-white border border-gray-700 mb-4">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left">Product</th>
                <th className="px-4 py-2">Qty</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {deliverItems.map((i, idx) => (
                <tr key={idx} className="bg-gray-600">
                  <td className="px-4 py-2">
                    {i.productId} - {i.productName}
                  </td>
                  <td className="px-4 py-2 text-center">{i.deliverQty}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-white"
                      onClick={() => removeLine(idx)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="flex gap-4">
          <Button color="green" onClick={submitDelivery}>
            Create Delivery Note
          </Button>
          <Button
            color="gray"
            onClick={() => navigate("/dashboard?tab=DeliveryPSN")}
          >
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CreateDN;
