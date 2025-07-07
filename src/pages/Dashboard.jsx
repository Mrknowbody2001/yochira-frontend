import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SidebarMenu from "../components/SideBar";

import CategoryRegister from "../screens/categoryManagement/CategoryRegister";
import ProductRegister from "../screens/productManagement/ProductRegister";
import SubCategoryRegister from "../screens/categoryManagement/SubCategoryRegister";

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
      <div className="md:w-70 ">
        <SidebarMenu />
      </div>

      <div className="flex-1 p-4 overflow-auto bg-[#172e75] min-h-screen">
        {/* dashboard  */}
        {tab === "productRegister" && <ProductRegister />}

        {tab === "CategoryRegister" && <CategoryRegister />}
        {tab === "SubCategoryRegister" && <SubCategoryRegister />}
      </div>
    </div>
  );
};

export default Dashboard;
