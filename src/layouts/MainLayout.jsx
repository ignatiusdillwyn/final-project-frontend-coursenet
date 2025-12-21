import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const MainLayout = () => {
  return (
    <>
      <div className="w-full">
        <Navbar></Navbar>
      </div>
      <div className="w-full">
        <Outlet></Outlet>
      </div>
    </>
  );
};

export default MainLayout;
