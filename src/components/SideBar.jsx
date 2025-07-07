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
          <p className="text-sm font-semibold text-slate-400 mx-2">
            Master Data
          </p>
          <SidebarCollapse
            icon={HiOutlineWrenchScrewdriver}
            label="Maintenance"
          >
            <SidebarCollapse icon={HiCube} label="Product Management">
              <SidebarItem
                href="?tab=productRegister"
                active={tab === "productRegister"}
              >
                Register Product
              </SidebarItem>
              <SidebarItem href="#">Product Approval</SidebarItem>
            </SidebarCollapse>

            <SidebarCollapse
              icon={HiArrowDownOnSquare}
              label="Category Management"
            >
              <SidebarItem
                href="?tab=CategoryRegister"
                active={tab === "CategoryRegister"}
              >
                Create Category
              </SidebarItem>
              <SidebarItem
                href="?tab=SubCategoryRegister"
                active={tab === "SubCategoryRegister"}
              >
                Create Sub-Category
              </SidebarItem>
            </SidebarCollapse>

            <SidebarCollapse icon={HiUserGroup} label="Customer Management">
              <SidebarItem href="#">Customer</SidebarItem>
              <SidebarItem href="#">Approve Customer</SidebarItem>
            </SidebarCollapse>

            <SidebarCollapse icon={HiTruck} label="Supplier Management">
              <SidebarItem href="#">Supplier</SidebarItem>
              <SidebarItem href="#">Supplier Approval</SidebarItem>
              <SidebarItem href="#">Raw Material Mapping</SidebarItem>
            </SidebarCollapse>

            {/* <SidebarItem icon={HiCubeTransparent} href="#">
              Raw Material Management
            </SidebarItem> */}
            <SidebarCollapse
              icon={HiCubeTransparent}
              label="Raw-Material Management"
            >
              <SidebarItem href="#">Raw-Material</SidebarItem>
              <SidebarItem href="#">Raw-Material Approve</SidebarItem>
              {/* <SidebarItem href="#">Raw Material Mapping</SidebarItem> */}
            </SidebarCollapse>
          </SidebarCollapse>
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  );
}
