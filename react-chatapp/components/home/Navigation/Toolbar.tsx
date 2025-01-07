// 侧边栏低部工具栏
// import { useAppContext } from "@/components/AppContext"
import Button from "@/components/common/Button"
import { ActionType } from "@/reducers/AppReducer"
import { MdLightMode, MdDarkMode, MdInfo } from "react-icons/md"
import { useDispatch, useSelector } from 'react-redux';
import { setThemeMode } from "@/store/modules/navStore"

export default function Toolbar() {
    // const {
    //     state: { themeMode },
    //     dispatch
    // } = useAppContext()
    const dispatch = useDispatch();
    const { themeMode } = useSelector((state: any) => state.navStore);
    return (
        <div className='absolute bottom-0 left-0 right-0 bg-gray-800 flex p-2 justify-between'>
            <Button
                icon={"dark" === "dark" ? MdDarkMode : MdLightMode}
                variant='text'
                onClick={() => {
                    // dispatch({
                    //     type: ActionType.UPDATE,
                    //     field: "themeMode",
                    //     value: themeMode === "dark" ? "light" : "dark"
                    // })
                    dispatch(setThemeMode(themeMode === "dark" ? "light" : "dark"))
                }}
            />
            <Button
                icon={MdInfo}
                variant='text'
            />
        </div>
    )
}
