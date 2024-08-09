/**
 * @fileoverview Categorys component displays a table of categories and subcategories with the ability to add, update and view subcategories.
 * @package
 */

import React, { useEffect, useState } from "react";
import { Card, Space, Button, Table, message, Modal, Form, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import { reqCategorys } from "../../api";
import { ExclamationCircleOutlined } from "@ant-design/icons";

/**
 * Categorys component displays a table of categories and subcategories with the ability to add, update and view subcategories.
 * @returns {JSX.Element} Categorys component JSX code.
 */
export default function Categorys() {
  // set state data
  const [categorys, setCategorys] = useState([]);
  // set isloading state false
  const [isLoading, setIsLoading] = useState(false);
  // set parentid state
  const [parentId, setParentId] = useState("0");
  // set subCategorys state
  const [subCategorys, setSubCategorys] = useState([]);

  /**
   * Function to handle viewing subcategories.
   * @param {Object} record - The record object of the category.
   */
  const handleViewSubCategorys = (record) => {
    setParentId(record._id);
  };

  // useModal hook to create modal instance and context holder
  const [modal, contextHolder] = Modal.useModal();

  /**
   * Function to handle adding or updating a category.
   * @param {string} title - The title of the modal.
   * @param {string} okText - The text of the ok button.
   * @param {string} placeholder - The placeholder of the input field.
   * @param {Array} rules - The validation rules for the input field.
   */
  const handleCategory = (title, okText, placeholder, rules) => {
    modal.confirm({
      title: title,
      icon: <ExclamationCircleOutlined />,
      content: (
        <Form>
          <Form.Item name="categoryName" rules={rules}>
            <Input placeholder={placeholder} />
          </Form.Item>
        </Form>
      ),
      okText: okText,
      cancelText: "取消",
      onOk: () => {
        // handle ok callback here
        console.log("Ok clicked");
      },
      onCancel: () => {
        // handle cancel callback here
        console.log("Cancel clicked");
      },
    });
  };

  // useEffect hook to fetch category data from server
  useEffect(() => {
    const getCategorys = async () => {
      // set isloading state true
      setIsLoading(true);
      let result = await reqCategorys(parentId);
      console.log(result);
      // set isloading state false
      setIsLoading(false);
      const { status, data, msg } = result;

      if (status === 0) {
        if (parentId === "0") {
          setCategorys(data);
        } else {
          setSubCategorys(data);
        }
      } else {
        message.error(msg, 1);
      }
    };
    getCategorys();
  }, [parentId]);

  // set title and extra button for card component
  const title = parentId === "0" ? "一级分类列表" : (
    <span>
      <Button type="link" onClick={() => setParentId("0")}>一级分类列表</Button>
      <span> / </span>
      <span>{categorys.find((category) => category._id === parentId)?.name}</span>
    </span>
  );
  const extra = (
    parentId === "0" ? (
      <Button type="primary" onClick={() => handleCategory("添加分类", "确认", "请输入分类名称", [{ required: true, message: "添加分类名称必须输入" }])}>
        <PlusOutlined />
        添加
      </Button>
    ) : null
  );

  // set dataSource and columns for Table component
  const dataSource = parentId === "0" ? categorys : subCategorys;
  const columns = [
    {
      title: "分类名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "操作",
      align: "center",
      width: "40%",
      render: (record) => {
        return (
          <span>
            <Button type="link" onClick={() => handleCategory("更改分类", "确认", "请输入更改分类名称", [{ required: true, message: "更改分类名称必须输入" }])}>
              修改分类
            </Button>
            {parentId === "0" ? (
              <Button type="link" onClick={() => handleViewSubCategorys(record)}>查看子分类{record._id}</Button>
            ) : null}
          </span>
        );
      },
    },
  ];

  // render Card and Table components with data and props
  return (
    <div className="categorys-container">
      <Space direction="vertical" size={16}>
        <Card title={title} extra={extra}>
          <Table
            bordered
            dataSource={dataSource}
            columns={columns}
            rowKey="_id"
            pagination={{ pageSize: 5 }}
            loading={isLoading}
          />
        </Card>
      </Space>
      {contextHolder}
    </div>
  );
}
