import { memo } from "react"
import ReactMarkdown, { Options } from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
// 引入代码高亮风格，详细可看：https://github.com/react-syntax-highlighter/react-syntax-highlighter/tree/master/src/styles/prism
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism"

function Markdown({ children, className = "", ...props }: Options) {
    return (
        <ReactMarkdown
            // 语法高亮组件，详细可看：https://github.com/remarkjs/react-markdown?tab=readme-ov-file#use-custom-components-syntax-highlight
            components={{
                code({ node, className, children, ...props }) {
                    //github 实例里面的列子是 react-markdown是8.0版本，目前直接安装已经是9.0的版本了，接口有改动
                    //所以这里改成了符合 react-markdown 9.0版本的写法
                    // 把 children 属性放标签里
                    const match = /language-(\w+)/.exec(className || "")
                    return match ? (
                        <SyntaxHighlighter
                            style={tomorrow}
                            language={match?.[1] ?? ""} // 无论代码语言都显示
                            PreTag='div'
                        >
                            {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                    ) : (
                        <code
                            {...props}
                            className={className}
                        >
                            {children}
                        </code>
                    )
                }
            }}
            // 支持 markdown 中的表格语法，支持超链接链接
            remarkPlugins={[remarkGfm]}
            className={`text-base markdown prose dark:prose-invert ${className}`}
            {...props}
        >
            {children}
        </ReactMarkdown>
    )
}

// memo 用于避免重复渲染，只有参数改变时才会重新渲染
// 一般父组件发生渲染，子组件也会重新渲染
export default memo(Markdown)
