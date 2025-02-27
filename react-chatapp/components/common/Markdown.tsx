import { useState, memo } from "react"
import ReactMarkdown, { Options } from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
// 引入代码高亮风格，详细可看：https://github.com/react-syntax-highlighter/react-syntax-highlighter/tree/master/src/styles/prism
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism"
import { message } from "antd";
import { useDispatch } from "react-redux";
import MessageFunction from "@/components/home/Main/MessageFunction"
import eventBus from "@/store/eventBus";

interface MarkdownProps extends Options {
    messageId?: string;
    isAssistant?: boolean;
    isShowFunction?: boolean;
}

function Markdown({ children, className = "", messageId = "", isAssistant = false, isShowFunction = false, ...props }: MarkdownProps) {
    const dispatch = useDispatch();
    const [messageApi, contextHolder] = message.useMessage();
    const [messageContent, setMessageContent] = useState<string>(String(children).replace(/\n$/, ""));
    // const { streamingId } = useSelector((state: any) => state.mainStore);

    // 复制代码块
    function copyToClipboard(text: string) {
        navigator.clipboard.writeText(text).then(() => {
            messageApi.success("Copy code successfully!");
        });
    };

    // 复制全部
    function copyAll() {
        navigator.clipboard.writeText(messageContent).then(() => {
            messageApi.success("Copy all successfully!");
        })
            .catch(err => {
                messageApi.error("copy all failed!");
                console.error('copy all failed: ', err);
            });
    }

    // 编辑消息并复制到输入框中
    function editMessage() {
        eventBus.publish("setInputMessage", messageContent)
        messageApi.success("已编辑到输入框中！");
    }

    // 重新发送消息
    function reSendMessage() {
        eventBus.publish("reSendMessage", messageId);
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
            <MessageFunction
                isAssistant={isAssistant}
                isShowFunction={isShowFunction}
                copyAll={copyAll}
                editMessage={editMessage}
                reSendMessage={reSendMessage}
            />
        </>
    )
}

// memo 用于避免重复渲染，只有参数改变时才会重新渲染
// 一般父组件发生渲染，子组件也会重新渲染
export default memo(Markdown)
