import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { message } from "antd";
import { reqCategory } from "../../api";
import { Card, List, Button } from "antd";

import { ArrowLeftOutlined, RightCircleFilled } from "@ant-design/icons";



// 分类没有正式完成,分类2没有显示.分类1显示了
const Item = List.Item;

const BASE_IMG_URL = "http://localhost:3000/upload/";

export default function ProductDetail() {
  const location = useLocation();
  const history = useHistory();
  const [cName1, setName1] = useState(["分类1"]); // 商品的数组
  const [cName2, setName2] = useState(['']); // 商品的数组   这里没有完


  const { name, desc, price, detail, imgs ,categoryId,pCategoryId} = location.state.record;


  console.log(categoryId)
  console.log(pCategoryId)


  //  下面应该 改成 promise.all 更完善

const getCategory = async (categoryId) => {
  let result = await reqCategory(categoryId);
  const { status, data, msg } = result;
  if (status === 0) {
    if (data.parentId === "0") {
      console.log(data)
      
      setName1(data.name);
    } else {
      setName2(data.name);
    }
  } else {
    message.error(msg);
  }
};


  useEffect(() => { 
    getCategory(categoryId);
  }
  , [categoryId]);




  



  const title = (
    <span>
      <Button type="link">
        <ArrowLeftOutlined
          style={{ marginRight: 10, fontSize: 20 }}
          onClick={() => history.goBack()}
        />
        商品详情
      </Button>
    </span>
  );

  
  // const getCategory = async (categoryId:) => {
  //   let result = await reqCategory(categoryId);
  //   const { status, data, msg } = result;
  //   if (status === 0) {
  //     if (data.parentId === "0") {
  //       setName1(data.name);
  //     } else {
  //       setName2(data.name);
  //     }
  //   } else {
  //     message.error(msg);
  //   }
  // };


  return (
    <Card title={title} className="product-detail">
      <List>
        <Item>
          <span className="left">商品名称:</span>
          <span>{name}</span>
        </Item>
        <Item>
          <span className="left">商品描述:</span>
          <div dangerouslySetInnerHTML={{ __html: desc }} />
        </Item>
        <Item>
          <span className="left">商品价格:</span>
          <span>{price}元</span>
        </Item>
        <Item>
          <span className="left">所属分类:</span>
          <span>
            {cName1}
          </span>
        </Item>
        <Item>
          <span className="left">商品图片:</span>
          <span style={{width:150, display:'flex', flexDirection:'row', justifyContent:"flex-end"}}>
            {imgs.map((img) => (
              <img
                key={img}
                src={BASE_IMG_URL + img}
                className="product-img"
                alt="img"
              />
            ))}
          </span>
        </Item>
        <Item>
          <span className="left">商品详情:</span>

          <div dangerouslySetInnerHTML={{ __html: detail }} />
        </Item>
      </List>
    </Card>
  );
}
