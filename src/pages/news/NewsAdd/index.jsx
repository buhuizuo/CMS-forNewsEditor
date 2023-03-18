import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import {
  PageHeader,
  Steps,
  Button,
  Form,
  Input,
  Select,
  notification,
} from "antd";
import axios from "axios";
import NewsEditor from "../../../component/NewsEditor";
const { Step } = Steps;
const { Option } = Select;

export default function NewsAdd(props) {
  //which step
  const [current, setCurrent] = useState(0);
  const [categoryList, setCategoryList] = useState([]);
  //form 1 data save
  const [formInfo, setFormInfo] = useState({});
  //form 2 data save
  const [content, setContent] = useState("");
  //get form 1 info
  const formOne = useRef(null);
  //get writer info
  const User = JSON.parse(localStorage.getItem("token"))[0];
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get("/categories")
      .then((res) => {
        setCategoryList(res.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  //steps control
  const previousStep = () => {
    setCurrent(current - 1);
  };
  const nextStep = () => {
    //check if form 1 is fill up
    if (current === 0) {
      formOne.current
        .validateFields()
        .then((res) => {
          console.log(res);
          setCurrent(current + 1);
          setFormInfo(res);
        })
        .catch((err) => console.log(err));
    } else {
      if (content === "" || content.trim() === "<p></p>") {
        alert("content can't be empty!");
      } else {
        setCurrent(current + 1);
      }
    }
  };
  //form 1 select control
  // const handleChange = () => {};
  // form 2 content
  const getContent = (content) => {
    setContent(content);
  };
  //save draft or send to audit
  const handleSave = (auditState) => {
    const newNews = {
      ...formInfo,
      content: content,
      region: User.region ? User.region : "全球",
      author: User.username,
      roleId: User.roleId,
      auditState: auditState,
      publishState: 0,
      createTime: Date.now(),
      star: 0,
      view: 0,
      // publishTime: 1615778496314,
    };
    axios
      .post("/news", newNews)
      .then((res) => {
        navigate(
          auditState === 0
            ? "/sandbox/news-manage/draft"
            : "/sandbox/audit-manage/list"
        );
        notification.info({
          message: `通知`,
          description: `您可以到${
            auditState === 0 ? "草稿箱" : "审核列表"
          }中查看您的新闻`,
          placement: "bottomRight",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="撰写新闻"
        subTitle="This is a subtitle"
      />
      <Steps current={current}>
        <Step title="基本信息" description="新闻标题，新闻分类" />
        <Step title="新闻内容" description="新闻主题内容." />
        <Step title="新闻提交" description="保存草稿或者审核提交" />
      </Steps>
      <div>
        {/* step1 */}
        <div
          className={current === 0 ? "" : "hidden"}
          style={{ marginTop: "30px" }}
        >
          <Form
            ref={formOne}
            name="basic"
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 20,
            }}
            initialValues={{
              remember: true,
            }}
            autoComplete="off"
          >
            <Form.Item
              label="新闻标题"
              name="title"
              rules={[
                {
                  required: true,
                  message: "Please input your title!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="新闻分类"
              name="categoryId"
              rules={[
                {
                  required: true,
                  message: "Please input your category!",
                },
              ]}
            >
              <Select
                style={{
                  width: 120,
                }}
              >
                {categoryList.map((item) => {
                  return (
                    <Option value={item.id} key={item.id}>
                      {item.title}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Form>
        </div>
        {/* step2 */}
        <div className={current === 1 ? "" : "hidden"}>
          <NewsEditor getContent={getContent}></NewsEditor>
        </div>
      </div>
      {/* buttons */}
      <div style={{ marginTop: "50px" }}>
        {current > 0 && (
          <Button
            shape="round"
            style={{ marginRight: "10px" }}
            onClick={previousStep}
          >
            上一步
          </Button>
        )}
        {current < 2 && (
          <Button type="primary" shape="round" onClick={nextStep}>
            下一步
          </Button>
        )}
        {current === 2 && (
          <Button
            shape="round"
            onClick={() => {
              handleSave(0);
            }}
          >
            保存草稿
          </Button>
        )}
        {current === 2 && (
          <Button
            shape="round"
            danger
            onClick={() => {
              handleSave(1);
            }}
          >
            提交审核
          </Button>
        )}
      </div>
    </div>
  );
}
