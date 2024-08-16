import React, { useState } from "react";
import { useHistory } from 'react-router-dom';

//引入蚂蚁金服的布局组件
import {  Input, Button, Table, Modal, message, Tree } from "antd";
//引入api 接口查询数据
import { reqRoles, reqAddRole, reqUpdateRole } from "../../api";

//引入muneConfig
import menuList from "../../menuConfig";

// 引入登录名称
// import memoryUtils from "../../utils/memoryUtils";

//引入时间格式转换
import timestampToYMD from "../../utils/timestampToYMD";
import {connect} from 'react-redux'
import {receiveUser} from '../../redux/actions';
import storageUtils from '../../utils/storageUtils';

function Role(props) {

  const {user, receiveUser} = props

  //获取history
  const history = useHistory();

  //定义表格的选中项
  const [selectedRowKeys, setSelectedRowKeys] = React.useState([]);

  //定义表格的数据
  const [dataSource, setDataSource] = React.useState([]);

  // 定义role的数据

  const [role, setRole] = React.useState({});

  //定义input框的值
  const [inputValue, setInputValue] = React.useState("");

  //  //定义模态框的显示与隐藏
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 定义onCheck的数据
  const [checkedKeys, setCheckedKeys] = useState([]);

  const handleOk = () => {
    //输出input框的值
    console.log(inputValue);
    //发送api请求 添加角色
    addRole();
    //清空input框的值
    setInputValue("");

    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    //清空input框的值
    setInputValue("");
  };

  //发送api请求 获取角色列表
  const getRoles = async () => {
    const result = await reqRoles();
    if (result.status === 0) {
   
      //设置表格数据

      setDataSource(result.data);

      message.success("获取角色列表成功");
    } else {
      message.error("获取角色列表失败");
    }
  };

  // //发送api请求 添加角色
  const addRole = async () => {
    const result = await reqAddRole(inputValue);
    if (result.status === 0) {
      message.success("添加角色成功");
    } else {
      message.error("添加角色失败");
    }
  };

  //发送api请求 更新角色

  const updateRole = async () => {
    const result = await reqUpdateRole(role);
    console.log(
      "(role._id, checkedKeys,username)" + role._id,
      checkedKeys,
      username
    );

    if (result.status === 0) {
      message.success("更新角色成功");
    } else {
      message.error("更新角色失败");
    }
  };

  // useEffect 检测数据变化 如果添加或更新角色成功 则重新获取角色列表
  React.useEffect(() => {
    getRoles();
  }, [inputValue, role._id, checkedKeys]);

  //不需要收集点击行信息
  // const onSelect = (selectedKeys, info) => {
  //   console.log("selectedKeys!!!", selectedKeys, info);
  // };
  const onCheck = (checkedKeys, info) => {
    console.log("onCheck1", checkedKeys, info);
    setCheckedKeys(checkedKeys);
    console.log("onCheck2", checkedKeys, info);

    //赋值munes
    role.menus = checkedKeys;

    console.log("role", role.menus);
    console.log("role", role.name);
  };

  //获取当前用户

  const username = user.username;

  return (
    <div>
      {/* 按钮为添加角色  点击后使用antd modal 发送reqAddRole api请求添加角色*/}

      <Button
        type="primary"
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        创建角色
      </Button>

      <Modal
        title="请输入添加角色名字"
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose={true}
      >
        <Input
          placeholder="请输入角色名字"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </Modal>

      {/* 按钮为设置角色权限 disabled={!role._id} */}
      <Button
        type="primary"
        disabled={!role._id}
        onClick={() => {
          console.log("点击按钮的role", role);
          Modal.confirm({
            title: "角色名字: " + role.name,
            content:
              //显示角色名字
              ((<div>角色名字: {role.name}</div>),
              (
                <Tree
                  treeData={menuList}
                  checkable
                  // 根据role.menus 设置默认选中项
                  defaultCheckedKeys={role.menus}
                  defaultExpandAll={true}
                  // onSelect={onSelect}
                  onCheck={onCheck}
                  // checkedKeys={role.menus}
                />
              )),
            onOk() {
              role.auth_name = username;

              //发送api请求 更新角色
              updateRole(role);
              console.log("role", role);
              
              //清空localStorage 防止更新权限后菜单没有更新.
               storageUtils.removeUser()

              receiveUser({});
               //退出页面 replace login
               history.replace("/login");
             

            },
            onCancel() {
              //清空数据
              setCheckedKeys([]);
            },
          });
        }}
      >
        设置角色权限
      </Button>

      {/* 表单 含有 radio 单选 角色名称 创建时间 授权时间 授权人  */}
      <Table
        //表格数据
        dataSource={dataSource}
        //表格列名
        rowSelection={{
          type: "radio",
          // selectedRowKeys: [selectedRowKeys],
          selectedRowKeys: [selectedRowKeys],
          //监听选中项的变化
          onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRowKeys(selectedRows[0]._id);
             setRole(selectedRows[0])
          },
        }}
        bordered
        //监听行的点击事件
        onRow={(role) => {
          return {
            onClick: () => {
              // 点击行
              console.log(role);
              let str = role._id;
              str = str.toString();

              setSelectedRowKeys(str);

              //跟踪role的数据
              setRole(role);
              console.log("role", role);
            },
          };
        }}
        rowKey="_id"
        pagination={{ defaultPageSize: 3, showQuickJumper: true }}
      >
        <Table.Column title="角色名字" dataIndex="name" key="name" />
        <Table.Column
          title="创建时间"
          render={(role) => role.create_time ? timestampToYMD(role.create_time):""}
          key="create_time"
        />
      
        {/*  table.column  render  中使用 timestampToYMD 处理 auth_time 没有值 显示为字符文"unanthed"*/}

        <Table.Column title="授权时间" render={(role) => role.auth_time ? timestampToYMD(role.auth_time):"unauthed"} key="auth_time" />


    
         
        <Table.Column title="授权人" dataIndex="auth_name" key="auth_name" />
      </Table>

      {/* 模态框 */}
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
