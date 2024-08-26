// /app index/
// vs code rcc short cut

import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Login from './pages/login/login.jsx'
import Admin from './pages/admin/admin.jsx'
import Matt from './pages/matt/matt.jsx'
import storageUtils from './utils/storageUtils';
import memoryUtils from './utils/memoryUtils';
import { ConfigProvider } from 'antd';
import  './index.css';


export default function App() {
  //读取local中保存的user，保存到内存中
  const user = storageUtils.getUser();
  memoryUtils.user = user;
  // console.log('我是user=' + JSON.stringify(memoryUtils.user));


  return (
    <BrowserRouter>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#00b96b',
          },
        }}
      >

        <Switch> {/*只匹配其中一个*/}
          {/* <Route path='/login' component={Login}></Route> */}
          {/* <Route path='/' component={Admin}></Route> */}
          <Route path='/matt' component={Matt}></Route>

        </Switch>
      </ConfigProvider>

    </BrowserRouter>




  )
}
