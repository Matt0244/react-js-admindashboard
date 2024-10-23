import React, { useState, useEffect } from "react";
import { Space, Table, Button, Modal, message, Form } from "antd";
import { reqUsers, reqDeleteUser, reqRoles } from "../../api";
import timestampToYMD from "../../utils/timestampToYMD";
import UserForm from "./userForm";

function User() {
  const [users, setUsers] = useState([]); // User data state
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls the modal's visibility state
  const [_id, set_id] = useState(null); // Stores the currently edited user's ID
  const [roles, setRoles] = useState([]); // Role data state
  const [form] = Form.useForm(); // Form instance

  // Fetch user data
  const getUsers = async () => {
    const result = await reqUsers();
    if (result.status === 0) {
      console.log(result.data);
      const usersWithFormattedTime = result.data.users.map((item) => ({
        ...item,
        create_time: timestampToYMD(item.create_time), // Format the creation time
      }));

      setUsers(usersWithFormattedTime); // Update user data state
    }
  };

  // Fetch role data
  const getRoles = async () => {
    const result = await reqRoles();
    if (result.status === 0) {
      setRoles(result.data); // Update role data state
      console.log(result.data);
    } else {
      console.log("fail");
    }
  };

  // Find the corresponding role._id by _id, then find the corresponding role.name
  const getRoleName = (roleId) => {
    const role = roles.find((role) => roleId === role._id);
    return role ? role.name : "";
  };

  // If users or roles change, refetch the data
  useEffect(() => {
    getRoles();
    getUsers();
  }, []);

  // Delete user button click event
  const deleteBTN = (_id) => {
    Modal.confirm({
      title: `Do you want to delete this user?`,
      onOk: async () => {
        const result = await reqDeleteUser(_id);
        if (result.status === 0) {
          message.success("User deleted successfully");
          getUsers(); // Refetch user data
        } else {
          message.error("Failed to delete user");
        }
      },
    });
  };

  // Edit user button click event
  const editBTN = (_id) => {
    set_id(_id);
    setIsModalOpen(true); // Open modal
    console.log("Edit user with ID:", _id);
  };

  // Add user button click event
  const addUser = () => {
    set_id(null); // Clear _id
    setIsModalOpen(true); // Open modal
  };

  // Modal OK button click event
  const handleOk = () => {
    setIsModalOpen(false); // Close modal
  };

  // Modal cancel button click event
  const handleCancel = () => {
    setIsModalOpen(false); // Close modal
  };

  // Table column definitions
  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Registration Time",
      dataIndex: "create_time",
      key: "create_time",
    },
    {
      title: "Role",
      dataIndex: "role_id",
      key: "role_id",
      render: (roleId) => getRoleName(roleId), // Display the corresponding role name
    },
    {
      title: "Actions",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <a onClick={() => editBTN(record._id)}>Edit</a>
          <a onClick={() => deleteBTN(record._id)}>Delete</a>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Create user button aligned to the left */}
      <Button
        type="primary"
        style={{ float: "left", margin: "10px 20px 10px 20px" }}
        onClick={addUser}
      >
        Create User
      </Button>
      <Table columns={columns} dataSource={users} rowKey="_id" />
      <Modal
        // If _id exists, the title is "Edit User", otherwise it's "Add User"
        title={_id ? `Edit User: ${_id}` : "Add User"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <UserForm
          form={form}
          closeModal={handleCancel}
          _id={_id}
          roles={roles}
          getUsers={getUsers}
        />
      </Modal>
    </div>
  );
}

export default User;
