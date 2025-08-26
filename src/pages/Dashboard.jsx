import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SidebarMenu from "../components/SideBar";

import CategoryRegister from "../screens/categoryManagement/CategoryRegister";
import ProductRegister from "../screens/productManagement/ProductRegister";
import SubCategoryRegister from "../screens/categoryManagement/SubCategoryRegister";
import CustomerRegister from "../screens/customerManagement/CustomerRegister";
import CoRegister from "../screens/customerOrder/CoRegister";
import GetOneCO from "../screens/customerOrder/getOneCO";
import CoApproval from "../screens/customerOrder/CoApproval";
import PendingCO from "../screens/customerOrder/PendingCO";
import ApproveCustomerOrder from "../screens/customerOrder/ApproveCustomerOrder";
import RawMaterialRegister from "../screens/raw-material/RawMaterialRegister";
import RawMaterialForm from "../screens/raw-material/RawMaterialForm";
import SupplierForm from "../screens/supplierManagement/SupplierForm";
import SupplierRegister from "../screens/supplierManagement/SupplierRegister";
import SupplierApproval from "../screens/supplierManagement/SupplierApproval";
import GetOneSupplier from "../screens/supplierManagement/GetOneSupplier";
import OneSupplierApproval from "../screens/supplierManagement/OneSupplierApproval";
import SORegister from "../screens/supplierOrder/SORegister";
import SupplierMaterialMapping from "../screens/supplierOrder/SupplierMaterailMapping";
import SupplierOrderForm from "../screens/supplierOrder/SOForm";
import GetOneSupplierOrder from "../screens/supplierOrder/getOneSupplierOrder";
import PendingSO from "../screens/supplierOrder/PendingSO";
import GetOnePendingSo from "../screens/supplierOrder/GetOnePendingSo";
import SOReceiveNoteList from "../screens/SORManagement/SOReceiveNoteList";
import ApprovedSOList from "../screens/SORManagement/ApprovedSOList";
import GetOneApprovedSo from "../screens/SORManagement/GetOneApprovedSo";
import Header from "../components/Header";
import MaterialStoreTable from "../screens/Stock/materialStock";
import TransactionLog from "../screens/Stock/TransactionLog";
import StockIn from "../screens/Stock/StockIn";
import StockOut from "../screens/Stock/StockOut";
import ProductionStartNote from "../screens/Production/ProductionStartNote";
import ApprovedCoList from "../screens/Production/ApprovedCoList";
import PSNRegister from "../screens/Production/PSNRegister";
const Dashboard = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) setTab(tabFromUrl);
  }, [location.search]);
  //!
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* side bar  */}
      <div className="md:w-65 ">
        <SidebarMenu />
      </div>
      {/* main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header />

        <div className="flex-1 px-4  overflow-auto bg-[#172e75] min-h-screen">
          {/* dashboard  */}
          {tab === "productRegister" && <ProductRegister />}

          {tab === "CategoryRegister" && <CategoryRegister />}
          {tab === "SubCategoryRegister" && <SubCategoryRegister />}
          {tab === "CustomerRegister" && <CustomerRegister />}
          {/* {tab === "CoRegister" && <CoRegister />} */}
          {tab === "RawMaterialRegister" && <RawMaterialRegister />}
          {tab === "RawMaterialForm" && <RawMaterialForm />}
          {tab === "SupplierForm" && <SupplierForm />}
          {tab === "SupplierRegister" && <SupplierRegister />}
          {tab === "SupplierApproval" && <SupplierApproval />}
          {tab === "GetOneSupplier" && <GetOneSupplier />}
          {tab === "OneSupplierApproval" && <OneSupplierApproval />}
          {tab === "SORegister" && <SORegister />}
          {tab === "SupplierMaterialMapping" && <SupplierMaterialMapping />}
          {tab === "GetOneSupplierOrder" && <GetOneSupplierOrder />}
          {tab === "PendingSO" && <PendingSO />}
          {tab === "SupplierOrderForm" && <SupplierOrderForm />}
          {tab === "GetOnePendingSo" && <GetOnePendingSo />}

          {tab === "ApprovedSOList" && <ApprovedSOList />}
          {tab === "GetOneApprovedSo" && <GetOneApprovedSo />}
          {tab === "SOReceiveNoteList" && <SOReceiveNoteList />}

          {/* customer order section  */}
          {tab === "CoRegister" && (
            <CoRegister
              id={new URLSearchParams(window.location.search).get("id")}
              onCancel={() => {
                window.location.href = "/dashboard?tab=CoRegister";
              }}
            />
          )}

          {tab === "GetOneCO" && (
            <GetOneCO
              id={new URLSearchParams(window.location.search).get("id")}
              onCancel={() => {
                window.location.href = "/dashboard?tab=GetOneCO";
              }}
            />
          )}
          {tab === "CoApproval" && <CoApproval />}
          {tab === "PendingCO" && <PendingCO />}
          {tab === "ApproveCustomerOrder" && <ApproveCustomerOrder />}

          {/* stock management */}
          {tab === "MaterialStoreTable" && <MaterialStoreTable />}
          {tab === "TransactionLog" && <TransactionLog />}
          {tab === "StockIn" && <StockIn />}
          {tab === "StockOut" && <StockOut />}

          {/* production  */}
          {tab === "ProductionStartNote" && <ProductionStartNote />}
          {tab === "ApprovedCoList" && <ApprovedCoList />}
          {tab === "PSNRegister" && <PSNRegister />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
