// import { useAppContext } from "@/components/AppContext"
import Button from "@/components/common/Button"
// import { ActionType } from "@/reducers/AppReducer"
import { HiPlus } from "react-icons/hi"
import { LuPanelLeftClose } from "react-icons/lu";
import { useDispatch } from 'react-redux';
import {
    setSelectedChat
} from '@/store/modules/mainStore'
import { setIsShowNav } from "@/store/modules/navStore"

export default function Menubar() {
    // const { dispatch } = useAppContext()
    const dispatch = useDispatch();

    return (
        <div className='flex space-x-3'>
            <Button
                icon={HiPlus}
                variant='outline'
                className='flex-1'
                onClick={() => dispatch(dispatch(setSelectedChat(null)))}
            >
                新建对话
            </Button>
            <Button
                icon={LuPanelLeftClose}
                variant='outline'
                onClick={() => 
                    // dispatch({
                    //     type: ActionType.UPDATE,
                    //     field: "displayNavigation",
                    //     value: false
                    // })
                    dispatch(setIsShowNav(false))
                }
            />
        </div>
    )
}
