import Example from "./Example"
import ModelSelect from "./ModelSelect"
import { useIsMobile } from "@/util/devices"
import { useTranslation } from 'react-i18next';

// 欢迎标题
export default function Welcome() {
    const isMobile  = useIsMobile()
    const { t } = useTranslation();

    return (
        <div className='w-full max-w-4xl mx-auto mb-[140px] flex flex-col items-center px-4 pt-5'>
            <ModelSelect />
                <h1
                    className={`${isMobile ? 'text-xl mt-10' : 'text-2xl mt-20'} font-bold`}
                >
                    {t('selfIntroduction')}
                </h1>
            <Example />
        </div>
    )
}
