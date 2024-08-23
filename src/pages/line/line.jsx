import React from "react";
import ReactECharts from "echarts-for-react";
import "./line.css";


function Line() {
  const data2024 = [
    18.04, 10.04, 9.17, 9.16, 6.39, 3.91, 2.21, 2.18, 2.03, 1.79, 1.72, 1.63,
    1.46, 1.28, 1.28, 1.28, 1.21, 1.13, 1.11, 1.09,
  ];
  const data2023 = [
    13.33, 10.63, 11.41, 10.32, 7.04, 3.29, 1.53, 2.63, 1.16, 1.04, 1.05, 0.8,
    1.27, 0.89, 0.91, 0.91, 1.34, 0.69, 0.92, 1.22,
  ];
  const languages = [
    "Python",
    "C++",
    "C",
    "Java",
    "C#",
    "JavaScript",
    "SQL",
    "Visual Basic",
    "Go",
    "Fortran",
    "MATLAB",
    "Delphi/Object Pascal",
    "PHP",
    "Rust",
    "Ruby",
    "Swift",
    "Assembly Language",
    "Kotlin",
    "R",
    "Scratch",
  ];

  const option1 = {
    title: {
      text: "2024 vs 2023 (1-10)",
    },
    toolbox: {
      feature: {
        // saveAsImage: {},
        // dataZoom: {},
        // restore: {},
      },
    },
    tooltip: {},
    legend: {
      data: ["2024", "2023"],
    },
    xAxis: {
      data: languages.slice(0, 10),
      axisLabel: {
        rotate: 20, // 旋转标签
        interval: 0, // 显示所有标签
      },
    },
    yAxis: {},
    series: [
      {
        name: "2024",
        type: "line",
        data: data2024.slice(0, 10),
      },
      {
        name: "2023",
        type: "line",
        data: data2023.slice(0, 10),
      },
    ],
  };

  const option2 = {
    title: {
      text: "2024 vs 2023 (11-20)",
    },
    toolbox: {
      feature: {
        // saveAsImage: {},
        // dataZoom: {},
        // restore: {},
      },
    },
    tooltip: {},
    legend: {
      data: ["2024", "2023"],
    },
    xAxis: {
      data: languages.slice(10, 20),
      axisLabel: {
        rotate: 20, // 旋转标签
        interval: 0, // 显示所有标签
      },
    },
    yAxis: {},
    series: [
      {
        name: "2024",
        type: "line",
        data: data2024.slice(10, 20),
      },
      {
        name: "2023",
        type: "line",
        data: data2023.slice(10, 20),
      },
    ],
  };

  return (
    <div className="bgc">
      <div >- Programming Language Rankings (1-10) -</div>
      <ReactECharts
        option={option1}
        style={{ height: 400, width: "100%" }}
      />
      <div>- Programming Language Rankings (11-20) -</div>
      <ReactECharts
        option={option2}
        style={{ height: 400, width: "100%" }}
      />
    </div>
  );
}

export default Line;