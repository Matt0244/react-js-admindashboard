import React, { useEffect, useState, useRef } from "react";

import { Form, Input, Cascader, Button, message, Modal, Upload } from "antd";
import { reqCategorys } from "../../api";
import { useLocation, useHistory } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import { reqDeleteImg } from "../../api";
import RichTextEditor from "./rech-text-editor";
import { reqAddOrUpdateProduct } from "../../api";

//提取TextArea组件
const { TextArea } = Input;

// 图片转换成base64
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export default function ProdectAddUpdate() {
  // 创建history
  const history = useHistory();

  // 图片上载antd的预设
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);

  // 创建ref容器 editorRef
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
        message.success("图片上传成功");
        const { name, url } = result.data;
        file = fileList[fileList.length - 1];
        file.name = name;
        file.url = url;
      }
    } else if (file.status === "removed") {
      const result = await reqDeleteImg(file.name);
      if (result.status === 0) {
        message.success("图片删除成功");
      } else {
        message.error("图片删除失败");
      }
    }

    setFileList(fileList);
  };

  // 获取图片名字
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

  // 图片上载antd的预设 结束

  const location = useLocation();

  // 创建setOptons 状态为一个空数组
  const [options, setOptions] = useState([]);

  // 创建setPrentId 状态默认为0
  const [parentId, setParentId] = useState("0");
  // 但是，如果你没有在导航时设置location.state，或者没有设置location.state.record，那么location.state或location.state.record可能是undefined。在这种情况下，你需要在访问location.state.record之前，检查location.state是否存在。
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

  console.log("我是record");
  console.log(record);

  // 在组件挂载完成后，发送异步请求获取一级分类列表
  useEffect(() => {
    getCategorys();
    if (imgs && imgs.length > 0) {
      let newImgs = imgs.map((img, index) => ({
        uid: -index, // 每个file都有自己唯一的id
        name: img, // 图片文件名
        status: "done", // 图片状态: done-已上传, uploading: 正在上传中, removed: 已删除
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

  // 定义onChange函数，更新detail值
  const onEditorChange = (newDetail) => {
    setRecord((prevRecord) => ({
      ...prevRecord,
      detail: newDetail,
    }));
  };

  const onFinish = (values) => {
    // 1.收集数据,并封装成product对象
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

    // 如果是更新, 需要添加_id
    if (record._id) {
      product._id = record._id;
    }

    // 2.调用接口请求函数去添加/更新
    // reqAddOrUpdateProduct(product).then((response) => {
    //   if (response.status === 0) {
    //     message.success(`${record._id ? "更新" : "添加"}商品成功!`);
    //     history.goBack();
    //   } else {
    //     message.error(`${record._id ? "更新" : "添加"}商品失败!`);
    //   }
    // });
    // 2.调用接口请求函数去添加/更新
        reqAddOrUpdateProduct(product).then((response) => {
          if (response.status === 0) {
            message.success(`${record._id ? "更新" : "添加"}商品成功!`);
            history.goBack();
          } else {
            message.error(`${record._id ? "更新" : "添加"}商品失败!`);
          }
        }).catch((error) => {
          console.error(error);
          message.error('操作失败，发生异常！');
        });
  };

  const onFinishFailed = (errorInfo) => {
    // 通过record.detail获取最新的detail值
    console.log(record.detail);

    console.log("Failed:", errorInfo);
  };

  // 在Ant Design的Form组件中，自定义验证函数需要接收两个参数：rule和value。rule参数包含了你在rules数组中为该字段定义的规则，而value参数是用户输入的值。

  // 在你的checkPrice函数中，你并没有使用到rule参数，所以你可以使用占位符_来表示这个参数。这是一种常见的编程惯例，用来表示这个参数在函数体中并未被使用。

  // 如果你不使用占位符，你的函数将只接收一个参数，那么这个参数将会是rule，而不是value。这就是为什么你需要在checkPrice函数的参数列表中加入占位符_的原因。
  const checkPrice = (_, value) => {
    const numberValue = Number(value);
    if (numberValue > 0) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("Price must be greater than zero!"));
  };

  // 级联选择器
  const onChange = (value, selectedOptions) => {
    setParentId(value);
  };

  // 选择某个分类项时，加载下一级分类列表的回调函数
  // const filter = (inputValue, path) => {
  //   return path.some(
  //     (option) =>
  //       option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
  //   );
  // };

  // 这个公式是固定的，你只需要将它复制到你的代码中，然后将reqCategorys替换成你的请求函数即可。 慢慢在学识
  // 获取一级/二级分类列表
  // 1.第一步发送prarent =0 获取全部的一级分类, 2.map 来定义 value : c._id, 3. 使用promise.all 来获取二级分类数据.  4.使用forEach 来将二级分类数据添加到对应的一级分类项中
  // 5.使用setOptions 来更新状态
  // 这段代码的主要目的是获取一级和二级分类的数据，并将其格式化为Cascader组件所需的格式。

  // getCategorys函数首先通过reqCategorys函数发送一个异步请求，获取指定parentId的分类数据。

  // 如果请求成功（result.status === 0），则将返回的数据保存在categorys变量中。

  // 接下来，根据parentId的值来判断是获取一级分类还是二级分类。

  // 如果parentId为'0'，则表示获取一级分类。将每个分类项映射为一个对象，包含value（分类的id）、label（分类的名称）和isLeaf（表示是否为叶子节点，即没有子分类）属性。初始时，假设所有一级分类都有子分类，所以isLeaf设为false。

  // 然后，对每个一级分类项再次调用getCategorys函数，获取其二级分类数据。使用Promise.all等待所有的异步操作完成。

  // 当所有的二级分类数据都获取到后，遍历每个二级分类数据。如果某个一级分类没有二级分类（即subC.length === 0），则将其isLeaf属性设为true。否则，将其二级分类数据添加到其children属性中。

  // 最后，使用setOptions更新状态，保存所有的一级分类数据。

  // 如果parentId不为'0'，则表示获取二级分类。将每个分类项映射为一个对象，包含value、label和isLeaf属性。因为二级分类没有子分类，所以isLeaf设为true。然后返回这个数组。

  // 这样，无论何时调用getCategorys函数，都能获取到正确格式的分类数据，可以直接用于Cascader组件。

  const getCategorys = async (parentId = "0") => {
    const result = await reqCategorys(parentId);

    if (result.status === 0) {
      const categorys = result.data;
      if (parentId === "0") {
        // 如果是一级分类
        const categoryOptions = categorys.map((c) => ({
          value: c._id,
          label: c.name,
          isLeaf: false, // 先假设所有的一级分类都有子分类
        }));
        // 获取二级分类数据
        const subCategorys = await Promise.all(
          categoryOptions.map((c) => getCategorys(c.value))
        );
        // 将二级分类数据添加到对应的一级分类项中
        subCategorys.forEach((subC, index) => {
          if (subC.length === 0) {
            // 如果没有子分类
            categoryOptions[index].isLeaf = true; // 将 isLeaf 设置为 true
          } else {
            categoryOptions[index].children = subC;
          }
        });
        setOptions(categoryOptions);
      } else {
        // 如果是二级分类
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
        // categoryIds 如果有值，说明是更新页面，如果没有值，说明是添加页面
        categoryIds: record.categoryIds || [],

        // 其他字段的初始值...
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      {/* 商品名称 行 */}
      <Form.Item
        label="商品名称"
        name="name"
        rules={[
          {
            required: true,
            message: "必须填写商品名称!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      {/* 商品描述 */}
      <Form.Item
        label="商品描述"
        name="desc"
        rules={[
          {
            required: true,
            message: "必须填写商品描述!",
          },
        ]}
      >
        <TextArea rows={4} />
      </Form.Item>

      {/* 商品价格 */}
      <Form.Item
        label="商品价格"
        name="price"
        rules={[
          {
            validator: checkPrice,
          },
        ]}
      >
        <Input type="number" addonAfter="元" />
      </Form.Item>

      {/* 商品分类 */}
      <Form.Item
        label="商品分类"
        name="categoryIds"
        rules={[
          {
            required: true,
            message: "必须选择商品分类!",
          },
        ]}
      >
        <Cascader
          placeholder="请选择商品分类"
          options={options}
          onChange={onChange}
          onSearch={(value) => console.log(value)}
        ></Cascader>
      </Form.Item>

      {/* 图片上传 */}
      <Form.Item label="图片上传" name="imgs">
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

      {/* 商品html文本 */}
      <Form.Item
        label="商品详情"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 24 }}
        // 提交表单时，会将富文本编辑器中的内容转换为html格式的文本，然后提交给后台
        name="detail"
        // 必须填写
        rules={[
          {
            required: true,
            message: "必须填写商品详情!",
          },
        ]}
      >
        {/* <RichTextEditor  ref={editorRef} /> */}
        {/* // 引入富文本编辑器 和加上ref={editorRef} 用来获取富文本编辑器中的内容  但是这样会报错 */}
        <RichTextEditor
          ref={editorRef}
          detail={detail}
          onChange={onEditorChange}
        />
      </Form.Item>

      {/* 提交按钮 */}
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
