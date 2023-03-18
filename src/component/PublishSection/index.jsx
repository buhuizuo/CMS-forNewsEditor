import React from "react";
import { Table, Button } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";

export default function PublishSection(props) {
  const columns = [
    {
      title: "新闻标题",
      dataIndex: "title",
      key: "title",
      render: (title, item) => {
        return <a href={`#/sandbox/news-manage/preview/${item.id}`}>{title}</a>;
      },
    },
    {
      title: "作者",
      dataIndex: "author",
      key: "author",
    },
    {
      title: "新闻分类",
      dataIndex: "category",
      render: (category) => {
        return <div>{category.title}</div>;
      },
      key: "category",
    },
    {
      title: "操作",
      //render will pass dataIndex value to use
      render: (item) => {
        return <div>{props.button(item.id)}</div>;
      },
    },
  ];

  return (
    <div>
      <Table
        dataSource={props.dataSource}
        columns={columns}
        pagination={{ pageSize: 5 }}
        rowKey={(item) => item.id}
      />
    </div>
  );
}
