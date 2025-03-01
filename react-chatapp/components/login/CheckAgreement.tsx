import { Checkbox } from 'antd';
import { memo } from 'react';

function CheckAgreement({ agree, setAgree }: { agree: boolean, setAgree: Function}) {

    return (
        <div className='relative text-center text-xs'>
            <Checkbox
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
            >
                我同意 <a href="/policy?itemKey=1">用户协议</a> 和 <a href="/policy?itemKey=2">隐私政策</a>
            </Checkbox>
        </div>
    )
}

export default memo(CheckAgreement)