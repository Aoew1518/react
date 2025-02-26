import { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Tooltip, message } from "antd"
import { LuCopy } from "react-icons/lu";
import { RxReload } from "react-icons/rx";
import { FiEdit } from "react-icons/fi";
interface MessageFunctionProps {
    copyAll: () => void;
    editMessage: () => void;
    isAssistant?: boolean;
    isShowFunction?: boolean;
}

export default function MessageFunction({ copyAll, editMessage, isAssistant = false, isShowFunction = false }: MessageFunctionProps) {

    return (
        <>
            {/* {contextHolder} */}
            <div
                className={`${isShowFunction ? "" : "hidden"} ${isAssistant ? "absolute" : "absolute right-0"} bottom-[-35px]`}
            >
                <Tooltip placement="top" title="Copy">
                    <Button
                        type="text"
                        className="w-[32px] h-[28px] !p-1 mr-1 dark:hover:!bg-gray-600"
                        onClick={copyAll}
                    >
                        <LuCopy className="text-xl dark:text-white opacity-50" />
                    </Button>
                </Tooltip>
                {isAssistant ? (
                    <Tooltip placement="top" title="Reload">
                        <Button
                            type="text"
                            className="w-[32px] h-[28px] !p-1 mr-1 dark:hover:!bg-gray-600"
                        >
                            <RxReload className="text-xl dark:text-white opacity-50" />
                        </Button>
                    </Tooltip>
                ) : (
                    <Tooltip placement="top" title="Edit Message">
                        <Button
                            type="text"
                            className="w-[32px] h-[28px] !p-1 mr-1 dark:hover:!bg-gray-600"
                            onClick={editMessage}
                        >
                            <FiEdit className="text-xl dark:text-white opacity-50" />
                        </Button>
                    </Tooltip>
                )}
            </div >
        </>
    )
}