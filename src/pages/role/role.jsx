import React, { useState } from "react";
import { useHistory } from 'react-router-dom';

// Import Ant Design layout components
import { Input, Button, Table, Modal, message, Tree } from "antd";
// Import API to query data
import { reqRoles, reqAddRole, reqUpdateRole } from "../../api";

// Import menuConfig
import menuList from "../../menuConfig";

// Import login name
// import memoryUtils from "../../utils/memoryUtils";

// Import timestamp to date conversion utility
import timestampToYMD from "../../utils/timestampToYMD";
import {connect} from 'react-redux';
import {receiveUser} from '../../redux/actions';
import storageUtils from '../../utils/storageUtils';

function Role(props) {

  const {user, receiveUser} = props;

  // Get history
  const history = useHistory();

  // Define selected items in the table
  const [selectedRowKeys, setSelectedRowKeys] = React.useState([]);

  // Define data for the table
  const [dataSource, setDataSource] = React.useState([]);

  // Define role data
  const [role, setRole] = React.useState({});

  // Define value for the input field
  const [inputValue, setInputValue] = React.useState("");

  // Define the visibility of the modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Define checked keys in the tree
  const [checkedKeys, setCheckedKeys] = useState([]);

  const handleOk = () => {
    // Log the value from the input field
    console.log(inputValue);
    // Send API request to add a role
    addRole();
    // Clear the input field
    setInputValue("");

    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    // Clear the input field
    setInputValue("");
  };

  // Send API request to get the role list
  const getRoles = async () => {
    const result = await reqRoles();
    if (result.status === 0) {
      // Set table data
      setDataSource(result.data);

      // message.success("Successfully fetched role list");
    } else {
      message.error("Failed to fetch role list");
    }
  };

  // Send API request to add a role
  const addRole = async () => {
    const result = await reqAddRole(inputValue);
    if (result.status === 0) {
      message.success("Role added successfully");
    } else {
      message.error("Failed to add role");
    }
  };

  // Send API request to update a role
  const updateRole = async () => {
    const result = await reqUpdateRole(role);
    console.log(
      "(role._id, checkedKeys, username)" + role._id,
      checkedKeys,
      username
    );

    if (result.status === 0) {
      message.success("Role updated successfully");
    } else {
      message.error("Failed to update role");
    }
  };

  // useEffect to monitor data changes, re-fetch role list if role is added or updated successfully
  React.useEffect(() => {
    getRoles();
  }, [inputValue, role._id, checkedKeys]);

  // No need to collect information from clicked rows
  // const onSelect = (selectedKeys, info) => {
  //   console.log("selectedKeys!!!", selectedKeys, info);
  // };
  const onCheck = (checkedKeys, info) => {
    console.log("onCheck1", checkedKeys, info);
    setCheckedKeys(checkedKeys);
    console.log("onCheck2", checkedKeys, info);

    // Assign menus
    role.menus = checkedKeys;

    console.log("role", role.menus);
    console.log("role", role.name);
  };

  // Get the current user
  const username = user.username;

  return (
    <div>
      {/* Button to add a role, triggers Ant Design modal and sends reqAddRole API request to add a role */}
      <Button
        type="primary"
        style={{ margin: '10px' }}
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        Create Role
      </Button>

      <Modal
        title="Please enter the name of the role to add"
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose={true}
      >
        <Input
          placeholder="Enter role name"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </Modal>

      {/* Button to set role permissions, disabled={!role._id} */}
      <Button
        type="primary"
        disabled={!role._id}
        onClick={() => {
          console.log("Role when button clicked", role);
          Modal.confirm({
            title: "Role Name: " + role.name,
            content:
              // Display role name
              ((<div>Role Name: {role.name}</div>),
              (
                <Tree
                  treeData={menuList}
                  checkable
                  // Set default checked keys based on role.menus
                  defaultCheckedKeys={role.menus}
                  defaultExpandAll={true}
                  // onSelect={onSelect}
                  onCheck={onCheck}
                  // checkedKeys={role.menus}
                />
              )),
            onOk() {
              role.auth_name = username;

              // Send API request to update role
              updateRole(role);
              console.log("role", role);
              
              // Clear localStorage to prevent the menu from not updating after permission changes
              storageUtils.removeUser();

              receiveUser({});
              // Exit the page, replace with login
              history.replace("/login");
            },
            onCancel() {
              // Clear data
              setCheckedKeys([]);
            },
          });
        }}
      >
        Set Role Permissions
      </Button>

      {/* Table containing radio buttons, role name, creation time, authorization time, authorizer */}
      <Table
        // Table data
        dataSource={dataSource}
        // Table columns
        rowSelection={{
          type: "radio",
          selectedRowKeys: [selectedRowKeys],
          // Monitor changes in the selected items
          onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRowKeys(selectedRows[0]._id);
             setRole(selectedRows[0]);
          },
        }}
        bordered
        // Monitor row click events
        onRow={(role) => {
          return {
            onClick: () => {
              // Row clicked
              console.log(role);
              let str = role._id;
              str = str.toString();

              setSelectedRowKeys(str);

              // Track role data
              setRole(role);
              console.log("role", role);
            },
          };
        }}
        rowKey="_id"
        pagination={{ defaultPageSize: 3, showQuickJumper: true }}
      >
        <Table.Column title="Role Name" dataIndex="name" key="name" />
        <Table.Column
          title="Creation Time"
          render={(role) => role.create_time ? timestampToYMD(role.create_time) : ""}
          key="create_time"
        />
      
        {/* In table.column, render using timestampToYMD to handle auth_time. If no value, display as "unauthed" */}
        <Table.Column title="Authorization Time" render={(role) => role.auth_time ? timestampToYMD(role.auth_time) : "unauthed"} key="auth_time" />

        <Table.Column title="Authorizer" dataIndex="auth_name" key="auth_name" />
      </Table>

      {/* Modal */}
    </div>
  );
}

export default connect(
  (
    state => ({user:state.user})
  ),{
    receiveUser
  }
)(Role)
