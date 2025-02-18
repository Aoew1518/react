import Button from "@/components/common/Button"
import { HiPlus } from "react-icons/hi"
import { LuPanelLeftClose } from "react-icons/lu";
import { useDispatch } from 'react-redux';
import { setSelectedChat, setMessageList } from '@/store/modules/mainStore'
import { setIsShowNav } from "@/store/modules/navStore"

export default function Menubar() {
    const dispatch = useDispatch();

    function clearMessageAndChat() {
        dispatch(setMessageList([]))
        dispatch(setSelectedChat(null))
    }

    return (
        <div className='flex space-x-3'>
            <Button
                icon={HiPlus}
                variant='outline'
                className='flex-1'
                onClick={() => clearMessageAndChat()}
            >
                新建对话
            </Button>
            <Button
                icon={LuPanelLeftClose}
                variant='outline'
                onClick={() => dispatch(setIsShowNav(false))}
            />
        </div>
    )
}
