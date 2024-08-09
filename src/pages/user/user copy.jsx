import React, { useState } from "react";

//引入蚂蚁金服的布局组件
import { Fomr, Input, Button, Table, Modal, message } from "antd";
//引入api 接口查询数据
import { reqRoles, reqAddRole, reqUpdateRole } from "../../api";

function User() {
  //定义表格的选中项
  const [selectedRowKeys, setSelectedRowKeys] = React.useState([]);


  //定义表格的数据
  const [dataSource, setDataSource] = React.useState([]);

  //定义input框的值
  const [inputValue, setInputValue] = React.useState("");

  //  //定义模态框的显示与隐藏
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {

    //输出input框的值
    console.log(inputValue);
    //发送api请求 添加角色
    addRole();
 


    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
      //清空input框的值
  };

  //发送api请求 获取角色列表
  const getRoles = async () => {
    const result = await reqRoles();
    if (result.status === 0) {
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

  // useEffect 检测数据变化 如果添加或更新角色成功 则重新获取角色列表
  React.useEffect(() => {
    getRoles();
  }, [inputValue]);

  console.log("selectedRowKeys", selectedRowKeys)


  return (
    <div>
      {/* 按钮为添加角色  点击后使用antd modal 发送reqAddRole api请求添加角色*/}
    
      <Button type="primary" onClick={showModal}>
      创建角色
      </Button>
      <Modal title="请输入添加角色名字"  open={isModalOpen} onOk={handleOk} onCancel={handleCancel} destroyOnClose ={true}>
        <Input 
        placeholder="请输入角色名字"
        //收集input框的值
        value={inputValue}
        //监听input框的值
        onChange={e => setInputValue(e.target.value)}
       
         />
      </Modal>

      {/* 按钮为设置角色权限 disabled={!role._id} */}
      <Button type="primary" disabled>
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
            // console.log(selectedRows[0]._id)
            console.log(selectedRowKeys)
          
      
       
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

            },
          };
        }}
        rowKey="_id"
        pagination={{ defaultPageSize: 3, showQuickJumper: true }}
      >
        <Table.Column title="角色名字" dataIndex="name" key="name" />
        <Table.Column title="创建时间" dataIndex="create_time" key="age" />
        <Table.Column title="授权时间" dataIndex="auth_tiem" key="address" />
        <Table.Column title="授权人" dataIndex="auth_name" key="address" />
      </Table>

      {/* 模态框 */}
    </div>
  );
}

export default User;
