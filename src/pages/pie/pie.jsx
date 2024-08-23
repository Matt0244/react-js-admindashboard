import React, { useEffect, useState } from "react";
import { reqPollution } from "../../api";
import ReactECharts from "echarts-for-react";
import "./pie.css";



function Pie() {
  const [pollutionData, setPollutionData] = useState({});

  const getOption = (data) => ({
    title: {
      text: "Adelade Air Pollution Of Today",
      subtext: "Live Data",
      x: "center",
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b} : {c} ({d}%)",
    },
    legend: {
      orient: "vertical",
      left: "left",
      data: Object.keys(data),
    },
    series: [
      {
        name: "Pollution Components",
        type: "pie",
        radius: "70%",
        center: ["50%", "60%"],
        data: Object.entries(data).map(([key, value]) => ({
          value: value,
          name: key,
        })),
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  });

  useEffect(() => {
    const fetchPollutionData = () => {
      reqPollution().then((data) => {
        const plDetails = data.data.list[0].components;
        setPollutionData(plDetails);
        console.log(plDetails);
      });
    };

    // 立即调用一次
    fetchPollutionData();

    // 设置定时器
    const getPollution = setInterval(fetchPollutionData, 10000);

    return () => {
      clearInterval(getPollution);
    };
  }, []);

  return (
    <div className="chart-container">
      <ReactECharts
        option={getOption(pollutionData)}
        className="chart"
      />
    </div>
  );
}

export default Pie;