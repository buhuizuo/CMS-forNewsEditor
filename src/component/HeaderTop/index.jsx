import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Dropdown, Menu, Space, Avatar } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DownOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { connect } from "react-redux";
const { Header } = Layout;

function HeaderTop(props) {
  const { username } = JSON.parse(localStorage.getItem("token"))[0];
  // const [collapsed, setCollapsed] = useState(false);
  let navigate = useNavigate();
  const menu = (
    <Menu
      items={[
        {
          key: "1",
          label: <a href="#">1st menu item</a>,
        },
        {
          key: "2",
          danger: true,
          label: "log out",
          onClick: () => {
            localStorage.removeItem("token");
            navigate("/login");
          },
        },
      ]}
    />
  );
  //control isCollasp
  const setIsCollapsed = () => {
    console.log(props);
    props.changeCollapsed();
  };
  return (
    <Header className="site-layout-background" style={{ padding: "0 16px" }}>
      {/* {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
        className: "trigger",
        onClick: () => setIsCollapsed(),
      })} */}
      <div style={{ float: "right" }}>
        <span>welcome {username}</span>
        <Dropdown overlay={menu}>
          <a onClick={(e) => e.preventDefault()} href="#">
            <Space>
              <Avatar
                style={{ backgroundColor: "#87d068" }}
                icon={<UserOutlined />}
              />
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </div>
    </Header>
  );
}
const mapStateToProps = (state) => {
  {
    isCollapsed: state.isCollapsed;
  }
};
const mapDispatchToProps = {
  changeCollapsed() {
    return {
      type: "change_collapsed",
    };
  },
};
export default connect(mapStateToProps, mapDispatchToProps)(HeaderTop);
