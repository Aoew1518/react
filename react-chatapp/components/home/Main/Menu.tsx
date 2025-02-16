"use client"
import Button from "@/components/common/Button"
import { HiMenuAlt1 } from "react-icons/hi";
import { TbMessageCirclePlus } from "react-icons/tb";
import { useSelector, useDispatch } from 'react-redux'
import { setIsShowNav, setIsShowMaskNav } from '@/store/modules/navStore'
import { setSelectedChat } from '@/store/modules/mainStore'

export default function Menu() {
    const dispatch = useDispatch();
    const { isShowNav, isShowMaskNav } = useSelector((state: any) => state.navStore)

    return (
        <>
            <div
                className={`${(!isShowMaskNav) ? "hidden" : ""
                } fixed flex justify-between items-center flex-row w-full h-[50px] z-50 bg-white dark:text-white dark:bg-gray-800`}
            >
                <Button
                    icon={HiMenuAlt1}
                    className="ml-2"
                    iconClassName="!text-2xl"
                    variant='text'
                    onClick={() => { dispatch(setIsShowNav(true)) }}
                />
                <span className="text-lg font-bold">标题</span>
                <Button
                    icon={TbMessageCirclePlus}
                    className="mr-2"
                    iconClassName="!text-2xl"
                    variant='text'
                    onClick={() => dispatch(setSelectedChat(null))}
                />
            </div>
        </>
    )
}
