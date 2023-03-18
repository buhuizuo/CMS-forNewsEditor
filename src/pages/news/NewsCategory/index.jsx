import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { Table, Popconfirm, Form, Input } from "antd";
import { DeleteTwoTone } from "@ant-design/icons";
import "./style.css";

const EditableContext = React.createContext(null);
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};
const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);
  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };
  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({
        ...record,
        ...values,
      });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };
  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};

export default function NewsCategory() {
  const [newsCategory, setNewsCategory] = useState([]);

  //get all category
  useEffect(() => {
    axios.get(`/categories`).then(
      (response) => {
        setNewsCategory(response.data);
      },
      (err) => console.log(err.message)
    );
  }, [newsCategory]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "分类",
      dataIndex: "value",
      onCell: (record) => ({
        record,
        editable: true,
        dataIndex: "title",
        title: "栏目名称",
        handleSave: handleSave,
      }),
    },
    {
      title: "操作",
      //render will pass dataIndex value to use
      render: (item) => {
        return (
          <div>
            {/* delete */}
            <Popconfirm
              title="Are you sure？"
              okText="Yes"
              cancelText="No"
              onConfirm={() => deleteRight(item)}
            >
              <DeleteTwoTone />
            </Popconfirm>
          </div>
        );
      },
    },
  ];
  const handleSave = (row) => {
    console.log(row);
    setNewsCategory(
      newsCategory.map((item) => {
        if (item.id === row.id) {
          return {
            id: item.id,
            title: row.title,
            value: row.title,
          };
        }
        return item;
      })
    );
    axios.patch(`/categories/${row.id}`, {
      title: row.title,
      value: row.title,
    });
  };
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  //delete right
  const deleteRight = (item) => {
    let list = newsCategory.filter((data) => data.id !== item.id);
    setNewsCategory(list);
    axios.delete(`/categories/${item.id}`);
  };

  return (
    <div>
      <Table
        components={components}
        rowClassName={() => "editable-row"}
        bordered
        dataSource={newsCategory}
        columns={columns}
        pagination={{ pageSize: 5 }}
        rowKey={(item) => item.id}
      />
    </div>
  );
}
