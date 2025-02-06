# 仿 chatgpt 大模型对话项目

## react 18 + next

- 通过 page + layout 来实现页面布局和路由跳转
- App router: 将 antd 首屏样式按需抽离并植入到 HTML 中，以避免页面闪动的情况
  - antd: npm install @ant-design/nextjs-registry --save
- tailwindcss
- react-icons
- react-redux
- react-textarea-autosize 输入框自适应高度
- react-markdown 渲染 markdown 内容组件
- remark-gfm 支持 markdown 中的表格语法，支持超链接跳转
- react-syntax-highlighter 代码高亮
  - 支持 ts：npm i --save-dev @types/react-syntax-highlighter
- uuid 生成唯一
- prisma 实现数据库操作
- openai
  - azure
  - DeepSeek: <https://api-docs.deepseek.com/zh-cn/>
- 登陆注册：
  - bcryptjs：npm i --save-dev @types/bcryptjs
  - jwt：npm install jsonwebtoken --save-dev @types/jsonwebtoken

## 启动项目

npm run dev

## 引入示例

### markdown 包

```javascript
import ReactMarkdown, { Options } from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
// 引入代码高亮风格，详细可看：https://github.com/react-syntax-highlighter/react-syntax-highlighter/tree/master/src/styles/prism
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism"
```

```shell
npm i react-markdown remark-gf react-syntax-highlighter
npm npm i --save-dev @types/react-syntax-highlighter
```

### uuid 包

```javascript
import { v4 as uuidv4 } from "uuid"
```

```shell
npm i uuid
npm i --save-dev @types/uuid
```

### prisma 实现数据库操作

```javascript
import { v4 as uuidv4 } from "uuid"
```

```shell
# 详细可看文档：https://www.prisma.io/docs/getting-started/quickstart-sqlite

# 安装
npm install prisma --save-dev
# 初始化
npx prisma init
# 生成数据库
npx prisma migrate dev --name init
# 更新数据库
npx prisma migrate dev
# 清空数据库
npx prisma migrate reset
# 使用 sqlite3 命令查看数据库
sqlite3 prisma/chatgpt-app.sqlite
# 或者使用 prisma 的可视化工具查看数据表
npx prisma studio
# 生成数据库客户端
npm i @prisma/client
# 生成数据库客户端代码（更新之前的配置文件等，可使用代码支持修改数据库）
npx prisma generate