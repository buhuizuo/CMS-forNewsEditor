import React from "react";
import { HeartOutlined } from "@ant-design/icons";
import { Rate } from "antd";
export default function Home() {
  return (
    <div>
      <button>click!</button>
      <Rate character={<HeartOutlined />} allowHalf />
      <br />
      <Rate character="A" allowHalf style={{ fontSize: 36 }} />
      <br />
      <Rate character="好" allowHalf />
    </div>
  );
}
