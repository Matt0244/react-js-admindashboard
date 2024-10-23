/**
 * @fileoverview Categorys component displays a table of categories and subcategories with the ability to add, update and view subcategories.
 * @package
 */

import React, { useEffect, useState } from "react";
import { Card, Space, Button, Table, message, Modal, Form, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "./index.css";
import { reqCategorys, reqUpdateCategory, reqAddCategory } from "../../api";
import { ExclamationCircleOutlined } from "@ant-design/icons";

/**
 * Categorys component displays a table of categories and subcategories with the ability to add, update and view subcategories.
 * @returns {JSX.Element} Categorys component JSX code.
 */
export default function Categorys() {
  // set state data

  const [categorys, setCategorys] = useState([]);
  // set isLoading state false
  const [isLoading, setIsLoading] = useState(false);
  // set parentId state
  const [parentId, setParentId] = useState("0");
  // set subCategorys state
  const [subCategorys, setSubCategorys] = useState([]);

  // Create a Form instance outside the component
  const [form] = Form.useForm();

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

  const getCategorys = async () => {
    setIsLoading(true);
    let result = await reqCategorys(parentId);
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

  const handleCategory = (title, okText, placeholder, rules, categoryId) => {
    modal.confirm({
      categoryId: categoryId,
      title: title,
      okText: okText,
      cancelText: "Cancel",
      icon: <ExclamationCircleOutlined />,
      content: (
        <Form form={form}>
          <Form.Item name="categoryName" rules={rules}>
            <Input placeholder={placeholder} />
          </Form.Item>
        </Form>
      ),

      onOk: async () => {
        try {
          // handle ok callback here

          const values = form.getFieldsValue(); // Get the entire form values
          const categoryName = values.categoryName;
          console.log("Form values:", values.categoryName); // Print the entire form values
          console.log(categoryName); // Print id

          // Call reqUpdateCategory method and handle the return value
          let result;
          if (title === "Add Category") {
            // Call addUpdateCategory method and handle the return value
            result = await reqAddCategory(categoryName, parentId);
          } else {
            // Call reqUpdateCategory method and handle the return value
            result = await reqUpdateCategory({
              categoryId,
              categoryName: values.categoryName,
            });
          }
          console.log(result);

          if (result.status === 0) {
            message.success(
              title === "Add Category" ? "Category added successfully" : "Category updated successfully"
            );
            getCategorys(); // Re-fetch the category list after successful update
          } else {
            message.error(
              result.msg || (title === "Add Category" ? "Failed to add category" : "Failed to update category")
            );
          }
          form.resetFields();
        } catch (error) {
          // If form validation fails, error will contain validation error information
          console.log("Form validation failed:", error);
        }
      },

      onCancel: () => {
        // handle cancel callback here
        console.log("Cancel clicked");
        form.resetFields(); // Reset form
      },
    });
  };

  // useEffect hook to fetch category data from server
  useEffect(() => {
    getCategorys();
  }, [parentId]);

  // set title and extra button for card component
  const title =
    parentId === "0" ? (
      "Primary Category List"
    ) : (
      <span>
        <Button type="link" onClick={() => setParentId("0")}>
          Primary Category List
        </Button>
        <span> / </span>
        <span>{categorys.find((category) => category._id === parentId)?.name}</span>
        <Button
          type="primary"
          onClick={() =>
            handleCategory("Add Subcategory", "Confirm", "Please enter category name", [
              { required: true, message: "Subcategory name is required" },
            ])
          }
          style={{ marginLeft: "50px" }}
        >
          <PlusOutlined />
          Add Subcategory
        </Button>
      </span>
    );
  const extra =
    parentId === "0" ? (
      <Button
        type="primary"
        onClick={() =>
          handleCategory("Add Category", "Confirm", "Please enter category name", [
            { required: true, message: "Category name is required" },
          ])
        }
      >
        <PlusOutlined />
        Add
      </Button>
    ) : null;

  // set dataSource and columns for Table component
  const dataSource = parentId === "0" ? categorys : subCategorys;
  const columns = [
    {
      title: "Category Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Actions",
      align: "center",
      width: "40%",
      render: (record) => {
        return (
          <span>
            <Button
              type="link"
              onClick={() =>
                handleCategory("Update Category", "Confirm", record.name, [
                  { required: true, message: "Category name is required" },
                ], record._id)
              }
            >
              Update Category
            </Button>
            {parentId === "0" ? (
              <Button type="link" onClick={() => handleViewSubCategorys(record)}>
                View Subcategories
              </Button>
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