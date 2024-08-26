import React from "react";
import memoryUtils from "../../utils/memoryUtils";
import { Redirect, Route, Switch,useHistory } from "react-router-dom";
import { Layout, Space } from "antd";
import LeftNav from "../../components/left-nav/my-leftNav";
import MyFooter from "../../components/footer/my-footer";
import MyHeader from "../../components/header/my-header.jsx";
import Home from "../home/home";
import Bar from "../bar/bar";
import Category from "../category/category";
import Product from "../product/product";
import Role from "../role/role";
import User from "../user/user";
import Line from "../line/line";
import Pie from "../pie/pie";
import MyTest from "../test/my-test";

export default function Admin() {
  const user = memoryUtils.user;
  //如果没user或者user没有_id，就重定向到登录页面
  if (!user || !user._id) {
    //自动跳转到指定的路由路径
    return <Redirect to="/login" />;
  }
  const { Header, Footer, Sider, Content } = Layout;
  
  const headerStyle = {
   //textAlign: "center",
   padding: 0,
    color: "#fff",
    height: 80,
    //paddingInline: 50,
    lineHeight: "80px",
    backgroundColor: "#7dbcea",
  };
  const contentStyle = {
    textAlign: "center",
    minHeight: 120,
    lineHeight: "120px",
    color: "#fff",
    backgroundColor: "#108ee9",
    overflow: "auto",
  };
  const siderStyle = {
    textAlign: "center",
    lineHeight: "120px",
    color: "#fff",
    backgroundColor: '#3ba0e9',
  };
  const footerStyle = {
    textAlign: "center",
    color: "#fff",
    backgroundColor: "#7dbcea",
  };

  return (
    <Space
      direction="vertical"
      style={{
        width: "100%",
      }}
      size={[0, 48]}
    >
      <Layout style={{ height: "100vh" }}>
        <Sider style={siderStyle}>
          <LeftNav />
        </Sider>
        <Layout>
          <Header style={headerStyle}>
            <MyHeader />
          </Header>
          {/* <Content style={contentStyle} > */}
          <Content  >
            <Switch>
              <Route path="/home" component={Home} />
              <Route path="/category" component={Category} />
              <Route path="/product" component={Product} />
              <Route path="/role" component={Role} />
              <Route path="/user" component={User} />
              <Route path="/charts/bar" component={Bar} />
              <Route path="/charts/line" component={Line} />
              <Route path="/charts/pie" component={Pie} />
              <Route path="/mytest" component={MyTest} />
              <Redirect to="/home" />
            </Switch>
          </Content>
          <Footer style={footerStyle}>
            <MyFooter />
          </Footer>
        </Layout>
      </Layout>
    </Space>
  );
}
