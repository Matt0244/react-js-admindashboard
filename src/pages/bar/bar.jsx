import React, { useState } from "react";
import ReactECharts from "echarts-for-react";
import "./index.css";
import { Button, Switch, Space } from "antd";
import "echarts/theme/dark";

function Bar() {
  const [sales, setSales] = useState([5, 20, 36, 10, 10, 20]);
  const [stock, setStock] = useState([15, 60, 66, 50, 50, 60]);
  const [darkMode, setDarkMode] = useState("day");

  const handleDoubleSales = () => {
    const updatedStock = sales.map((sale) => sale * 2);
    //  1. // const updatedStock =  stock.forEach(sk => updatedStock.push(sk + 10));

    //  2. // for (let i = 0; i < stock.length; i++) {
    //   updatedStock.push(stock[i] + 10);
    // }

    //  3. // const updatedStock = stock.reduce((acc, sk) => {
    //   acc.push(sk + 10);
    //   return acc;
    // }, []);

    //  4. // const updatedStock = stock.reduce((stock, sk) => [...stock, sk + 10], []);

    setSales(updatedStock);
  };

  const handleAddStock = () => {
    const addStock = stock.map((sk) => sk + 10);
    setStock(addStock);
  };

  const option = {
    title: {
      text: "ECharts Introductory Example",
    },
    tooltip: {},
    legend: {
      data: ["Sales"],
    },
    xAxis: {
      data: ["Shirt", "Woolen Sweater", "Chiffon Shirt", "Pants", "High Heels", "Socks"],
    },
    yAxis: {},
    series: [
      {
        name: "Sales",
        type: "bar",
        data: sales,
      },
      {
        name: "Stock",
        type: "bar",
        data: stock,
      },
    ],
  };

  const onChange = (checked) => {
    const mode = checked ? "day" : "dark";
    setDarkMode(mode);
    console.log(`switch to ${checked}`);
    console.log(darkMode)
  };

  return (
    <div className="bk-white">
      <Space direction="vertical">
        <Switch
          checkedChildren="Day"
          unCheckedChildren="Night"
          defaultChecked
          onChange={onChange}
        />
      </Space>
      <ReactECharts
        theme={darkMode}
        option={option}
        style={{ height: "400px" }} // Add unit 'px'
        opts={{ renderer: "svg" }}
      />

      <Button type="primary" onClick={() => handleDoubleSales(sales)}>
        Crazy Sales
      </Button>

      <Button onClick={() => handleAddStock(stock)}> Add 10 Stock</Button>
    </div>
  );
}

export default Bar;