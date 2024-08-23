import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AppstoreOutlined,
  HomeFilled,
  SettingOutlined,
  ToolFilled,
  SignalFilled,
} from "@ant-design/icons";
import { Menu } from "antd";
// import "./index.less";
import './index.css';

import logo from "../../assets/images/logo.png";

// 定义一个函数，用于创建菜单项
function getItem(label, key, icon, items, path, subMenu) {
  return {
    key, // 菜单项的 key
    icon, // 菜单项的图标
    items, // 子菜单项
    label, // 菜单项的文本
    path, // 菜单项的路径
    subMenu, // 菜单项所属的子菜单的 key
  };
}

// 定义菜单项
export const items = [
  // 首页
  getItem("首页", "/home", <HomeFilled />, null, "/home"),
  // 商品
  getItem("商品", "/sub1", <AppstoreOutlined />, [
    getItem("品类管理", "/category", null, null, "/category", "/sub1"),
    getItem("商品分类", "/product", null, null, "/product", "/sub1"),
  ]),
  // 用户管理
  getItem("用户管理", "/user", <ToolFilled />, null, "/user"),
  // 角色管理
  getItem("角色管理", "/role", <SettingOutlined />, null, "/role"),
  // 图形图表
  getItem("图形图表", "/sub2", <SignalFilled />, [
    getItem("柱形图", "/bar", null, null, "/charts/bar", "/sub2"),
    getItem("折线图", "/line", null, null, "/charts/line", "/sub2"),
    getItem("饼图", "/pie", null, null, "/charts/pie", "/sub2"),
  ]),
];

// 定义根子菜单的 key
const rootSubmenuKeys = ["/sub1", "/sub2"];

export default function LeftNav() {
  const location = useLocation();
  const user_key = JSON.parse(localStorage.getItem("user_key"));
  const userMenus = user_key.role.menus;
  const userName = user_key.username;
  // const userName = "admin"
  
  console.log("userName"+userName);  
  console.log(user_key);



  // 过滤 items 数组，仅保留路径在 menus 中的项 如果是admin用户，就显示所有菜单
  
  const filteredItems = userName === "admin" ? items : items
  .filter((item) => {
    const isItemIncluded = userMenus.includes(item.path);
    const hasFilteredSubItems = item.items && item.items.some((subItem) => userMenus.includes(subItem.path));
    return isItemIncluded || hasFilteredSubItems;
  })
  .map((item) => {
    if (item.items) {
      const filteredSubItems = item.items.filter((subItem) => userMenus.includes(subItem.path));
      return { ...item, items: filteredSubItems };
    }
    return item;
  });

console.log(filteredItems);

  //path 必须为let 否则报错. if 语句就会报错.
  let path = location.pathname;


  //修正product/detail路径
  if (path.indexOf("/product/detail") === 0) {
    path = "/product";
  }

 


  // 定义 openKeys 状态和更新函数
  const [openKeys, setOpenKeys] = useState([]);

  // 当 path 发生变化时，更新 openKeys 状态
  useEffect(() => {
    // 遍历 items，找到当前路径对应的子菜单项

    for (const item of items) {
      if (item.items) {
        const subItem = item.items.find((subItem) => subItem.path === path);
        if (subItem) {
          // 如果找到了对应的子菜单项，设置 openKeys 为这个子菜单项的 subMenu
          setOpenKeys([subItem.subMenu]);
          break;
        }
      }
    }
  }, [path]);

  // 处理子菜单打开和关闭的事件
  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  return (
    <div className="left-nav">
      <Link to="/" className="left-nav-header">
        <img src={logo} alt="logo" />
        <h1>硅谷后台</h1>
      </Link>

      <Menu
        className="left-nav-menu"
        mode="inline"
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        theme="dark"
        selectedKeys={[path]}
      >
        {filteredItems.map((item) => {
          if (item.items) {
            // 如果菜单项有子菜单，渲染子菜单
            return (
              <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
                {item.items.map((subItem) => (
                  <Menu.Item key={subItem.key}>
                    <Link to={subItem.path}>{subItem.label}</Link>
                  </Menu.Item>
                ))}
              </Menu.SubMenu>
            );
          } else {
            // 如果菜单项没有子菜单，渲染菜单项
            return (
              <Menu.Item key={item.key} icon={item.icon}>
                <Link to={item.path}>{item.label}</Link>
              </Menu.Item>
            );
          }
        })}
      </Menu>

    </div>
  );
}
