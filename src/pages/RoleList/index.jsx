import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Popconfirm, Modal, Tree } from "antd";
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";

export default function RoleList() {
  //table data source,from rols
  const [roleList, setroleList] = useState([]);
  //control edit button to pop out tree table
  const [isModalOpen, setIsModalOpen] = useState(false);
  //the whole right list
  const [rightList, setrightList] = useState([]);
  //edit right list
  const [currentList, setCurrentList] = useState([]);
  //edit role
  const [currentId, setCurrentId] = useState(0);
  useEffect(() => {
    axios.get("/roles").then(
      (response) => {
        setroleList(response.data);
      },
      (err) => console.log(err.message)
    );
    //get all right list ,show in tree
    axios.get("/rights?_embed=children").then((response) => {
      setrightList(response.data);
    });
  }, []);
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "角色名称",
      dataIndex: "roleName",
      key: "roleName",
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
              onConfirm={() => deleteRoles(item)}
            >
              <DeleteTwoTone style={{ paddingRight: "10px" }} />
            </Popconfirm>
            {/* edit-button */}
            <EditTwoTone onClick={() => showModal(item)} />
            <Modal
              title="Basic Modal"
              visible={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
            >
              <Tree
                checkable
                checkStrictly={true}
                onCheck={onCheck}
                treeData={rightList}
                checkedKeys={currentList}
              />
            </Modal>
          </div>
        );
      },
    },
  ];
  const deleteRoles = (item) => {
    setroleList(roleList.filter((role) => role.id !== item.id));
    axios.delete(`/roles/${item.id}`);
  };
  //when click checkbox in tree,return a updated list of right
  const onCheck = (checkedKeys) => {
    setCurrentList(checkedKeys.checked);
  };

  const showModal = (item) => {
    console.log(item);
    //set modal open
    setIsModalOpen(true);
    //set which role you click for handle ok to use
    setCurrentId(item.id);
    //get right list from the role you click
    roleList.map((role) => {
      if (role.id === item.id) {
        setCurrentList(role.rights);
      }
      return null;
    });
  };

  const handleOk = () => {
    setIsModalOpen(false);
    // update roleList from role
    roleList.map((role) => {
      if (role.id === currentId) {
        role.rights = currentList;
      }
      return null;
    });
    setroleList([...roleList]);
    //update database
    axios.patch(`/roles/${currentId}`, {
      rights: currentList,
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <div>
      <div>
        <Table
          dataSource={roleList}
          columns={columns}
          rowKey={(item) => {
            return item.id;
          }}
        />
      </div>
    </div>
  );
}
