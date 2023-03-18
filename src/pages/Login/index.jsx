import React from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import { Button, Form, Input } from "antd";
import axios from "axios";
export default function Login() {
  let navigate = useNavigate();
  const onFinish = (value) => {
    const { username, password } = value;
    axios
      .get(
        `/users?username=${username}&password=${password}&roleState=${true}&_expand=role`
      )
      .then((response) => {
        if (response.data.length > 0) {
          localStorage.setItem("token", JSON.stringify(response.data));
          navigate("/sandbox/home");
        }
      });
  };
  const onFinishFailed = () => {};
  return (
    <div style={{ height: "100%", backgroundColor: "rgb(35, 39, 65)" }}>
      <div className="fixedBox">
        <div className="logintitle">全球新闻发布管理系统</div>
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
