import React, { useEffect, useState, useRef } from "react";
import { Form, Input, Cascader, Button, message, Modal, Upload } from "antd";
import { reqCategorys } from "../../api";
import { useLocation, useHistory } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import { reqDeleteImg } from "../../api";
import RichTextEditor from "./rech-text-editor";
import { reqAddOrUpdateProduct } from "../../api";

const { TextArea } = Input;

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export default function ProdectAddUpdate() {
  const history = useHistory();
  const location = useLocation(); // Correctly get location from useLocation hook
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);
  const editorRef = useRef();
  const [options, setOptions] = useState([]);
  const [record, setRecord] = useState(
    (location.state && location.state.record) || {
      name: "",
      desc: "",
      price: 0,
      imgs: [],
      detail: "",
    }
  );

  const { name, desc, price, imgs, detail } = record;
  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf("/") + 1));
  };

  const handleChange = async ({ file, fileList }) => {
    if (file.status === "done") {
      const result = file.response;
      if (result.status === 0) {
        message.success("Photo Updated");
        const { name, url } = result.data;
        file = fileList[fileList.length - 1];
        file.name = name;
        file.url = url;
      }
    } else if (file.status === "removed") {
      const result = await reqDeleteImg(file.name);
      if (result.status === 0) {
        message.success("Photo Deleted");
      } else {
        message.error("Delete Failed");
      }
    }
    setFileList(fileList);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const onEditorChange = (newDetail) => {
    setRecord((prevRecord) => ({
      ...prevRecord,
      detail: newDetail,
    }));
  };

  const onFinish = (values) => {
    const { name, desc, price, categoryIds } = values;
    let pCategoryId, categoryId;
    if (categoryIds.length === 1) {
      pCategoryId = "0";
      categoryId = categoryIds[0];
    } else {
      pCategoryId = categoryIds[0];
      categoryId = categoryIds[1];
    }
    const imgs = fileList.map((c) => c.name);
    const detail = editorRef.current.getDetail();
    const product = { name, desc, price, imgs, detail, pCategoryId, categoryId };

    if (record._id) {
      product._id = record._id;
    }

    reqAddOrUpdateProduct(product)
      .then((response) => {
        if (response.status === 0) {
          message.success(`${record._id ? "Update" : "Add"} Product Success!`);
          history.goBack();
        } else {
          message.error(`${record._id ? "Update" : "Add"} Product Failed!`);
        }
      })
      .catch((error) => {
        console.error(error);
        message.error("Operation Failed, An Exception Occurred!");
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const checkPrice = (_, value) => {
    const numberValue = Number(value);
    if (numberValue > 0) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("Price must be greater than zero!"));
  };

  const onChange = (value, selectedOptions) => {};

  const getCategorys = async (parentId = "0") => {
    const result = await reqCategorys(parentId);
    if (result.status === 0) {
      const categorys = result.data;
      const categoryOptions = categorys.map((c) => ({
        value: c._id,
        label: c.name,
        isLeaf: parentId !== "0",
      }));
      if (parentId === "0") {
        setOptions(categoryOptions);
      } else {
        return categoryOptions;
      }
    }
  };

  const loadData = async (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;

    const subCategorys = await getCategorys(targetOption.value);
    targetOption.loading = false;

    if (subCategorys && subCategorys.length > 0) {
      targetOption.children = subCategorys;
    } else {
      targetOption.isLeaf = true;
    }
    setOptions([...options]);
  };

  useEffect(() => {
    getCategorys();
    if (imgs && imgs.length > 0) {
      const newImgs = imgs.map((img, index) => ({
        uid: -index,
        name: img,
        status: "done",
        url: `http://localhost:5000/upload/` + img,
        
        
      }));
      setFileList(newImgs);
    }
  }, [imgs]);

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{
        name: name || "",
        desc: desc || "",
        price: price || 0,
        detail: detail || "",
        imgs: imgs || [],
        categoryIds: record.categoryIds || [],
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item label="Product Name" name="name" rules={[{ required: true, message: "Product name is required!" }]}>
        <Input />
      </Form.Item>

      <Form.Item label="Product Description" name="desc" rules={[{ required: true, message: "Product description is required!" }]}>
        <TextArea rows={4} />
      </Form.Item>

      <Form.Item label="Product Price" name="price" rules={[{ validator: checkPrice }]}>
        <Input type="number" addonAfter="$" />
      </Form.Item>

      <Form.Item label="Product Category" name="categoryIds" rules={[{ required: true, message: "Product category is required!" }]}>
        <Cascader
          placeholder="Please select a product category"
          options={options}
          onChange={onChange}
          loadData={loadData}
          changeOnSelect
        />
      </Form.Item>

      <Form.Item label="Image Upload" name="imgs">
        <Upload
          action={`${window.location.origin}/api/manage/img/upload`}
          accept="image/*"
          name="image"
          listType="picture"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
          <img alt="example" style={{ width: "50%" }} src={previewImage} />
        </Modal>
      </Form.Item>

      <Form.Item label="Product Details" name="detail" rules={[{ required: true, message: "Product details are required!" }]}>
        <RichTextEditor ref={editorRef} detail={detail} onChange={onEditorChange} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
