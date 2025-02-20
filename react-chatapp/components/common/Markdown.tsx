import { memo } from "react"
import ReactMarkdown, { Options } from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
// 引入代码高亮风格，详细可看：https://github.com/react-syntax-highlighter/react-syntax-highlighter/tree/master/src/styles/prism
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism"
import { message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { ReloadOutlined, CopyOutlined } from '@ant-design/icons';
import { Button, Tooltip } from "antd"

interface MarkdownProps extends Options {
    isAssistant?: boolean;
    isShowFunction?: boolean;
}

function Markdown({ children, className = "", isAssistant = false, isShowFunction = false, ...props }: MarkdownProps) {
    const [messageApi, contextHolder] = message.useMessage();
    const { streamingId } = useSelector((state: any) => state.mainStore);

    function copyToClipboard(text: string) {
        navigator.clipboard.writeText(text).then(() => {
            messageApi.success("复制成功！");
        });
    };

    function copyAll() {
        const messageContent = String(children).replace(/\n$/, "");
        navigator.clipboard.writeText(messageContent).then(() => {
            messageApi.success("复制成功！");
        }).catch(err => {
            console.error('复制失败: ', err);
        });
    }

    return (
        <>
            {contextHolder}
            <ReactMarkdown
                // 语法高亮组件，详细可看：https://github.com/remarkjs/react-markdown?tab=readme-ov-file#use-custom-components-syntax-highlight
                components={{
                    code({ node, className, children, ...props }) {
                        //github 实例里面的列子是 react-markdown是8.0版本，目前直接安装已经是9.0的版本了，接口有改动
                        //所以这里改成了符合 react-markdown 9.0版本的写法
                        // 把 children 属性放标签里
                        const match = /language-(\w+)/.exec(className || "")
                        const codeString = String(children).replace(/\n$/, "");

                        return (match ? (
                            <div className="relative">
                                {/* 显示代码语言和复制按钮 */}
                                <div className="flex justify-between items-center px-3 py-1 bg-gray-500">
                                    <div className="text-sm text-white">
                                        {match[1]}
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(codeString)}
                                        className="p-1 text-white text-sm bg-gray-500 rounded-[5px] hover:bg-gray-600"
                                    >
                                        Copy
                                    </button>
                                </div>
                                <SyntaxHighlighter
                                    style={tomorrow}
                                    className="!m-0"
                                    language={match?.[1] ?? ""} // 无论代码语言都显示
                                    PreTag='div'
                                >
                                    {String(children).replace(/\n$/, "")}
                                </SyntaxHighlighter>
                            </div>
                        ) : (
                            <code
                                {...props}
                                className={className}
                            >
                                {children}
                            </code>
                        ))
                    }
                }}
                // 支持 markdown 中的表格语法，支持超链接链接
                remarkPlugins={[remarkGfm]}
                className={`user-message-style text-base markdown prose dark:prose-invert ${className}`}
                {...props}
            >
                {children}
            </ReactMarkdown>
            {(
                <div
                    className={`${isAssistant && isShowFunction ? "" : "hidden"} absolute bottom-[-15px]`}
                >
                    <Tooltip placement="top" title="Copy">
                        <Button
                            type="text"
                            className="w-[28px] h-[28px] p-1 mr-2 dark:hover:!bg-gray-600"
                            onClick={copyAll}
                        >
                            <CopyOutlined
                                className="text-xl dark:text-white opacity-50"
                            />
                        </Button>
                    </Tooltip>

                    <Tooltip placement="top" title="Reload">
                        <Button
                            type="text"
                            className="w-[28px] h-[28px] p-1 dark:hover:!bg-gray-600"
                        >
                            <ReloadOutlined
                                className="text-xl dark:text-white opacity-50"
                            />
                        </Button>
                    </Tooltip>
                </div >
            )}
        </>
    )
}

// memo 用于避免重复渲染，只有参数改变时才会重新渲染
// 一般父组件发生渲染，子组件也会重新渲染
export default memo(Markdown)
