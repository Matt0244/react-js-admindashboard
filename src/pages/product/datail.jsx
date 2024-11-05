import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { message } from "antd";
import { reqCategory } from "../../api";
import { Card, List, Button } from "antd";

import { ArrowLeftOutlined, RightCircleFilled } from "@ant-design/icons";

// The categories are not fully implemented. Category 2 is not displayed, Category 1 is displayed.
const Item = List.Item;

export default function ProductDetail() {
  const location = useLocation();
  const history = useHistory();
  const [cName1, setName1] = useState(["Category 1"]); // Array of product categories
  const [cName2, setName2] = useState([""]); // Array of product categories, this part is not completed yet

  const { name, desc, price, detail, imgs, categoryId, pCategoryId } =
    location.state.record;

  console.log(categoryId);
  console.log(pCategoryId);

  // This part should be improved with promise.all for better performance
  const getCategory = async (categoryId) => {
    let result = await reqCategory(categoryId);
    const { status, data, msg } = result;
    if (status === 0) {
      if (data.parentId === "0") {
        console.log(data);
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
  }, [categoryId]);

  const title = (
    <span>
      <Button type="link">
        <ArrowLeftOutlined
          style={{ marginRight: 10, fontSize: 20 }}
          onClick={() => history.goBack()}
        />
        Product Details
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
          <span className="left">Product Name:</span>
          <span>{name}</span>
        </Item>
        <Item>
          <span className="left">Product Description:</span>
          <div dangerouslySetInnerHTML={{ __html: desc }} />
        </Item>
        <Item>
          <span className="left">Product Price:</span>
          <span>${price}</span>
        </Item>
        <Item>
          <span className="left">Product Category:</span>
          <span>{cName1}</span>
        </Item>
        <Item>
          <span className="left">Product Images:</span>
          <span
            style={{
              width: 150,
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            {imgs.map((img) => (
              <img
                key={img}
                // src={`/upload/` + img}
                src={`http://localhost:5000/upload/` + img}
                className="product-img"
                alt="img"
              />
            ))}
          </span>
        </Item>
        <Item>
          <span className="left">Product Details:</span>
          <div dangerouslySetInnerHTML={{ __html: detail }} />
        </Item>
      </List>
    </Card>
  );
}
