import React, { useState, useEffect, createContext } from "react";
import { useLocation } from "react-router-dom";
import { Modal, Button } from "antd";
// import "./index.less";
import "./indes.css";

import { reqWeather } from "../../api/index";
import weatherLogo from "../../assets/images/weather.png";
import { items } from "../left-nav/my-leftNav.jsx";
import storageUtils from "../../utils/storageUtils.js";
// import memoryUtils from "../../utils/memoryUtils.js";
import { connect } from 'react-redux';
import { receiveUser, setHeadTitle } from '../../redux/actions.js';

const ReachableContext = createContext(null);
const config = {
  title: "Logout!",
  content: (
    <>
      <ReachableContext.Consumer>
        {() => `Click confirm if you want to log out!`}
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

  const { headTitle, setHeadTitle, user } = props;
  const [now, setNow] = useState(new Date().toLocaleString());
  const [temp, setTemp] = useState("temp");
  const [description, setDescription] = useState("weather");
  const [title, setTitle] = useState("Home");
  const location = useLocation();
  const [modal, contextHolder] = Modal.useModal();

  const username = user.username;

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
        console.log(data);
        setTemp((data.temp - 273.15).toFixed(2));
        setDescription(data.description);
      });
    }, 10000);

    // Find title
    const findTitle = () => {
      items.forEach((item) => {
        if (item.path === path) {
          setTitle(item.label);
        } else if (item.items) {
          // const subTitle = item.items.find(s => s.path === path); same as find statement
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
    setHeadTitle(title);

    return () => {
      clearInterval(intervalId);
      clearInterval(getWeather);
    };
  }, [path]);

  return (
    <div className="header">
      <div className="header-top">
        <span>Welcome: {username}</span>
        <ReachableContext.Provider value="Light">
          {/* Clicking the link triggers the modal, 
          then clicking confirm will log out the user, 
          remove user data from utils, and navigate to the login page */}

          <Button type="text" style={{ color: "white", fontSize: '12px' }}
            onClick={async () => {
              const confirmed = await modal.confirm(config);
              console.log("Confirmed: ", confirmed);
            }}
          >
            Exit
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
            Weather: "{description.toUpperCase()} " Temp: {temp}℃
          </span>
   
        </div>
      </div>
    </div>
  );
}

export default connect(
  (state => ({ headTitle: state.headTitle, user: state.user })),
  { setHeadTitle }
)(MyHeader);
