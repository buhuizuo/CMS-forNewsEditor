import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Table, Tag, Button, notification } from "antd";

export default function AuditList() {
  //get writer info
  const { username } = JSON.parse(localStorage.getItem("token"))[0];
  //data for table
  const [dataSource, setDataSource] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(
        `/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`
      )
      .then(
        (response) => {
          setDataSource(response.data);
          console.log(response.data);
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
      title: "审核状态",
      dataIndex: "auditState",
      render: (auditState) => {
        const colorList = ["", "orange", "lime", "hotpink"];
        const stateDisplay = ["", "审核中", "已通过", "未通过"];
        return (
          <Tag color={colorList[auditState]}>{stateDisplay[auditState]}</Tag>
        );
      },
      key: "auditState",
    },
    {
      title: "操作",
      //render will pass dataIndex value to use
      render: (item) => {
        return (
          <div>
            {" "}
            {item.auditState === 1 && (
              <Button
                type="primary"
                danger
                onClick={() => {
                  handleRevers(item);
                }}
              >
                撤销
              </Button>
            )}
            {item.auditState === 2 && (
              <Button
                type="dashed"
                onClick={() => {
                  handlePublish(item);
                }}
              >
                发布
              </Button>
            )}
            {item.auditState === 3 && (
              <Button
                type="primary"
                onClick={() => {
                  handleUpdate(item);
                }}
              >
                更新
              </Button>
            )}
          </div>
        );
      },
    },
  ];
  const handleRevers = (item) => {
    axios
      .patch(`/news/${item.id}`, { auditState: 0 })
      .then((res) => {
        navigate("/sandbox/news-manage/draft");
        notification.info({
          message: `通知`,
          description: `您可以到草稿箱中查看您的新闻`,
          placement: "bottomRight",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handlePublish = (item) => {
    axios
      .patch(`/news/${item.id}`, { publishState: 1, publishTime: Date.now() })
      .then((res) => {
        navigate("/sandbox/publish-manage/published");
        notification.info({
          message: `通知`,
          description: `您可以到【发布管理/已经发布】中查看您的新闻`,
          placement: "bottomRight",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleUpdate = (item) => {
    navigate(`/sandbox/news-manage/update/${item.id}`);
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
