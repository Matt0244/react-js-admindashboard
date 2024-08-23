import ajax from "./ajax";
import jsonp from "jsonp";
import { message } from "antd";

// 正式写法
// export function reqLogin(username,passsword) {
//     return ajax('/login',(username,passsword),'POST')
// }

//这个是简写 箭头函数不带大括号{}就是要return的意思 这里return ajax 就是promise
// export const reqLogin = (username,password) =>{return ajax ('/login',{username,password}.'POST')}

const BASE = "http://localhost:3000";

export const reqLogin = (username, password) =>
  ajax("/login", { username, password }, "POST");

export const reqAddUser = (user) =>
  ajax(BASE + "/manage/user/add", user, "POST");

export const reqWeather = () => {
  return new Promise((resolve, reject) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=Adelaide,AU&appid=b145ec15a3b3b239ace5e12587f2676c`;
    // 发送jsonp请求
    jsonp(url, {}, (err, data) => {
      // console.log('jsonp()', err, data)
      // 如果成功了
      if (!err && data.cod === 200) {
        // 取出需要的数据
        const { temp } = data.main;
        const { description } = data.weather[0];
        //   console.log(temp,description)
        resolve({ temp, description });
      } else {
        // 如果失败了
        message.error("获取天气信息失败!");
      }
    });
  });
};

export const reqPollution = () => {
  return new Promise((resolve, reject) => {
    const url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=-34&lon=138&appid=b145ec15a3b3b239ace5e12587f2676c`;
    // 发送jsonp请求
    jsonp(url, {}, (err, data) => {
      // 如果成功了
      if (!err) {
        console.log(`reqPollution: ${JSON.stringify(data)}`);

        // 取出需要的数据data

        resolve({ data });
      } else {
        // 如果失败了
        message.error("获取空气污染信息失败!");
        reject(err);
      }
    });
  });
};

// ## 6. 获取一级或某个二级分类列表
// ### 请求URL：
//   http://localhost:5000/manage/category/list

// ### 请求方式：
//   GET

// ### 参数类型: query

//   |参数		|是否必选 |类型     |说明
//   |parentId    |Y       |string   |父级分类的ID

export const reqCategorys = (parentId) =>
  ajax(BASE + "/manage/category/list", { parentId });

// 添加分类
export const reqAddCategory = (categoryName, parentId) =>
  ajax(BASE + "/manage/category/add", { categoryName, parentId }, "POST");

// 更新分类
export const reqUpdateCategory = ({ categoryId, categoryName }) =>
  ajax(BASE + "/manage/category/update", { categoryId, categoryName }, "POST");

// 获取一个分类
export const reqCategory = (categoryId) =>
  ajax(BASE + "/manage/category/info", { categoryId });

// 获取商品分页列表
export const reqProducts = (pageNum, pageSize) =>
  ajax(BASE + "/manage/product/list", { pageNum, pageSize });

// 更新商品的状态(上架/下架)
export const reqUpdateStatus = (productId, status) =>
  ajax(BASE + "/manage/product/updateStatus", { productId, status }, "POST");

// open weather api b145ec15a3b3b239ace5e12587f2676c
//https://api.openweathermap.org/data/2.5/weather?q=Adelaide,AU&appid=b145ec15a3b3b239ace5e12587f2676c

/*
搜索商品分页列表 (根据商品名称/商品描述)
searchType: 搜索的类型, productName/productDesc
 */
export const reqSearchProducts = ({
  pageNum,
  pageSize,
  searchName,
  searchType,
}) =>
  ajax(BASE + "/manage/product/search", {
    pageNum,
    pageSize,
    [searchType]: searchName,
  });

// 搜索商品分页列表 (根据商品描述)
/*export const reqSearchProducts2 = ({pageNum, pageSize, searchName}) => ajax(BASE + '/manage/product/search', {
  pageNum,
  pageSize,
  productDesc: searchName,
})*/

// 删除指定名称的图片
export const reqDeleteImg = (name) =>
  ajax(BASE + "/manage/img/delete", { name }, "POST");

// 添加/修改商品
export const reqAddOrUpdateProduct = (product) =>
  ajax(
    BASE + "/manage/product/" + (product._id ? "update" : "add"),
    product,
    "POST"
  );
// 修改商品
// export const reqUpdateProduct = (product) => ajax(BASE + '/manage/product/update', product, 'POST')

// 获取所有角色的列表
export const reqRoles = () => ajax(BASE + "/manage/role/list");
// 添加角色
export const reqAddRole = (roleName) =>
  ajax(BASE + "/manage/role/add", { roleName }, "POST");
// 添加角色
export const reqUpdateRole = (role) =>
  ajax(BASE + "/manage/role/update", role, "POST");

// 获取所有用户的列表
export const reqUsers = () => ajax(BASE + "/manage/user/list");
// 删除指定用户
export const reqDeleteUser = (userId) =>
  ajax(BASE + "/manage/user/delete", { userId }, "POST");
// 添加/更新用户
export const reqAddOrUpdateUser = (user) =>
  ajax(BASE + "/manage/user/" + (user._id ? "update" : "add"), user, "POST");
