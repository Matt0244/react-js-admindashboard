import React, { useEffect, useState, useRef } from "react";

import { Form, Input, Cascader, Button, message, Modal, Upload } from "antd";
import { reqCategorys } from "../../api";
import { useLocation, useHistory } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import { reqDeleteImg } from "../../api";
import RichTextEditor from "./rech-text-editor";
import { reqAddOrUpdateProduct } from "../../api";

// Extract TextArea component
const { TextArea } = Input;

// Convert image to base64
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export default function ProdectAddUpdate() {
  // Create history
  const history = useHistory();

  // Ant Design preset for image upload
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);

  // Create ref container editorRef
  const editorRef = useRef();

  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
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

  // Get image names
  // const imgs = fileList.map((c) => c.name);
  // console.log(imgs);
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  // End of Ant Design preset for image upload

  const location = useLocation();

  // Create setOptons, state as an empty array
  const [options, setOptions] = useState([]);

  // Create setPrentId, default state is 0
  const [parentId, setParentId] = useState("0");
  // However, if you didn’t set location.state when navigating, or didn’t set location.state.record, then location.state or location.state.record might be undefined. In this case, you need to check if location.state exists before accessing location.state.record.
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

  console.log("This is record");
  console.log(record);

  // After the component mounts, send an async request to get the primary category list
  useEffect(() => {
    getCategorys();
    if (imgs && imgs.length > 0) {
      let newImgs = imgs.map((img, index) => ({
        uid: -index, // Each file has its own unique id
        name: img, // Image file name
        status: "done", // Image status: done - uploaded, uploading: uploading, removed: deleted
        url: "http://localhost:3000/upload/" + img,
      }));
      setFileList(newImgs);
    }
    if (editorRef.current) {
      setRecord((prevRecord) => ({
        ...prevRecord,
        detail: editorRef.current.getDetail(),
      }));
    }
  }, [parentId, imgs, editorRef]);

  // Define onChange function to update the detail value
  const onEditorChange = (newDetail) => {
    setRecord((prevRecord) => ({
      ...prevRecord,
      detail: newDetail,
    }));
  };

  const onFinish = (values) => {
    // 1. Collect data and package it into a product object
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
    const product = {
      name,
      desc,
      price,
      imgs,
      detail,
      pCategoryId,
      categoryId,
    };
    console.log(product);

    // If updating, add _id
    if (record._id) {
      product._id = record._id;
    }

    // 2. Call API request function to add/update
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
    // Get the latest detail value through record.detail
    console.log(record.detail);

    console.log("Failed:", errorInfo);
  };

  // In Ant Design's Form component, a custom validation function needs to receive two parameters: rule and value. The rule parameter contains the rules you defined for the field in the rules array, and the value parameter is the user's input.

  // In your checkPrice function, you’re not using the rule parameter, so you can use a placeholder _ to represent it. This is a common programming convention used to indicate that the parameter is not being used in the function body.

  // If you don't use a placeholder, your function will only receive one parameter, which will be rule instead of value. This is why you need to include a placeholder _ in the checkPrice function’s parameter list.
  const checkPrice = (_, value) => {
    const numberValue = Number(value);
    if (numberValue > 0) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("Price must be greater than zero!"));
  };

  // Cascading selector
  const onChange = (value, selectedOptions) => {
    setParentId(value);
  };

  // When selecting a category item, callback function for loading the next level category list
  // const filter = (inputValue, path) => {
  //   return path.some(
  //     (option) =>
  //       option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
  //   );
  // };

  // This formula is fixed, you only need to copy it into your code, then replace reqCategorys with your request function. Keep learning slowly.
  // Get primary/secondary category list
  // 1. First send prarent = 0 to get all primary categories, 2. use map to define value: c._id, 3. use promise.all to get secondary category data, 4. use forEach to add secondary category data to the corresponding primary category item.
  // 5. Use setOptions to update the state
  // The main purpose of this code is to get primary and secondary category data and format it for the Cascader component.

  // The getCategorys function first sends an async request via the reqCategorys function to get the category data for the specified parentId.

  // If the request is successful (result.status === 0), the returned data is stored in the categorys variable.

  // Next, based on the value of parentId, it determines whether to get the primary category or the secondary category.

  // If parentId is '0', it means fetching the primary category. Each category item is mapped into an object containing value (category id), label (category name), and isLeaf (indicating whether it is a leaf node, meaning no subcategories). Initially, it assumes all primary categories have subcategories, so isLeaf is set to false.

  // Then, for each primary category item, the getCategorys function is called again to get its secondary category data. Use Promise.all to wait for all async operations to complete.

  // Once all secondary category data is obtained, iterate over each secondary category data. If a primary category has no secondary categories (subC.length === 0), set its isLeaf property to true. Otherwise, add the secondary category data to its children property.

  // Finally, use setOptions to update the state and save all primary category data.

  // If parentId is not '0', it means fetching the secondary category. Each category item is mapped into an object containing value, label, and isLeaf properties. Since secondary categories have no subcategories, isLeaf is set to true. Then return this array.

  // This way, whenever the getCategorys function is called, the correct format of category data can be obtained and directly used for the Cascader component.
  const getCategorys = async (parentId = "0") => {
    const result = await reqCategorys(parentId);

    if (result.status === 0) {
      const categorys = result.data;
      if (parentId === "0") {
        // If it’s a primary category
        const categoryOptions = categorys.map((c) => ({
          value: c._id,
          label: c.name,
          isLeaf: false, // Initially assume all primary categories have subcategories
        }));
        // Get secondary category data
        const subCategorys = await Promise.all(
          categoryOptions.map((c) => getCategorys(c.value))
        );
        // Add secondary category data to the corresponding primary category item
        subCategorys.forEach((subC, index) => {
          if (subC.length === 0) {
            // If no subcategory
            categoryOptions[index].isLeaf = true; // Set isLeaf to true
          } else {
            categoryOptions[index].children = subC;
          }
        });
        setOptions(categoryOptions);
      } else {
        // If it’s a secondary category
        return categorys.map((c) => ({
          value: c._id,
          label: c.name,
          isLeaf: true,
        }));
      }
    }
  };

  return (
    <Form
      name="basic"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      style={{
        maxWidth: 600,
      }}
      initialValues={{
        name: name || "",
        desc: desc || "",
        price: price || 0,
        detail: detail || "",
        imgs: imgs || [],
        // categoryIds If it has a value, it means it's an update page; if not, it's an add page
        categoryIds: record.categoryIds || [],

        // Other fields' initial values...
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      {/* Product Name Row */}
      <Form.Item
        label="Product Name"
        name="name"
        rules={[
          {
            required: true,
            message: "Product name is required!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      {/* Product Description */}
      <Form.Item
        label="Product Description"
        name="desc"
        rules={[
          {
            required: true,
            message: "Product description is required!",
          },
        ]}
      >
        <TextArea rows={4} />
      </Form.Item>

      {/* Product Price */}
      <Form.Item
        label="Product Price"
        name="price"
        rules={[
          {
            validator: checkPrice,
          },
        ]}
      >
        <Input type="number" addonAfter="¥" />
      </Form.Item>

      {/* Product Category */}
      <Form.Item
        label="Product Category"
        name="categoryIds"
        rules={[
          {
            required: true,
            message: "Product category is required!",
          },
        ]}
      >
        <Cascader
          placeholder="Please select a product category"
          options={options}
          onChange={onChange}
          onSearch={(value) => console.log(value)}
        ></Cascader>
      </Form.Item>

      {/* Image Upload */}
      <Form.Item label="Image Upload" name="imgs">
        <Upload
          action="/manage/img/upload"
          accept="image/*"
          name="image"
          listType="picture"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal
          open={previewOpen}
          title={previewTitle}
          footer={null}
          onCancel={handleCancel}
        >
          <img
            alt="example"
            style={{
              width: "50%",
            }}
            src={previewImage}
          />
        </Modal>
      </Form.Item>

      {/* Product HTML Text */}
      <Form.Item
        label="Product Details"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 24 }}
        // When submitting the form, the content in the rich text editor will be converted into HTML text and then submitted to the backend
        name="detail"
        // Required
        rules={[
          {
            required: true,
            message: "Product details are required!",
          },
        ]}
      >
        {/* <RichTextEditor ref={editorRef} /> */}
        {/* // Introducing the rich text editor and adding ref={editorRef} to get the content in the rich text editor. However, this will cause an error */}
        <RichTextEditor
          ref={editorRef}
          detail={detail}
          onChange={onEditorChange}
        />
      </Form.Item>

      {/* Submit Button */}
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
