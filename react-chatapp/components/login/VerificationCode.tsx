import { useEffect, useRef } from 'react';

export default function VerificationCode({ setCode, formType }: { setCode: Function, formType: string }) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    // 生成随机数
    useEffect(() => {
        setCode('')
        again()
    }, [formType]);

    // 重新绘制图片
    function again() {
        const code = generateRandomCode();
        drawCode(code);
    }

    // 随机数，用于生成随机色值和大小
    function randomNum(min: number, max: number) {
        return parseInt(String(Math.random() * (max - min) + min))
    }

    // 随机颜色
    function randomColor(min: number, max: number) {
        const r = randomNum(min, max)
        const g = randomNum(min, max)
        const b = randomNum(min, max)
        return `rgb(${r},${g},${b})`
    }

    // 生成4位随机数
    function generateRandomCode() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
        let code = '';
        for (let i = 0; i < 4; i++) {
            code += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        return code;
    };

    // 填充矩形，设置圆角，作为验证码的背景
    function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();
    }

    // 绘制图片
    function drawCode(code: string) {
        const canvas = canvasRef.current;
        // 获取 canvas 的 2D 上下文
        const ctx = canvas?.getContext('2d');
        if (ctx) {
            let imgCode = ''
            // 设置背景颜色为随机生成的颜色
            ctx.fillStyle = randomColor(180, 230)
            // 填充矩形，作为验证码的背景
            // ctx.fillRect(0, 0, 120, 32)
            roundRect(ctx, 0, 0, 120, 32, 5);
            for (let i = 0; i < 4; i++) {
                const text = code[i]
                imgCode += text
                // 随机生成字符的字体大小
                const fontSize = randomNum(18, 40)
                // 旋转角度
                const deg = randomNum(-30, 30)
                // 设置字体样式，使用 Simhei 字体
                ctx.font = fontSize + 'px Simhei'
                // 设置文本基线为顶部
                ctx.textBaseline = 'top'
                // 设置填充颜色为随机生成的颜色
                ctx.fillStyle = randomColor(80, 150)
                // 保存当前状态
                ctx.save()
                // 移动到字符绘制位置，每个字符之间间隔 30 像素
                ctx.translate(30 * i + 15, 15)
                // 旋转 canvas
                ctx.rotate(deg * Math.PI / 180)
                // 在指定位置绘制字符，调整位置以居中
                ctx.fillText(text, -10, -15)
                // 恢复到之前保存的状态
                ctx.restore()
            }
            setCode(imgCode);
        }
    }

    return (
        <>
            <div className='pt-[6px] pl-5'>
                <canvas width="120" height="32" ref={canvasRef} onClick={again}></canvas>
            </div>
        </>
    );
}