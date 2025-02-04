"use client"

// import { useAppContext } from "@/components/AppContext"
import Button from "@/components/common/Button"
import { ActionType } from "@/reducers/AppReducer"
import { LuPanelLeftOpen } from "react-icons/lu";
import { useDispatch, useSelector } from 'react-redux';
import { setIsShowNav } from "@/store/modules/navStore"

export default function Menu() {
    // const {
    //     state: { displayNavigation },
    //     dispatch
    // } = useAppContext()
    const dispatch = useDispatch();
    const { isShowNav } = useSelector((state: any) => state.navStore);
    return (
        // <Button
        //     icon={LuPanelLeftOpen}
        //     className={`${
        //         displayNavigation ? "hidden" : ""
        //     } fixed left-2 top-2`}
        //     variant='outline'
        //     onClick={() => {
        //         dispatch({
        //             type: ActionType.UPDATE,
        //             field: "displayNavigation",
        //             value: true
        //         })
        //     }}
        // />
        <Button
            icon={LuPanelLeftOpen}
            className={`${
                isShowNav ? "opacity-0 pointer-events-none" : "opacity-100"
            } fixed left-2 top-2`}
            variant='outline'
            onClick={() => dispatch(setIsShowNav(true))}
        />
    )
}
