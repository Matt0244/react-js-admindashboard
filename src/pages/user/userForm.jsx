import React from "react";
import { Button, Form, Input, Select } from "antd";
import { reqAddOrUpdateUser } from "../../api/index";

export default function UserForm(props) {
  const [form] = Form.useForm();

  const { Option } = Select;

  const roles = props.roles;
  const _id = props._id;
  const getUsers = props.getUsers;

  const onFinish = async (values) => {
    const result = await reqAddOrUpdateUser(values);
    if (result.status === 0) {
      console.log(values);

      console.log("success");
    
      props.colesModal(); // 关闭 modal
      getUsers();
    } else {
      console.log("fail");
      getUsers();

    }

    form.resetFields();
    console.log(values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    form.resetFields();
    getUsers();
  };

  const handleCancel = () => {
    form.resetFields();
    props.colesModal();
    getUsers();
  };

  return (
    <Form
      form={form}
      // 
      initialValues={{ _id }} 
      name="basic"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      style={{
        maxWidth: 600,
      }}
    
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="用户名"
        name="username"
        rules={[
          {
            required: true,
            message: "Please input your username!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      {_id && (
        <Form.Item
          label="用户ID"
          name="_id"
         
        >
          <Input placeholder={_id} disabled />
        </Form.Item>
      )}

      <Form.Item
        label="密码"
        name="password"
        rules={[
          {
            required: true,
            message: "Please input your password!",
          },
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        label="手机号"
        name="phone"
        rules={[
          {
            required: true,
            message: "Please input your phone!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="邮箱"
        name="email"
        rules={[
          {
            required: true,
            message: "Please input your email!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="role_id"
        label="角色ID"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select
          placeholder="Select a option and change input text above"
          allowClear
        >
          {/* Option values from role.id   display role name from role.name  use ...map  */}
          {roles.map((role) => (
            <Option key={role._id} value={role._id}>
              {role.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Button type="primary" htmlType="submit">
        提交
      </Button>
      <Button onClick={() => handleCancel()}>取消</Button>
    </Form>
  );
}
