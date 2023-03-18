import React from "react";
import HeaderTop from "../../component/HeaderTop";
import Sidebar from "../../component/Sidebar";
import "./style.css";
import { Outlet } from "react-router-dom";
import { Layout } from "antd";
const { Content } = Layout;

export default function Sandbox() {
  return (
    <Layout>
      <Sidebar />
      <Layout className="site-layout">
        <HeaderTop />
        <Content
          className="site-layout-background"
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            overflow: "auto",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
