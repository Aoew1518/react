import { Collapse } from 'antd';
import Markdown from "@/components/common/Markdown";

export default function DeepSeekMessage({ reasoningContent }: { reasoningContent: string }) {

    return (
        <>
            {/* 显示思维链内容 */}
            <Collapse
                size="small"
                items={[{
                    key: '1',
                    label: '已深度思考',
                    children: <Markdown>{reasoningContent}</Markdown>
                }]}
                defaultActiveKey={['1']}
                className="deepseek-content mb-3"
            />
        </>
    )
}