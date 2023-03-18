import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, notification } from "antd";
import { CloseCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";

export default function AuditNews() {
  //get writer info
  const User = JSON.parse(localStorage.getItem("token"))[0];
  //data for table
  const [dataSource, setDataSource] = useState([]);
  //find out only audit state is 1,待审核,
  //then if superadmin, show all, if manager,show he's and he's region editors list
  useEffect(() => {
    axios.get(`/news?auditState=1&_expand=category`).then(
      (response) => {
        const list = response.data;
        setDataSource(
          User.roleId === "1"
            ? list
            : [
                ...list.filter(
                  (news) => news.region === User.region && news.roleId === "3"
                ),
                ...list.filter((news) => news.author === User.username),
              ]
        );
      },
      (err) => console.log(err.message)
    );
  }, []);

  const columns = [
    {
      title: "新闻标题",
      dataIndex: "title",
      key: "title",
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
        return (
          <div>
            <Button
              type="primary"
              shape="circle"
              icon={<CloseCircleOutlined />}
              style={{ marginRight: "10px" }}
              onClick={() => auditNews(item, 3, 0)}
            ></Button>

            <Button
              type="primary"
              shape="circle"
              danger
              icon={<CheckCircleOutlined />}
              onClick={() => auditNews(item, 2, 1)}
            ></Button>
          </div>
        );
      },
    },
  ];
  const auditNews = (item, auditState, publishState) => {
    console.log(item);
    setDataSource(
      dataSource.filter((news) => {
        return news.id !== item.id;
      })
    );
    axios
      .patch(`/news/${item.id}`, { auditState, publishState })
      .then((res) => {
        notification.info({
          message: `通知`,
          description: `您可以到[审核管理/审核列表]中查看您的新闻的审核状态`,
          placement: "bottomRight",
        });
      });
  };
  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 5 }}
        rowKey={(item) => item.id}
      />
    </div>
  );
}
