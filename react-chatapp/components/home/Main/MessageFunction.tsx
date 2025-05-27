import { Button, Tooltip } from "antd"
import { LuCopy } from "react-icons/lu";
import { RxReload } from "react-icons/rx";
import { FiEdit } from "react-icons/fi";
import { useTranslation } from 'react-i18next';

interface MessageFunctionProps {
    copyAll: () => void;
    editMessage: () => void;
    reSendMessage: () => void;
    isAssistant?: boolean;
    isShowFunction?: boolean;
}

export default function MessageFunction({ copyAll, editMessage, reSendMessage, isAssistant = false, isShowFunction = false }: MessageFunctionProps) {
    const { t } = useTranslation();

    return (
        <>
            <div
                className={`${isShowFunction ? "" : "hidden"} ${isAssistant ? "absolute" : "absolute right-0"} bottom-[-35px]`}
            >
                <Tooltip placement="top" title={t("copy")}>
                    <Button
                        type="text"
                        className="w-[32px] h-[28px] !p-1 mr-1 dark:hover:!bg-gray-600"
                        onClick={copyAll}
                    >
                        <LuCopy className="text-xl dark:text-white opacity-50" />
                    </Button>
                </Tooltip>
                {isAssistant ? (
                    <Tooltip placement="top" title={t('regenerateBtn')}>
                        <Button
                            type="text"
                            className="w-[32px] h-[28px] !p-1 mr-1 dark:hover:!bg-gray-600"
                            onClick={reSendMessage}
                        >
                            <RxReload className="text-xl dark:text-white opacity-50" />
                        </Button>
                    </Tooltip>
                ) : (
                    <Tooltip placement="top" title={t('editMessage')}>
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