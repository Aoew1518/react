# react 记帐本项目
## 1.开发依赖
1.Redux状态管理
```npm install @reduxjs/toolkit react-redux```
2.路由-react-router-dom
```npm install react-router-dom```
3.时间处理-dayjs
```npm install dayjs```
4.class类名处理-classnames
```npm install classnames```
5.移动端组件库-antd-mobile
```npm install antd-mobile```
6.请求插件-axios
```npm install axios```
7.数据mock，使用 -D 标志时，表示该依赖仅在开发环境中使用，而不需要在生产环境中存在。
```npm install -D json-server```

## 2.配置别名路径
> 1. 路径解析配置（webpack），把 @/ 解析为 src/，设置vite.cofig.js
> 2. 路径联想配置（VsCode），VsCode 在输入 @/ 时，自动联想出来对应的 src/下的子级目录，设置jsconfig.json

## 3.mock数据
> 1. 使用json-server创建一个本地服务器，用于模拟后端接口
> 2. 在项目根目录下创建一个data.json文件，用于存储模拟的数据
> 3. 在package.json文件中添加一个 server 脚本命令，用于启动 json-server 服务器
```"server": "json-server ./server/data.json --port 8888"```
> 4. 在项目中使用axios发送请求，获取模拟的数据

## 4.路由懒加载
> 1. 使用React.lazy函数将组件包装起来，返回一个React组件
> 2. 使用React.Suspense组件包裹懒加载的组件，设置fallback属性，用于在组件加载过程中显示一个加载中的提示
> 3. 在路由配置中使用React.lazy函数加载组件，设置exact属性，用于精确匹配路由

