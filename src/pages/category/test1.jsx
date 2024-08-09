import { Form } from "antd";

// 在组件外部创建一个Form实例
const [form1] = Form.useForm();

// 在handleCategory函数中传递form实例
const handleCategory = (title, okText, placeholder, rules) => {
  modal.confirm({
    title: title,
    icon: <ExclamationCircleOutlined />,
    content: (
      <Form form={form1}> {/* 将form实例传递给Form组件 */}
        <Form.Item name="categoryName" rules={rules}>
          <Input placeholder={placeholder} 
            onChange={(e) => setInputValue(e.target.value)}
          />
        </Form.Item>
      </Form>
    ),
    okText: okText,
    cancelText: "取消",
    onOk: () => {
      // handle ok callback here
      console.log("Ok clicked");
      const values = form.getFieldsValue(); // 获取整个表单的值
      console.log("Form values:", values); // 打印整个表单的值
    },
    onCancel: () => {
      // handle cancel callback here
      console.log("Cancel clicked");
    },
  });
};
