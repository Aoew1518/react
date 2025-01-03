import { NavBar, DatePicker } from 'antd-mobile'
import { useEffect, useState } from 'react'
import './index.scss'
import classNames from 'classnames'
import dayjs from 'dayjs'
import { useSelector } from 'react-redux'
import { useMemo } from 'react'
import _ from 'lodash'
import DailyBill from './components/DayBill'

const Month = () => {
    // 按月做数据的分组
    const billList = useSelector(state => state.bill.billList)
    // useMemo 类似vue的计算熟悉，会缓存数据，依赖数据变化的时候才会重新计算
    const monthGroup = useMemo(() => {
        // return出去计算之后的值
        return _.groupBy(billList, (item) => dayjs(item.date).format('YYYY-MM'))
    }, [billList])
    // 按照 年-月 的方式进行分组
    // console.log(monthGroup)

    // 控制弹框的打开和关闭
    const [dateVisible, setDateVisible] = useState(false)

    // 控制时间显示，初始化为当前时间
    const [currentDate, setCurrentDate] = useState(() => {
        return dayjs(new Date()).format('YYYY-MM')
    })

    // 当前月份的数据
    const [currentMonthList, setMonthList] = useState([])

    const monthResult = useMemo(() => {
        // 支出  /  收入  / 结余
        const pay = currentMonthList.filter(item => item.type === 'pay').reduce((a, c) => a + c.money, 0)
        const income = currentMonthList.filter(item => item.type === 'income').reduce((a, c) => a + c.money, 0)
        return {
            pay,
            income,
            total: pay + income
        }

    }, [currentMonthList])

    // 初始化的时候把当前月的统计数据显示出来
    useEffect(() => {
        const nowDate = dayjs().format('YYYY-MM')
        // 边界值控制
        if (monthGroup[nowDate]) {
            setMonthList(monthGroup[nowDate])
        }
    }, [monthGroup])

    // 确认回调
    const onConfirm = (date) => {
        setDateVisible(false)
        // 标准时间
        // console.log(date)
        const formatDate = dayjs(date).format('YYYY-MM')
        // 格式化时间
        // console.log(formatDate)
        setMonthList(monthGroup[formatDate]?.length > 0 ? monthGroup[formatDate] : [])
        setCurrentDate(formatDate)
    }

    // 当前月按照日来做分组
    const dayGroup = useMemo(() => {
        // return出去计算之后的值
        const groupData = _.groupBy(currentMonthList, (item) => dayjs(item.date).format('YYYY-MM-DD'))
        const keys = Object.keys(groupData)
        return {
            groupData,
            keys
        }
    }, [currentMonthList])

    return (
        <div className="monthlyBill">
            <NavBar className="nav" backArrow={false}>
                月度收支
            </NavBar>
            <div className="content">
                <div className="header">
                    {/* 时间切换区域 */}
                    <div className="date" onClick={() => setDateVisible(true)}>
                        <span className="text">
                            {currentDate + ''}月账单
                        </span>
                        {/* 思路：根据当前弹框打开的状态控制expand类名是否存在 */}
                        <span className={classNames('arrow', dateVisible && 'expand')}></span>
                    </div>
                    {/* 统计区域 */}
                    <div className='twoLineOverview'>
                        <div className="item">
                            <span className="money">{monthResult.pay.toFixed(2)}</span>
                            <span className="type">支出</span>
                        </div>
                        <div className="item">
                            <span className="money">{monthResult.income.toFixed(2)}</span>
                            <span className="type">收入</span>
                        </div>
                        <div className="item">
                            <span className="money">{monthResult.total.toFixed(2)}</span>
                            <span className="type">结余</span>
                        </div>
                    </div>
                    {/* 时间选择器 */}
                    <DatePicker
                        className="kaDate"
                        title="记账日期"
                        precision="month"
                        visible={dateVisible}
                        onCancel={() => setDateVisible(false)}
                        onConfirm={onConfirm}
                        onClose={() => setDateVisible(false)}
                        max={new Date()}
                    />
                </div>
                {/* 单日列表统计 */}
                {
                    // 存在 dayGroup 且 dayGroup.groupData[当前日期] 存在则渲染日账单
                    dayGroup && dayGroup.keys.length > 0 ? 
                    (dayGroup.keys.map(key => {
                        return <DailyBill key={key} date={key} billList={dayGroup.groupData[key]} />
                    }))
                    : <div className='noToDayData'>暂无该月数据</div>
                }
            </div>
        </div >
    )
}

export default Month