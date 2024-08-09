import React, { useEffect, useState } from "react";
import { Card, Select, Input, Button, Table, message } from "antd";
import { reqProducts, reqSearchProducts, reqUpdateStatus } from "../../api";
import { useLocation, useHistory } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";

export default function Home() {
  const [products, setProducts] = useState([]); // 商品的数组
  const [total, setTotal] = useState(0); // 商品的总数量
  const [pageNum, setPageNum] = useState(1); // 显示第几页的数据
  const [pageSize, setPageSize] = useState(3); // 每页显示几条数据
  const [searchType, setSearchType] = useState("productName"); // 根据哪个字段搜索
  const [searchName, setSearchName] = useState(""); // 搜索的关键字
  const [isLoading, setIsLoading] = useState(false); // 是否正在加载中
  const [parentId, setParentId] = useState("0"); // 父分类的ID

  const history = useHistory();

  // 获取商品分页列表的请求
  const getProducts = async (pageNum) => {
    setIsLoading(true);
    let result = await reqProducts(pageNum, pageSize);
    setIsLoading(false);
    const { status, data, msg } = result;

    if (status === 0) {
      setProducts(data.list);
      setTotal(data.total);
    } else {
      message.error(msg);
    }
  };
  // 更新商品状态的请求
  const updateStates = async (productId, status) => {
    console.log(status)
    let result = await reqUpdateStatus(productId, status);
    console.log(result)
    const { status: status2,  msg } = result;
    console.log(status)
    if (status2 === 0) {
      message.success("更新成功");
      getProducts(pageNum);
      // setProducts(data.list);
    } else {
      message.error(msg);
    }
  };

  // 搜索商品分页列表的请求
  const getSearchProducts = async (
    pageNum,
    pageSize,
    searchName,
    searchType
  ) => {
    setIsLoading(true);
    let result = await reqSearchProducts({
      pageNum,
      pageSize,
      searchType,
      searchName,
    });
    setIsLoading(false);
    const { status, data, msg } = result;

 
    if (status === 0) {
      setProducts(data.list);
      setTotal(data.total);
      setPageSize(pageSize);
    } else {
      message.error(msg);
    }
  };

  // useEffect 更新商品状态
  useEffect(() => {
    getProducts(pageNum);
  }, [pageNum]);

  const Option = Select.Option;

  // 自己写得  下面是ai 加工的
  //   const title = (
  //     <span>
  //       <Select value={{productName}}   style={{ width: 150 }}>
  //         <Option value="productName">按名称搜索</Option>
  //         <Option value="productDesc">按描述搜索</Option>
  //       </Select>
  //       <Input placeholder="关键字" style={{ width: 150, margin: "0 15px" }} />
  //       <Button type="primary" onClick={() => this.getProducts(1)}>
  //         搜索
  //       </Button>
  //     </span>
  //   );
  const title = (
    <span>
      <Select
        value={searchType}
        onChange={(value) => setSearchType(value)}
        style={{ width: 150 }}
      >
        <Option value="productName">按名称搜索</Option>
        <Option value="productDesc">按描述搜索</Option>
      </Select>
      <Input
        placeholder="关键字"
        style={{ width: 150, margin: "0 15px" }}
        onChange={(e) => setSearchName(e.target.value)}
      />
      {/* reqSearchProducts onClickfunction */}
      <Button
        type="primary"
        onClick={() =>
          getSearchProducts(pageNum, pageSize, searchName, searchType)
        }
      >
        搜索
      </Button>
    </span>
  );

  const extra = (
    <Button type="primary" onClick={() => history.push("/product/addupdate")}>
      <PlusOutlined />
      添加商品
    </Button>
  );

  const columns = [
    {
      title: "商品名称",
      dataIndex: "name",
      key: "_id",
    },
    {
      title: "商品描述",
      dataIndex: "desc",
    },
    {
      title: "价格",
      dataIndex: "price",
      render: (price) => "¥" + price,
    },

    {
      title: "状态",
      width: 100,
      render: (product) => {
        const { status, _id, name } = product;
        const newStatus = status === 1 ? 2 : 1;
        return (
          <span>
            <Button type="primary" onClick={() => updateStates(_id, newStatus)}>
              {status === 1 ? "下架" : "上架"}
            </Button>
            <span>{status === 1 ? "在售" : "已下架"}</span>
          </span>
        );
      },
    },

    {
      title: "操作",
      width: 50,

      // key: "price",
      render: (record) => {
        return (
          <span>
            <Button
              type="link"
              onClick={() => {
                // Pass the record data as a second parameter to history.push
                history.push("/product/detail", { record });
              }}
            >
              详情
            </Button>
            <Button type="link"onClick={()=>{
              history.push("/product/addupdate",{record})
            }} >修改</Button>
          </span>
        );
      },
    },
  ];

  return (
    <Card title={title} extra={extra}>
      <Table
        bordered
        rowKey="_id"
        dataSource={products}
        columns={columns}
        pagination={{
          current: pageNum,
          total: total,
          defaultPageSize: pageSize,
          showQuickJumper: true,
          onChange: (pageNum) => {
            setPageNum(pageNum);
          },
        }}
        loading={isLoading}
      />
    </Card>
  );
}
