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
} from "react-icons/hi2";
import { HiClipboardCheck } from "react-icons/hi";
import { useLocation } from "react-router-dom";

export default function SidebarMenu() {
  const location = useLocation();
  const [tab, setTab] = useState("");
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
            >
              <SidebarItem
                className="text-[14px]"
                href="?tab=productRegister"
                active={tab === "productRegister"}
              >
                Register Product
              </SidebarItem>
              <SidebarItem href="#" className="text-[14px]">
                Product Approval
              </SidebarItem>
            </SidebarCollapse>

            <SidebarCollapse
              className="text-[14px]"
              icon={HiArrowDownOnSquare}
              label="Category Management"
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

            <SidebarCollapse icon={HiUserGroup} label="Customer Management">
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
      </SidebarItems>
    </Sidebar>
  );
}
