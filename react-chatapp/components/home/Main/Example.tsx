import { MdOutlineTipsAndUpdates } from "react-icons/md"
import examples from "@/data/examples.json"
import Button from "@/components/common/Button"
import { useMemo, useState } from "react"
import eventBus from "@/store/eventBus"
import { useIsMobile } from "@/util/devices"
import { useTranslation } from 'react-i18next';
import { useSelector } from "react-redux";
import { message } from "antd";

// 可选择事例
export default function Example() {
    // 是否显示全部状态
    const [showFull, setShowFull] = useState(false)
    const isMobile = useIsMobile()
    const { t } = useTranslation();
    const { currentModel } = useSelector((state: any) => state.mainStore);
    const [messageApi, contextHolder] = message.useMessage();
    const list = useMemo(() => {
        if (isMobile) {
            // 移动端随机显示四个
            const startIndex = Math.floor(Math.random() * (examples.length - 4));
            return examples.slice(startIndex, startIndex + 4);
        }

        if (showFull && !isMobile) {
            return examples.slice(0, 30)
        }
        else {
            return examples.slice(0, 15)
        }
    }, [showFull])

    function handleClickExample(item: any) {
        if (currentModel === 'GPT-4' || currentModel === 'gpt-35-turbo') {
            messageApi.info({
                content: '该模型暂未开放，请选择deepseek-chat模型',
                duration: 2,
            })
            return
        }     
        eventBus.publish("createNewChat", item.prompt)
    }

    return (
        // 需要返回多组件但不想返回多余父元素
        <>
            {contextHolder}
            <div className='mt-20 mb-4 text-4xl'>
                <MdOutlineTipsAndUpdates />
            </div>
            <ul className='flex justify-center flex-wrap gap-3.5'>
                {list.map((item) => {
                    return (
                        <li key={item.act}>
                            <Button
                                onClick={() => {
                                    handleClickExample(item)
                                }}
                            >
                                {item.act}
                            </Button>
                        </li>
                    )
                })}
            </ul>
            {/* 显示全部按钮 */}
            {!isMobile && (
                <>
                    <p className='p-2'>{!showFull && '...'}</p>
                    <div className='flex items-center w-full space-x-2'>
                        <hr className='flex-1 border-t border-dotted border-gray-200 dark:border-gray-600' />
                        <Button
                            variant='text'
                            onClick={() => {
                                setShowFull(!showFull)
                            }}
                        >
                            {showFull ? t('collapseBtn') : t('showAllBtn')}
                        </Button>
                        <hr className='flex-1 border-t border-dotted border-gray-200 dark:border-gray-600' />
                    </div>
                </>
            )}
        </>
    )
}
