// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }

module.exports = {
  // purge: {
  //   content: ["./src/**/*.jsx", "./index.html"],//  css 优化 保留值需要的文件被定义的目录
  // },
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // 根据你的项目结构调整路径
  ],
  darkMode: "false", // or 'media' or 'class'   // fales 静止  media根据系统   class 在标签内定义 class="dark"
  theme: {


    
    // 在原定breakpoints 上在添加2个
    screen:{
      tablet:'960px',
      desktop:'1248px',
    },
    extend: {
      colors: {
        brand: {
          light: "#3fbaeb",
          DEFAULT: "#0fa9e6", //直接用brand就可以引用
          dark: "#0c87b8",
        },
      },
      fontFamily: {
        headline: "Poppins, sans-serif", // 预设首选字体和后备字体
      },
    },
  },
  plugins: [],
}