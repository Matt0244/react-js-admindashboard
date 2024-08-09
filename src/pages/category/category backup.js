import React, { useEffect, useState, useCallback } from "react";
import { Card, Space, Button, Table, message, Modal, Form, Input } from "antd";
import { PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { reqCategorys, reqUpdateCategory, reqAddCategory } from "../../api";
import "./index.less";

/**
 * Categorys component
 * @returns {JSX.Element} Categorys component JSX code
 */
export default function Categorys() {
    const [categorys, setCategorys] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [parentId, setParentId] = useState("0");
    const [subCategorys, setSubCategorys] = useState([]);
    const [form] = Form.useForm();
    const [modal, contextHolder] = Modal.useModal();

    /**
     * Handle view sub categories
     * @param {Object} record - Record object
     */
    const handleViewSubCategorys = useCallback((record) => {
        setParentId(record._id);
    }, []);

    /**
     * Get category list
     */
    const getCategorys = useCallback(async () => {
        setIsLoading(true);
        const result = await reqCategorys(parentId);
        setIsLoading(false);
        const { status, data, msg } = result;

        if (status === 0) {
            parentId === "0" ? setCategorys(data) : setSubCategorys(data);
        } else {
            message.error(msg, 1);
        }
    }, [parentId]);

    /**
     * Handle category add/update
     * @param {string} title - Modal title
     * @param {string} okText - OK button text
     * @param {string} placeholder - Input placeholder text
     * @param {Array} rules - Form validation rules
     * @param {string} categoryId - Category ID
     */
    const handleCategory = useCallback((title, okText, placeholder, rules, categoryId) => {
        modal.confirm({
            title,
            okText,
            cancelText: "取消",
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
                    const values = form.getFieldsValue();
                    const categoryName = values.categoryName;
                    let result;

                    if (title === '添加分类') {
                        result = await reqAddCategory(categoryName, parentId);
                    } else {
                        result = await reqUpdateCategory({ categoryId, categoryName });
                    }

                    if (result.status === 0) {
                        message.success(title === '添加分类' ? '添加分类成功' : '更新分类成功');
                        getCategorys();
                    } else {
                        message.error(result.msg || (title === '添加分类' ? '添加分类失败' : '更新分类失败'));
                    }
                } catch (error) {
                    console.log('Form validation failed:', error);
                } finally {
                    form.resetFields();
                }
            },
            onCancel: () => {
                form.resetFields();
            },
        });
    }, [form, modal, parentId, getCategorys]);

    useEffect(() => {
        getCategorys();
    }, [getCategorys]);

    const title = parentId === "0" ? "一级分类列表" : (
        <span>
            <Button type="link" onClick={() => setParentId("0")}>
                一级分类列表
            </Button>
            <span> / </span>
            <span>
                {categorys.find((category) => category._id === parentId)?.name}
            </span>
        </span>
    );

    const extra = parentId === "0" ? (
        <Button
            type="primary"
            onClick={() => handleCategory("添加分类", "确认", "请输入分类名称", [{ required: true, message: "添加分类名称必须输入" }])}
        >
            <PlusOutlined />
            添加
        </Button>
    ) : null;

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
            render: (record) => (
                <span>
                    <Button
                        type="link"
                        onClick={() => handleCategory("更改分类", "确认", record.name, [{ required: true, message: "添加分类名称必须输入" }], record._id)}
                    >
                        修改分类
                    </Button>
                    {parentId === "0" && (
                        <Button type="link" onClick={() => handleViewSubCategorys(record)}>
                            查看子分类
                        </Button>
                    )}
                </span>
            ),
        },
    ];

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