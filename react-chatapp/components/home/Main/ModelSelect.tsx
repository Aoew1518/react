// import { useAppContext } from "@/components/AppContext"
// import { ActionType } from "@/reducers/AppReducer"
import { PiLightningFill, PiShootingStarFill } from "react-icons/pi"
import { GiWhaleTail } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux"
import { setCurrentModel } from "@/store/modules/mainStore"
import { message } from "antd";
import { useIsMobile } from "@/util/devices"
import React from "react";
import { deepseekMattingBase64 } from "@/public/images/deepseek"

interface Model {
    id: string;
    name: string;
    icon: React.ReactNode | React.ComponentType | any;
}

// 模型切换内容
export default function ModelSelect() {
    const models: Model[] = [
        {
            id: "deepseek-chat",
            name: "DeepSeek",
            icon: () => (<img src={deepseekMattingBase64} alt="DeepSeek" className="w-4 h-4"/>)
        },
        {
            id: "gpt-35-turbo",
            name: "GPT-3.5",
            icon: PiLightningFill
        },
        {
            id: "GPT-4",
            name: "GPT-4",
            icon: PiShootingStarFill
        }
    ]
    const isMobile = useIsMobile()
    const [messageApi, contextHolder] = message.useMessage();
    const { currentModel } = useSelector((state: any) => state.mainStore)
    const dispatch = useDispatch();

    function handleModelChange(model: any) {
        dispatch(setCurrentModel(model.id))
    }

    return (
        <>
            {contextHolder}
            <div className={`fixed top-[50px] flex justify-between items-center bg-gray-100 dark:bg-gray-900 p-1 rounded-xl`}>
                {models.map((item) => {
                    const model = currentModel === 'deepseek-reasoner' ? 'deepseek-chat' : currentModel
                    const selected = item.id === model
                    return (
                        <button
                            key={item.id}
                            onClick={() => {
                                handleModelChange(item)
                            }}
                            className={`group hover:text-gray-900 hover:dark:text-gray-100 flex justify-center items-center space-x-2 py-2.5 text-sm font-medium border rounded-lg ${selected
                                ? "border-gray-200 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                : "border-transparent text-gray-500"
                                } ${isMobile ? 'min-w-[105px]' : 'w-[148px]'} `}
                        >
                            <span
                                className={`group-hover:text-[#26cf8e] transition-colors duration-100 ${selected ? "text-[#26cf8e]" : ""
                                    }`}
                            >
                                <item.icon />
                            </span>
                            <span className='transition-colors duration-100'>
                                {item.name}
                            </span>
                        </button>
                    )
                })}
            </div>
        </>
    )
}
