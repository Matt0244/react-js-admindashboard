import React, { useEffect, useState } from "react";
import { Card, Select, Input, Button, Table, message } from "antd";
import { reqProducts, reqSearchProducts, reqUpdateStatus } from "../../api";
import { useLocation, useHistory } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";

export default function Home() {
  const [products, setProducts] = useState([]); // Array of products
  const [total, setTotal] = useState(0); // Total number of products
  const [pageNum, setPageNum] = useState(1); // The page number to display
  const [pageSize, setPageSize] = useState(3); // Number of items per page
  const [searchType, setSearchType] = useState("productName"); // Search by field
  const [searchName, setSearchName] = useState(""); // Search keyword
  const [isLoading, setIsLoading] = useState(false); // Whether it's loading
  const [parentId, setParentId] = useState("0"); // Parent category ID

  const history = useHistory();

  // Request to get paginated product list
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

  // Request to update product status
  const updateStates = async (productId, status) => {
    console.log(status)
    let result = await reqUpdateStatus(productId, status);
    console.log(result)
    const { status: status2,  msg } = result;
    console.log(status)
    if (status2 === 0) {
      message.success("Update successful");
      getProducts(pageNum);
      // setProducts(data.list);
    } else {
      message.error(msg);
    }
  };

  // Request to search paginated product list
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

  // useEffect to update product status
  useEffect(() => {
    getProducts(pageNum);
  }, [pageNum]);

  const Option = Select.Option;

  // Self-written part, below is AI-processed
  //   const title = (
  //     <span>
  //       <Select value={{productName}}   style={{ width: 150 }}>
  //         <Option value="productName">Search by Name</Option>
  //         <Option value="productDesc">Search by Description</Option>
  //       </Select>
  //       <Input placeholder="Keyword" style={{ width: 150, margin: "0 15px" }} />
  //       <Button type="primary" onClick={() => this.getProducts(1)}>
  //         Search
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
        <Option value="productName">Search by Name</Option>
        <Option value="productDesc">Search by Description</Option>
      </Select>
      <Input
        placeholder="Keyword"
        style={{ width: 150, margin: "0 15px" }}
        onChange={(e) => setSearchName(e.target.value)}
      />
      {/* reqSearchProducts onClick function */}
      <Button
        type="primary"
        onClick={() =>
          getSearchProducts(pageNum, pageSize, searchName, searchType)
        }
      >
        Search
      </Button>
    </span>
  );

  const extra = (
    <Button type="primary" onClick={() => history.push("/product/addupdate")}>
      <PlusOutlined />
      Add Product
    </Button>
  );

  const columns = [
    {
      title: "Product Name",
      dataIndex: "name",
      key: "_id",
    },
    {
      title: "Product Description",
      dataIndex: "desc",
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (price) => "¥" + price,
    },

    {
      title: "Status",
      width: 100,
      render: (product) => {
        const { status, _id, name } = product;
        const newStatus = status === 1 ? 2 : 1;
        return (
          <span>
            <Button type="primary" onClick={() => updateStates(_id, newStatus)}>
              {status === 1 ? "Deactivate" : "Activate"}
            </Button>
            <span>{status === 1 ? "On Sale" : "Deactivated"}</span>
          </span>
        );
      },
    },

    {
      title: "Actions",
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
              Details
            </Button>
            <Button type="link"onClick={()=>{
              history.push("/product/addupdate",{record})
            }} >Edit</Button>
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
