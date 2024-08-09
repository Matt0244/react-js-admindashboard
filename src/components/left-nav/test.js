import React from 'react';
import { HomeFilled, AppstoreOutlined, ToolFilled, SettingOutlined, SignalFilled } from '@ant-design/icons';

function getItem(label, key, icon, items, path, subMenu) {
  return {
    key,
    icon,
    items,
    label,
    path,
    subMenu,
  };
}

const items = [
  getItem("首页", "/home", <HomeFilled />, null, "/home"),
  getItem("商品", "/sub1", <AppstoreOutlined />, [
    getItem("品类管理", "/category", null, null, "/category", "/sub1"),
    getItem("商品分类", "/product", null, null, "/product", "/sub1"),
  ]),
  getItem("用户管理", "/user", <ToolFilled />, null, "/user"),
  getItem("角色管理", "/role", <SettingOutlined />, null, "/role"),
  getItem("图形图表", "/sub2", <SignalFilled />, [
    getItem("柱形图", "/bar", null, null, "/bar", "/sub2"),
    getItem("折线图", "/line", null, null, "/line", "/sub2"),
    getItem("饼图", "/pie", null, null, "/pie", "/sub2"),
  ]),
];

const menus = ["/home", "/order", "/role"];

const filteredItems = items.filter(item => {
  if (menus.includes(item.path)) {
    return true;
  }
  if (item.items) {
    const filteredSubItems = item.items.filter(subItem => menus.includes(subItem.path));
    if (filteredSubItems.length > 0) {
      return true;
    }
  }
  return false;
}).map(item => {
  if (item.items) {
    return {
      ...item,
      items: item.items.filter(subItem => menus.includes(subItem.path))
    };
  }
  return item;
});

console.log(filteredItems);

function App() {
  return (
    <div>
      {/* Render filtered items here */}
    </div>
  );
}

export default App;
