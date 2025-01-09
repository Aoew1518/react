# 仿 chatgpt 大模型对话项目
## react 18 + next
 - 通过 page + layout 来实现页面布局和路由跳转
 - App router
 - tailwindcss
 - react-icons
 - react-redux
 - react-textarea-autosize 输入框自适应高度
 - react-markdown 渲染 markdown 内容组件
 - remark-gfm 支持 markdown 中的表格语法，支持超链接跳转
 - react-syntax-highlighter 代码高亮
    - 支持 ts：npm i --save-dev @types/react-syntax-highlighter
 - uuid 生成唯一 id

##  启动项目
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
