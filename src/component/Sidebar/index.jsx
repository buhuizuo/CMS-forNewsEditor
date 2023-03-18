import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  UserOutlined,
  AreaChartOutlined,
  RadarChartOutlined,
  GroupOutlined,
  InsuranceOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import axios from "axios";
import "./style.css";
const { Sider } = Layout;

export default function Sidebar(props) {
  let navigate = useNavigate();
  //sidebar smaller
  const [collapsed, setCollapsed] = useState(false);
  //sidebar info
  const [sidebarInfo, setSidebarInfo] = useState([]);
  const {
    role: { rights },
  } = JSON.parse(localStorage.getItem("token"))[0];
  //map sidebar info,return new items array
  const mapInfo = (data) => {
    return data.map((item) => {
      //if has children, map children
      if (
        item.children?.length > 0 &&
        item.pagepermisson === 1 &&
        rights.includes(item.key)
      ) {
        return getItem(
          item.title,
          item.key,
          iconList[item.key],
          mapInfo(item.children)
        );
      }
      if (item.pagepermisson === 1 && rights.includes(item.key)) {
        return getItem(item.title, item.key, iconList[item.key]);
      }
      return null;
    });
  };
  //icon list
  const iconList = {
    "/home": <UserOutlined />,
    "/user-manage": <AreaChartOutlined />,
    "/right-manage": <RadarChartOutlined />,
    "/news-manage": <GroupOutlined />,
    "/audit-manage": <InsuranceOutlined />,
    "/publish-manage": <NotificationOutlined />,
  };
  //send request to get sidebar data
  useEffect(() => {
    axios.get("/rights?_embed=children").then(
      (response) => {
        const info = mapInfo(response.data);
        //after get data, put to display
        setSidebarInfo(info);
      },
      (err) => {
        console.log(err.message);
      }
    );
  }, []);

  //return a new instance of meun item
  function getItem(label, key, icon, children) {
    return {
      key,
      icon,
      children,
      label,
    };
  }
  //show diff page
  const navigateTo = (item) => {
    navigate("/sandbox" + item.key);
  };
  //get pathname for refresh and get back to same spot
  const location = useLocation();
  const getLocation = () => {
    let pathnameGet = location.pathname.split("/sandbox");
    return [pathnameGet[1]];
  };
  //get which folded one shou;d be open
  const getOpenKey = () => {
    let openKeys = location.pathname.split("/");
    return ["/" + openKeys[2]];
  };
  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div className="logo">全球新闻发布管理系统</div>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={getLocation}
        defaultOpenKeys={getOpenKey}
        items={sidebarInfo}
        onClick={navigateTo}
      />
    </Sider>
  );
}
