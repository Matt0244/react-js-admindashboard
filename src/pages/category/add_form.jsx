import React from 'react'
import Categorys from './category';

import { Form,Select,Input } from "antd";



export default function Add_form() {
    const Item = Form.Item
    const Option = Select.Option


    

  return (
    <Form>
        <Item>
        <Select>
        {/* get categorys from catagory.jsx  */}
            <Option value="0">0</Option>
            <Option value="1">1</Option>
            <Option value="2">2</Option>
            <Option value="3">3</Option>
        
            </Select>
            <input placeholder='input name' type="text" />
            </Item>
    </Form> 
  )
}
