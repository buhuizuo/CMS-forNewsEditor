import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Popconfirm, notification } from "antd";
import { DeleteTwoTone, EditTwoTone, UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export default function NewsDraft() {
  const [drafts, setDrafts] = useState([]);
  const { username } = JSON.parse(localStorage.getItem("token"))[0];
  const navigate = useNavigate();

  //get all draft
  useEffect(() => {
    axios.get(`/news?author=${username}&auditState=0&_expand=category`).then(
      (response) => {
        setDrafts(response.data);
      },
      (err) => console.log(err.message)
    );
  }, [username]);

  const toAudit = (item) => {
    console.log(item, drafts);
    axios.patch(`/news/${item.id}`, { auditState: 1 });
    navigate("/sandbox/audit-manage/list");
    notification.info({
      message: `通知`,
      description: `您可以到审核列表中查看您的新闻`,
      placement: "bottomRight",
    });
  };
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
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
      title: "分类",
      dataIndex: "category",
      render: (category) => {
        return category.value;
      },
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
            <EditTwoTone
              style={{ paddingRight: "10px" }}
              onClick={() => {
                navigate(`/sandbox/news-manage/update/${item.id}`);
              }}
            />
            {/* send to audit */}
            <UploadOutlined onClick={() => toAudit(item)} />
          </div>
        );
      },
    },
  ];
  //delete right
  const deleteRight = (item) => {
    let list = drafts.filter((data) => data.id !== item.id);
    setDrafts(list);
    axios.delete(`/news/${item.id}`);
  };

  return (
    <div>
      <Table
        dataSource={drafts}
        columns={columns}
        pagination={{ pageSize: 5 }}
        rowKey={(item) => item.id}
      />
    </div>
  );
}
