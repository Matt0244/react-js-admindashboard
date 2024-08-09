import React from 'react'
//import axios from 'axios'
import { Button, Form, Input, ConfigProvider ,message} from 'antd';
import './login.less';
import logo from './images/logo.png'
//import {reqLogin}from '../../api'
import { useHistory } from 'react-router-dom'; // 导入 useNavigate







export default function Login() {
  const history = useHistory();

const onFinish = async (values) => {
    // axios.post('/login', values)
    //   .then(response => {
    //     if(response.data.status ===0 ){
    //       //history.replace('/');
    //       console.log(response.status)
    //     }
    //     else {
          
    //       message.error(response.data.msg)
    //     }
     
    //   })
    //   .catch(error => {
    //     message.error('发送失败');
    //   });
  };


  const onFinishFailed = (errorInfo) => {
   // console.log('Failed:', errorInfo);
  };
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#00b96b',
        },
      }}
    >
      <div className='login'>




        <header className='login-header'>
          <img src={logo} alt="logo" />
          <h1>React后台项目:后台管理系统</h1>
        </header>

        <section className='login-content'>
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
                  message: 'Please input your username!',
                },
                {
                  min: 4,
                  message: 'Minimal 4 length',
                },
                {
                  max: 12,
                  message: 'Maxment 12 length',
                },
                {
                  pattern: /^[a-zA-Z0-9_]*$/,
                  message: '密码必须是英文、数组或下划线组成',
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
                  message: 'Please input your password!',

                },
                {
                  min: 4,
                  message: 'Minimal 4 length',
                },
                {
                  max: 12,
                  message: 'Maxment 12 length',
                },
                {
                  pattern: /^[a-zA-Z0-9_]*$/,
                  message: '密码必须是英文、数组或下划线组成',
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
              <Button type="primary" htmlType="submit"    >
                登录
              </Button>
            </Form.Item>
          </Form>
        </section>
      </div>
    </ConfigProvider>
  )
}
