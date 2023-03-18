import React, { useState, useEffect } from "react";
import AddUserForm from "../../component/AddUserForm";
import { Table, Switch, Popconfirm, Button, Modal } from "antd";
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import axios from "axios";

export default function UserList() {
  //login user info,to filter which other user it can edit or see
  const { roleId, region } = JSON.parse(localStorage.getItem("token"))[0];
  const [userList, setUserList] = useState([]);
  //get user list to activate table
  useEffect(() => {
    axios.get("/users?_expand=role").then((response) => {
      const list = response.data;
      roleId === "1"
        ? setUserList(list)
        : setUserList(
            list.filter((user) => {
              return user.region === region;
            })
          );
    });
  }, [roleId, region]);
  useEffect(() => {
    axios.get("/roles").then((response) => {
      setRoleList(response.data);
    });
  }, []);
  useEffect(() => {
    axios.get("/regions").then((response) => {
      setregionList(response.data);
    });
  }, []);
  //control modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  //role list for add new user
  const [roleList, setRoleList] = useState([]);
  //region list for add new user
  const [regionList, setregionList] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState({});
  const [updateDisable, setUpdateDisable] = useState(false);
  //record which people been click
  const [currentUser, setCurrentUser] = useState(null);
  const formRef = React.createRef();
  const updateFormRef = React.createRef();
  const columns = [
    {
      title: "区域",
      dataIndex: "region",
      filters: [
        ...regionList.map((item) => {
          return { text: item.title, value: item.value };
        }),
        {
          text: "全球",
          value: "全球",
        },
      ],

      render: (region) => {
        return <b>{region === "" ? "全球" : region}</b>;
      },
      onFilter: (value, record) => {
        if (value === "全球") {
          return record.region === "";
        }
        return record.region === value;
      },
    },
    {
      title: "角色名称",
      dataIndex: "role",
      render: (role) => {
        return role.roleName;
      },
    },
    {
      title: "用户名",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "用户状态",
      dataIndex: "roleState",
      render: (roleState, item) => {
        return (
          <Switch
            checked={roleState}
            disabled={item.default}
            onChange={() => editUserState(item)}
          />
        );
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
              onConfirm={() => deleteUser(item)}
              disabled={item.default}
            >
              <DeleteTwoTone
                style={{ paddingRight: "10px" }}
                twoToneColor={item.default === true ? "#808080" : "#1890FF"}
              />
            </Popconfirm>

            {/* edit-button */}
            <EditTwoTone
              onClick={() => openEdit(item)}
              twoToneColor={item.default === true ? "#808080" : "#1890FF"}
            />
          </div>
        );
      },
    },
  ];
  //edit part
  const openEdit = (item) => {
    setIsEditModalOpen(true);
    setEditItem({ ...item });
    if (item.role.id === 1) {
      setUpdateDisable(true);
    } else {
      setUpdateDisable(false);
    }
    setCurrentUser(item);
    console.log(item);
  };
  //update userInfo on page and database
  const handleEditOk = () => {
    setIsEditModalOpen(false);
    updateFormRef.current.validateFields().then((value) => {
      const newList = userList.map((user) => {
        if (user.id === currentUser.id) {
          return {
            ...user,
            ...value,
            role: roleList.filter((role) => {
              return parseInt(value.roleId) === role.id;
            })[0],
          };
        }
        return user;
      });
      setUserList(newList);
      axios.patch(`/users/${currentUser.id}`, value);
    });
  };
  //delete part
  const deleteUser = (item) => {
    const list = userList.filter((user) => {
      return user.id !== item.id;
    });
    setUserList(list);
    axios.delete(`/users/${item.id}`);
  };
  //state on/off
  const editUserState = (item) => {
    item.roleState = !item.roleState;
    setUserList([...userList]);
    axios.patch(`/users/${item.id}`, {
      roleState: item.roleState,
    });
  };
  //add user part, control modal
  const showModal = () => {
    setIsModalOpen(true);
  };
  //add a user
  const handleOk = () => {
    formRef.current
      .validateFields()
      .then((res) => {
        setIsModalOpen(false);
        //send new user to database to get an auto increase id,then add res.data(new user) to
        //userList to show, without id, cannot delete or edit(depends on id)
        axios
          .post("/users", {
            ...res,
            roleState: true,
            default: res.roleId === "1" ? true : false,
          })
          .then((response) => {
            //this for page update
            axios.get("/users?_expand=role").then((response) => {
              setUserList(response.data);
            });
          });
        formRef.current.resetFields();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    // updateFormRef.current.resetFields();
  };
  return (
    <div>
      <Button type="primary" shape="round" onClick={showModal}>
        添加用户
      </Button>

      <Table
        dataSource={userList}
        columns={columns}
        rowKey={(item) => {
          return item.id;
        }}
        pagination={{ pageSize: 5 }}
      />
      <Modal
        title="添加用户"
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <AddUserForm
          roleList={roleList}
          regionList={regionList}
          ref={formRef}
        />
      </Modal>
      <Modal
        title="修改用户"
        visible={isEditModalOpen}
        onOk={handleEditOk}
        onCancel={handleCancel}
      >
        <AddUserForm
          roleList={roleList}
          regionList={regionList}
          ref={updateFormRef}
          editItem={editItem}
          updateDisable={updateDisable}
        />
      </Modal>
    </div>
  );
}
