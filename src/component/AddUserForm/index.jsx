import React, { useState, useEffect } from "react";
import { Form, Input, Select } from "antd";
const { Option } = Select;

const AddUserForm = React.forwardRef((props, formRef) => {
  const [ifBlock, setIfBlock] = useState(false);
  const { roleId, region } = JSON.parse(localStorage.getItem("token"))[0];
  //for when click edit user,to show the user info been click
  useEffect(() => {
    //need to edit roleId, or it'll show roleId as 1 2 3
    // props.editItem.roleId = props.editItem.role.roleName;
    formRef.current.setFieldsValue(props.editItem);
    setIfBlock(props.updateDisable);
  }, [props.editItem, props.updateDisable]);

  const ifBlockRegion = (roleId) => {
    if (roleId === "1") {
      setIfBlock(true);
      formRef.current.setFieldValue("region", "");
    } else {
      setIfBlock(false);
    }
  };
  return (
    <Form
      ref={formRef}
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
      autoComplete="off"
    >
      <Form.Item
        label="用户名"
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
        label="密码"
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
        label="角色"
        name="roleId"
        rules={[
          {
            required: true,
            message: "Please!",
          },
        ]}
      >
        <Select
          onChange={(e) => ifBlockRegion(e)}
          style={{
            width: 220,
          }}
        >
          {props.roleList.map((role) => {
            return (
              <Option
                value={role.type}
                key={role.id}
                disabled={roleId === "1" || role.roleType === 3 ? false : true}
              >
                {role.roleName}
              </Option>
            );
          })}
        </Select>
      </Form.Item>
      <Form.Item
        label="区域"
        name="region"
        rules={[
          {
            required: ifBlock ? false : true,
            message: "Please!",
          },
        ]}
      >
        <Select
          disabled={ifBlock}
          style={{
            width: 220,
          }}
        >
          {props.regionList.map((reg) => {
            return (
              <Option
                value={reg.value}
                key={reg.id}
                disabled={roleId === "1" || reg.title === region ? false : true}
              >
                {reg.title}
              </Option>
            );
          })}
        </Select>
      </Form.Item>
    </Form>
  );
});

export default AddUserForm;
