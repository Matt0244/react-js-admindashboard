import React, { useState, useEffect } from "react";
import { Space, Table, Button, Modal, message, Form } from "antd";
import { reqUsers, reqDeleteUser, reqRoles } from "../../api";
import timestampToYMD from "../../utils/timestampToYMD";
import UserForm from "./userForm";

function User() {
  const [users, setUsers] = useState([]); // 用户数据状态
  const [isModalOpen, setIsModalOpen] = useState(false); // 控制模态框显示状态
  const [_id, set_id] = useState(null); // 存储正在编辑的用户ID
  const [roles, setRoles] = useState([]); // 角色数据状态
  const [form] = Form.useForm(); // 表单实例

  // 获取用户数据
  const getUsers = async () => {
    const result = await reqUsers();
    if (result.status === 0) {
      console.log(result.data);
      const usersWithFormattedTime = result.data.users.map((item) => ({
        ...item,
        create_time: timestampToYMD(item.create_time), // 格式化创建时间
      }));

      setUsers(usersWithFormattedTime); // 更新用户数据状态
    }
  };

  // 获取角色数据
  const getRoles = async () => {
    const result = await reqRoles();
    if (result.status === 0) {
      setRoles(result.data); // 更新角色数据状态
      console.log(result.data);
    } else {
      console.log("fail");
    }
  };

  // 用_id找到对应的role._id，再找到对应的role.name
  const getRoleName = (roleId) => {
    const role = roles.find((role) => roleId === role._id);
    return role ? role.name : "";
  };

  // 如果users或roles发生变化，就重新获取数据
  useEffect(() => {
    getRoles();
    getUsers()
  }, []);

  // 删除用户按钮点击事件
  const deleteBTN = (_id) => {
    Modal.confirm({
      title: `你要删除这个用户吗?`,
      onOk: async () => {
        const result = await reqDeleteUser(_id);
        if (result.status === 0) {
          message.success("用户删除成功");
          getUsers(); // 重新获取用户数据
        } else {
          message.error("用户删除失败");
        }
      },
    });
  };

  // 编辑用户按钮点击事件
  const editBTN = (_id) => {
    set_id(_id);
    setIsModalOpen(true); // 打开模态框
    console.log("Edit user with ID:", _id);
  };

  // 添加用户按钮点击事件
  const addUser = () => {
    set_id(null); // 清空 _id
    setIsModalOpen(true); // 打开模态框
  };

  // 模态框确认按钮点击事件
  const handleOk = () => {
    setIsModalOpen(false); // 关闭模态框
  };

  // 模态框取消按钮点击事件
  const handleCancel = () => {
    setIsModalOpen(false); // 关闭模态框
  };

  // 表格列定义
  const columns = [
    {
      title: "用户名",
      dataIndex: "username",
      key: "username",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "邮箱",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "注册时间",
      dataIndex: "create_time",
      key: "create_time",
    },
    {
      title: "所属角色",
      dataIndex: "role_id",
      key: "role_id",
      render: (roleId) => getRoleName(roleId), // 显示对应的角色名称
    },
    {
      title: "操作",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <a onClick={() => editBTN(record._id)}>修改</a>
          <a onClick={() => deleteBTN(record._id)}>删除</a>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* 创建用户按钮靠左 */}
      <Button
        type="primary"
        style={{ float: "left", margin: "10px 20px 10px 20px" }}
        onClick={addUser}
      >
        创建用户
      </Button>
      <Table columns={columns} dataSource={users} rowKey="_id" />
      <Modal
        // 如果_id存在，title是修改用户，否则是添加用户
        title={_id ? `修改用户:${_id}` : "添加用户"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <UserForm
          form={form}
          colesModal={handleCancel}
          _id={_id}
          roles={roles}
          getUsers={getUsers}
        />
      </Modal>
    </div>
  );
}

export default User;