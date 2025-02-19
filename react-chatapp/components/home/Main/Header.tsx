"use client"
import Button from "@/components/common/Button"
import { HiMenuAlt1 } from "react-icons/hi";
import { TbMessageCirclePlus } from "react-icons/tb";
import { useDispatch, useSelector } from 'react-redux'
import { setIsShowNav } from '@/store/modules/navStore'
import { setSelectedChat, setMessageList, setSelectedChatTitle } from '@/store/modules/mainStore'
import { useIsMobile } from "@/util/devices"
import { useEffect } from "react";

export default function Menu() {
    const dispatch = useDispatch();
    const isMobile = useIsMobile();
    const { selectedChat, selectedChatTitle } = useSelector((state: any) => state.mainStore);

    useEffect(() => {
        if (selectedChat === null) {
            dispatch(setSelectedChatTitle(''));
        }
    }, [selectedChat]);

    function clearMessageAndChat() {
        dispatch(setMessageList([]))
        dispatch(setSelectedChat(null))
    }

    return (
        <>
            <div>
                <div
                    className={`${!isMobile ? "justify-center" : "justify-between"} flex items-center flex-row w-full h-[50px] z-50 bg-white dark:text-white dark:bg-gray-800`}
                >
                    <Button
                        icon={HiMenuAlt1}
                        className={`${!isMobile ? "hidden" : ""} ml-2`}
                        iconClassName="!text-2xl"
                        variant='text'
                        onClick={() => { dispatch(setIsShowNav(true)) }}
                    />
                    <span className="text-lg font-bold">{selectedChatTitle || ""}</span>
                    <Button
                        icon={TbMessageCirclePlus}
                        className={`${!isMobile ? "hidden" : ""} mr-2`}
                        iconClassName="!text-2xl"
                        variant='text'
                        onClick={() => clearMessageAndChat()}
                    />
                </div>
                <div
                    className="absolute z-50 top-[50px] inset-x-0 bg-gradient-to-t from-[rgba(255,255,255,0)] from-[13.94%] to-[#fff] pt-8 dark:from-[rgba(53,55,64,0)] dark:to-[#272a39] dark:to-[95.85%]"
                />
            </div>
        </>
    )
}
