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

      props.closeModal(); // Close modal
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
    props.closeModal();
    getUsers();
  };

  return (
    <Form
      form={form}
      // Set initial values with _id
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
        label="Username"
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
        <Form.Item label="User ID" name="_id">
          <Input placeholder={_id} disabled />
        </Form.Item>
      )}

     {!_id&& <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: "Please input your password!",
          },
        ]}
      >
        <Input.Password />
      </Form.Item>}

      <Form.Item
        label="Phone Number"
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
        label="Email"
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
        label="Role ID"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select
          placeholder="Select an option and change the input text above"
          allowClear
        >
          {/* Option values from role.id, display role name from role.name using map */}
          {roles.map((role) => (
            <Option key={role._id} value={role._id}>
              {role.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Button type="primary" htmlType="submit">
        Submit
      </Button>
      <Button onClick={() => handleCancel()}>Cancel</Button>
    </Form>
  );
}
