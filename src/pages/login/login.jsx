import React from "react";
import axios from "axios";
import {
  Button,
  Form,
  Input,
  ConfigProvider,
  message,
  notification,
} from "antd";
import './login.css'; // 确保路径正确
//import {reqLogin}from '../../api'
import { useHistory } from "react-router-dom";
// import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import logo from "../../assets/images/logo.png";
import { connect } from "react-redux";
import { receiveUser } from "../../redux/actions";

function Login(props) {
  const history = useHistory();
  // if user is login, redirect to admin
  const user = props.user;
  // console.log(user._id);
  // console.log("我是id"+user._id)
  // const user = memoryUtils.user;
  if (user && user._id) {
    // if (user) {
    history.replace("/");
  }

  const onFinish = async (values) => {
    try {
      const response = await axios.post("/login", values);
      if (response.data.status === 0) {
        message.success("登录成功");
        const user = response.data.data;
        props.receiveUser(user);
        storageUtils.saveUser(user);
        history.replace("/");
      } else {
        message.error(response.data.msg);
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: "发送失败",
      });
    }
  };

  const onFinishFailed = (errorInfo) => {
    let errorFields = errorInfo.errorFields.map((field) => field.errors);
    message.error(...errorFields);
    console.log(errorInfo);
  };
  return (
    <div className="login">
      <header className="login-header">
        <img src={logo} alt="logo" />
        <h1>React后台项目:后台管理系统</h1>
      </header>

      <section className="login-content">
        <h2>用户登录</h2>
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          initialValues={{
            remember: true,
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
              {
                min: 4,
                message: "Minimal 4 length",
              },
              {
                max: 12,
                message: "Maxment 12 length",
              },
              {
                pattern: /^[a-zA-Z0-9_]*$/,
                message: "密码必须是英文、数组或下划线组成",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
              {
                min: 4,
                message: "Minimal 4 length",
              },
              {
                max: 12,
                message: "Maxment 12 length",
              },
              {
                pattern: /^[a-zA-Z0-9_]*$/,
                message: "密码必须是英文、数组或下划线组成",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              登录
            </Button>
          </Form.Item>
        </Form>
      </section>
    </div>
  );
}

export default connect((state) => ({ user: state.user }), { receiveUser })(
  Login
);
