import React, { useState, useEffect, createContext } from "react";
import { useLocation } from "react-router-dom";
import {  Modal,Button } from "antd";
// import "./index.less";
import "./indes.css";

import { reqWeather } from "../../api/index";
import weatherLogo from "../../assets/images/weather.png";
import { items } from "../left-nav/my-leftNav.jsx";
import storageUtils from "../../utils/storageUtils.js";
// import memoryUtils from "../../utils/memoryUtils.js";
import {connect} from 'react-redux'
import {receiveUser, setHeadTitle} from'../../redux/actions.js'

const ReachableContext = createContext(null);
const config = {
  title: "退出登录!",
  content: (
    <>
      <ReachableContext.Consumer>
        {() => `如果退出登录,点击确认!`}
      </ReachableContext.Consumer>
    </>
  ),
  onOk() {
    storageUtils.removeUser();
    // memoryUtils.user = {};
    receiveUser({});
    
    window.location.href = "/login";
  },
};


function MyHeader(props) {
  // state = {
  //   now: new Date().toLocaleString(),
  //   dayPictureUrl: "",
  //   weather: "",
  // };

  const{ headTitle,setHeadTitle,user} = props
  const [now, setNow] = useState(new Date().toLocaleString());
  const [temp, setTemp] = useState("temp");
  const [description, setDescription] = useState("weater");
  const [title, setTitle] = useState("首页");
  const location = useLocation();
  const [modal, contextHolder] = Modal.useModal();

  const username= user.username;

  const path = location.pathname;

  // getTransitionName = () => {
  //   setInterval(() => {
  //     const now = new Date().toLocaleString();
  //     this.setState({ now });
  //   }, 1000);
  // };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date().toLocaleString();
      setNow(now);
    }, 1000);

    const getWeather = setInterval(() => {
      reqWeather().then((data) => {
        console.log(data)
        setTemp((data.temp - 273.15).toFixed(2));
        setDescription(data.description);
      });
    }, 10000);

    // 找title
    const findTitle = () => {
      items.forEach((item) => {
        if (item.path === path) {
          setTitle(item.label);
        } else if (item.items) {
          //const subTitle = item.items.find(s => s.path === path); 一样 find 后面的值是一样的
          const subTitle = item.items.find(
            (subTitle) => subTitle.path === path
          );
          if (subTitle) {
            setTitle(item.label + " > " + subTitle.label);
          }
        }
      });
    };
    findTitle();
    setHeadTitle(title)

    return () => {
      clearInterval(intervalId);
      clearInterval(getWeather);
    };
  }, [path]);

  return (
    <div className="header">
      <div className="header-top">
   
        <span>欢迎 {username}</span>
        <ReachableContext.Provider value="Light">
          {/* /点击a标签弹出模态框,然后点击确认退出登录
          引入utils中的modal 删除user中的数据,然后跳转到login页面 */}

          <Button  type="text" style={{ color: "white" ,fontSize:'12px'}}
            onClick={async () => {
              const confirmed = await modal.confirm(config);
              console.log("Confirmed: ", confirmed);
            }}
          >
            退出
          </Button>

          {/* `contextHolder` should always be placed under the context you want to access */}
          {contextHolder}
        </ReachableContext.Provider>
      </div>
      <div className="header-bottom">
        <div className="header-bottom-left">{title}</div>
        <div className="header-bottom-right">
          <span>{now.toLocaleString()}</span>
          <img src={weatherLogo} alt="weather" />
          <span>
            天气: "{description.toUpperCase()}   温度:{temp}℃"
          </span>
          <div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default connect(
  (state => ({headTitle:state.headTitle,user:state.user})),
  {setHeadTitle}
)(MyHeader);
