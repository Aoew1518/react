import { Button } from 'antd';

export default function SwitchMode({ formType, switchMode }: { formType: string, switchMode: () => void }) {
    return (
        <div className="relative top-[-10px] text-center">
            {formType === 'login' ? (
                <>
                    {/* 切换到登录 */}
                    <span className='text-sm'>没有账号? </span>
                    <Button
                        type="link"
                        className='!px-0'
                        onClick={switchMode}
                    >
                        点此注册
                    </Button>
                </>
            ) : (
                <>
                    {/* 切换到注册 */}
                    <span className='text-sm'>已有账号? </span>
                    <Button
                        type="link"
                        className='!px-0'
                        onClick={switchMode} 
                        color="cyan"
                        variant="link"
                    >
                        点此登录
                    </Button>
                </>
            )}
        </div>
    )
}