import { MdOutlineTipsAndUpdates } from "react-icons/md"
import examples from "@/data/examples.json"
import Button from "@/components/common/Button"
import { useMemo, useState } from "react"

// 可选择事例
export default function Example() {
    // 是否显示全部状态
    const [showFull, setShowFull] = useState(false)

    const list = useMemo(() => {
        if (showFull) {
            return examples
        }
        else {
            return examples.slice(0, 15)
        }
    }, [showFull])

    return (
        // 需要返回多组件但不想返回多余父元素
        <>
            <div className='mt-20 mb-4 text-4xl'>
                <MdOutlineTipsAndUpdates />
            </div>
            <ul className='flex justify-center flex-wrap gap-3.5'>
                {list.map((item) => {
                    return (
                        <li key={item.act}>
                            <Button>{item.act}</Button>
                        </li>
                    )
                })}
            </ul>
            {/* 显示全部按钮 */}
            {!showFull && (
                <>
                    <p className='p-2'>...</p>
                    <div className='flex items-center w-full space-x-2'>
                        <hr className='flex-1 border-t border-dotted border-gray-200 dark:border-gray-600' />
                        <Button
                            variant='text'
                            onClick={() => {
                                setShowFull(true)
                            }}
                        >
                            显示全部
                        </Button>
                        <hr className='flex-1 border-t border-dotted border-gray-200 dark:border-gray-600' />
                    </div>
                </>
            )}
        </>
    )
}
