// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }

module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // 根据你的项目结构调整路径
  ],
  theme: {
    // 在原定breakpoints 上在添加2个
    screen:{
      tablet:'960px',
      desktop:'1248px',
    },
    extend: {
      backgroundColor: ["active"],
    },
  },
  plugins: [],
}