import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Tag, Popconfirm, Popover, Switch } from "antd";
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
export default function RightList() {
  const [dataSource, setDataSource] = useState([]);
  useEffect(() => {
    axios.get("/rights?_embed=children").then(
      (response) => {
        const list = response.data;
        list.forEach((item) => {
          if (item.children.length === 0) {
            item.children = "";
          }
        });
        setDataSource(response.data);
      },
      (err) => console.log(err.message)
    );
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "权限名称",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "权限路径",
      dataIndex: "key",
      render: (key) => {
        return <Tag color="lime">{key}</Tag>;
      },
      key: "key",
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
              <DeleteTwoTone style={{ paddingRight: "10px" }} />
            </Popconfirm>
            {/* edit-pop over part */}
            <Popover
              content={
                <Switch
                  checked={item.pagepermisson}
                  onChange={() => editRight(item)}
                />
              }
              title="页面配置项"
              trigger={item.pagepermisson === undefined ? "" : "click"}
            >
              {/* edit-button */}
              <EditTwoTone
                twoToneColor={
                  item.pagepermisson === undefined ? "#808080" : "#1890FF"
                }
              />
            </Popover>
          </div>
        );
      },
    },
  ];
  //delete right
  const deleteRight = (item) => {
    if (item.grade === 1) {
      //find out which one to delete, return a new array
      let list = dataSource.filter((data) => data.id !== item.id);
      setDataSource(list);
      //send request to delete it in database
      axios.delete(`/rights/${item.id}`);
    } else {
      //means it's chilren, need to find parent of it by rightId,
      //then put parent in a new array
      let parentIten = dataSource.filter((data) => data.id === item.rightId);
      //liter this array to find out which one to delete, fliter it, rest put into
      //a new array, replace old one
      parentIten[0].children = parentIten[0].children.filter(
        (child) => child.id !== item.id
      );
      //filter is shallow copy, so children is an address, has been update,but state is
      //shallow too, so need to separate it to sign a new array to make it update page
      setDataSource([...dataSource]);
      //update database
      axios.delete(`/children/${item.id}`);
    }
  };
  //editRight
  const editRight = (item) => {
    item.pagepermisson = item.pagepermisson === 1 ? 0 : 1;
    setDataSource([...dataSource]);
    const path = item.grade === 1 ? "rights" : "children";
    axios.patch(`/${path}/${item.id}`, {
      pagepermisson: item.pagepermisson,
    });
  };
  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
}
