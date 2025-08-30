// src/components/SidebarMenu.jsx
"use client";

import {
  Sidebar,
  SidebarCollapse,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
} from "flowbite-react";
import { useEffect, useState } from "react";
import {
  HiOutlineWrenchScrewdriver,
  HiCube,
  HiUserGroup,
  HiTruck,
  HiCubeTransparent,
  HiArrowDownOnSquare,
  HiClipboardDocumentCheck,
  HiPlay,
  HiCog,
} from "react-icons/hi2";
import { HiClipboardCheck, HiViewGrid } from "react-icons/hi";
import { useLocation } from "react-router-dom";

export default function SidebarMenu() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const [openCollapses, setOpenCollapses] = useState([]); // store open collapse labels
  const [userToggledCollapses, setUserToggledCollapses] = useState([]);

  //! Function to toggle collapse state
  const toggleCollapse = (label) => {
    let newOpen = [...openCollapses];

    if (newOpen.includes(label)) {
      // collapse is open, remove it
      newOpen = newOpen.filter((l) => l !== label);
    } else {
      // add new collapse
      newOpen.push(label);

      // keep only last 2 open
      if (newOpen.length > 2) {
        newOpen.shift(); // remove oldest
      }
    }

    setOpenCollapses(newOpen);
  };

  const isOrderManagementOpen =
    openCollapses.includes("order Management") || // user toggled it
    [
      "CoRegister",
      "CoApproval",
      "SORegister",
      "PendingSO",
      "SOReceiveNoteList",
    ].includes(tab); // active tab

  // Effect to sync tab state with URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) setTab(tabFromUrl);
  }, [location.search]);
  return (
    <Sidebar
      aria-label="Maintenance Dashboard Sidebar"
      className="h-full w-full"
    >
      <SidebarItems>
        <SidebarItemGroup>
          <SidebarItem
            className="text-[14px]"
            href="?tab=DashboardPage"
            active={tab === "DashboardPage"}
          >
            Dashboard
          </SidebarItem>
        </SidebarItemGroup>
        <SidebarItemGroup>
          <p className="text-[15px] font-semibold text-slate-400 mx-2 py-3">
            Master Data
          </p>
          <SidebarCollapse
            icon={HiOutlineWrenchScrewdriver}
            label="Maintenance"
          >
            <SidebarCollapse
              className="text-[14px]"
              icon={HiCube}
              label="Product Management"
              onClick={() => toggleCollapse("Product Management")}
              open={openCollapses.includes("Product Management")}
            >
              <SidebarItem
                className="text-[14px]"
                href="?tab=productRegister"
                active={tab === "productRegister"}
              >
                Register Product
              </SidebarItem>
            </SidebarCollapse>

            <SidebarCollapse
              className="text-[14px]"
              icon={HiArrowDownOnSquare}
              label="Category Management"
              onClick={() => toggleCollapse("Category Management")}
              open={openCollapses.includes("Category Management")}
            >
              <SidebarItem
                className="text-[14px]"
                href="?tab=CategoryRegister"
                active={tab === "CategoryRegister"}
              >
                Create Category
              </SidebarItem>
              <SidebarItem
                className="text-[14px]"
                href="?tab=SubCategoryRegister"
                active={tab === "SubCategoryRegister"}
              >
                Create Sub-Category
              </SidebarItem>
            </SidebarCollapse>

            <SidebarCollapse
              icon={HiUserGroup}
              label="Customer Management"
              onClick={() => toggleCollapse("Customer Management")}
              open={openCollapses.includes("Customer Management")}
            >
              <SidebarItem
                className="text-[14px]"
                href="?tab=CustomerRegister"
                active={tab === "CustomerRegister"}
              >
                Customer
              </SidebarItem>
              <SidebarItem href="#" className="text-[14px]">
                Approve Customer
              </SidebarItem>
            </SidebarCollapse>

            <SidebarCollapse
              className="text-[14px]"
              icon={HiTruck}
              label="Supplier Management"
              onClick={() => toggleCollapse("Supplier Management")}
              open={openCollapses.includes("Supplier Management")}
            >
              <SidebarItem
                className="text-[14px]"
                href="?tab=SupplierRegister"
                active={tab === "SupplierRegister"}
              >
                Supplier
              </SidebarItem>
              <SidebarItem
                className="text-[14px]"
                href="?tab=SupplierApproval"
                active={tab === "SupplierApproval"}
              >
                Supplier Approval
              </SidebarItem>
            </SidebarCollapse>

            {/* <SidebarItem icon={HiCubeTransparent} href="#">
              Raw Material Management
            </SidebarItem> */}
            <SidebarCollapse
              className="text-[14px]"
              icon={HiCubeTransparent}
              label="Raw-Material Management"
              onClick={() => toggleCollapse("Raw-Material Management")}
              open={openCollapses.includes("Raw-Material Management")}
            >
              <SidebarItem
                className="text-[14px]"
                href="?tab=RawMaterialRegister"
                active={tab === "RawMaterialRegister"}
              >
                Raw-Material
              </SidebarItem>
              {/* <SidebarItem href="#">Raw-Material Approve</SidebarItem> */}
              <SidebarItem
                className="text-[14px]"
                href="?tab=SupplierMaterialMapping"
                active={tab === "SupplierMaterialMapping"}
              >
                Raw Material Mapping
              </SidebarItem>
            </SidebarCollapse>
          </SidebarCollapse>
        </SidebarItemGroup>

        <SidebarItemGroup>
          <p className="p-3 px-2 font-semibold text-sm text-slate-400">
            Manufacturing
          </p>
          <SidebarCollapse
            className="text-[15px]"
            icon={HiClipboardDocumentCheck}
            label="order Management"
            onClick={() => toggleCollapse("order Management")}
            open={isOrderManagementOpen}
          >
            <SidebarItem
              className="text-[15px]"
              href="?tab=CoRegister"
              active={tab === "CoRegister"}
            >
              Customer Order
            </SidebarItem>
            <SidebarItem
              className="text-[15px]"
              href="?tab=CoApproval"
              active={tab === "CoApproval"}
            >
              Customer Order Approval
            </SidebarItem>
            <SidebarItem
              className="text-[15px]"
              href="?tab=SORegister"
              active={tab === "SORegister"}
            >
              Supplier Order
            </SidebarItem>
            <SidebarItem
              className="text-[15px]"
              href="?tab=PendingSO"
              active={tab === "PendingSO"}
            >
              Supplier Order Approval
            </SidebarItem>
            <SidebarItem
              className="text-[15px]"
              href="?tab=SOReceiveNoteList"
              active={tab === "SOReceiveNoteList"}
            >
              Supplier Order Receive
            </SidebarItem>
          </SidebarCollapse>
        </SidebarItemGroup>
        <SidebarItemGroup>
          <p className="p-3 px-2 font-semibold text-sm text-slate-400">
            Stock Management
          </p>
          <SidebarCollapse
            className="text-[15px]"
            icon={HiCubeTransparent}
            label=" Stocks Management"
          >
            <SidebarItem
              className="text-[15px]"
              href="?tab=MaterialStoreTable"
              active={tab === "MaterialStoreTable"}
            >
              Material Stock
            </SidebarItem>
            <SidebarItem
              className="text-[15px]"
              href="?tab=TransactionLog"
              active={tab === "TransactionLog"}
            >
              Stock Transaction Log
            </SidebarItem>
            <SidebarItem
              className="text-[15px]"
              href="?tab=StockIn"
              active={tab === "StockIn"}
            >
              Stock In
            </SidebarItem>
            <SidebarItem
              className="text-[15px]"
              href="?tab=StockOut"
              active={tab === "StockOut"}
            >
              Stock Out
            </SidebarItem>
          </SidebarCollapse>
        </SidebarItemGroup>
        {/* production */}
        <SidebarItemGroup>
          <p className="p-3 px-2 font-semibold text-sm text-slate-400">
            Production
          </p>
          <SidebarCollapse
            className="text-[15px]"
            icon={HiCog}
            label="Production Management"
          >
            <SidebarItem
              className="text-[15px]"
              href="?tab=PSNRegister"
              active={tab === "PSNRegister"}
            >
              Production Start
            </SidebarItem>
            <SidebarItem
              className="text-[15px]"
              href="?tab=ProductionApproval"
              active={tab === "ProductionApproval"}
            >
              Production Approval
            </SidebarItem>
            <SidebarItem
              className="text-[15px]"
              href="?tab=StartedPSN"
              active={tab === "StartedPSN"}
            >
              Production Finished
            </SidebarItem>
          </SidebarCollapse>
          <SidebarCollapse
            className="text-[15px]"
            icon={HiClipboardCheck}
            label="Quality Check"
          >
            <SidebarItem
              className="text-[15px]"
              href="?tab=QcRegister"
              active={tab === "QcRegister"}
            >
              QC Register
            </SidebarItem>
            <SidebarItem
              className="text-[15px]"
              href="?tab=QcNList"
              active={tab === "QcNList"}
            >
              QCN List
            </SidebarItem>
            <SidebarItem
              className="text-[15px]"
              href="?tab=QCPassList"
              active={tab === "QCPassList"}
            >
              QC Pass List
            </SidebarItem>
            <SidebarItem
              className="text-[15px]"
              href="?tab=QCReworkList"
              active={tab === "QCReworkList"}
            >
              QC Rework List
            </SidebarItem>
            <SidebarItem
              className="text-[15px]"
              href="?tab=QcFailList"
              active={tab === "QcFailList"}
            >
              QC Fail List
            </SidebarItem>
          </SidebarCollapse>
          <SidebarItem
            className="text-[15px]"
            icon={HiViewGrid}
            href="?tab=FinishedGoodStockList"
            active={tab === "FinishedGoodStockList"}
          >
            Finished Good Stock
          </SidebarItem>
        </SidebarItemGroup>
        <SidebarItemGroup>
          <p className="p-3 px-2 font-semibold text-sm text-slate-400">
            Delivery
          </p>
          <SidebarCollapse
            className="text-[15px]"
            icon={HiTruck}
            label="Delivery Management"
          >
            <SidebarItem
              className="text-[15px]"
              href="?tab=DNList"
              active={tab === "DNList"}
            >
              Delivery PSN List
            </SidebarItem>
          </SidebarCollapse>
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  );
}
