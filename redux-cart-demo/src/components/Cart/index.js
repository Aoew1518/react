import classNames from 'classnames'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { decreCount, increCount, clearCart } from '../../store/modules/takeaway'
import Count from '../Count'
import './index.scss'

const Cart = () => {
  const { cartList } = useSelector(state => state.foods)
  const dispatch = useDispatch()

  // 计算总价 - 修复浮点数精度问题
  const totalPrice = cartList.reduce((a, c) => {
    return Number((a + c.price * c.count).toFixed(2))
  }, 0)

  // 计算总数量
  const totalCount = cartList.reduce((a, c) => a + c.count, 0)

  // 控制购物车打开关闭的状态
  const [visible, setVisible] = useState(false)

  // 监听购物车列表变化
  // 因为Redux的dispatch是异步的，所以要监听
  useEffect(() => {
    if (cartList.length <= 0) {
      setVisible(false)
    }
  }, [cartList])

  // 购物车展现
  const onShow = () => {
    if (cartList.length > 0) {
      setVisible(true)
    }
  }

  // 清空购物车
  const clearCartList = () => {
    dispatch(clearCart())
    setVisible(false)
  }

  return (
    <div className="cartContainer">
      {/* 遮罩层 添加visible类名可以显示出来 */}
      <div
        onClick={() => setVisible(false)}
        className={classNames('cartOverlay', visible && 'visible')}
      />
      <div className="cart">
        {/* fill 添加fill类名可以切换购物车状态*/}
        {/* 购物车数量 */}
        <div onClick={onShow} className={classNames('icon', cartList.length > 0 && 'fill')}>
          {cartList.length > 0 && <div className="cartCornerMark">{totalCount}</div>}
        </div>
        {/* 购物车价格 */}
        <div className="main">
          <div className="price">
            <span className="payableAmount">
              <span className="payableAmountUnit">¥</span>
              {totalPrice}
            </span>
          </div>
          <span className="text">预估另需配送费 ¥5</span>
        </div>
        {/* 结算 or 起送 */}
        {totalCount ? (
          <div className="goToPreview">去结算</div>
        ) : (
          <div className="minFee">¥20起送</div>
        )}
      </div>
      {/* 添加visible类名 div会显示出来 */}
      <div className={classNames('cartPanel', visible && 'visible')}>
        <div className="header">
          <span className="text">购物车</span>
          <span className="clearCart" onClick={clearCartList}>
            清空购物车
          </span>
        </div>

        {/* 购物车列表 */}
        <div className="scrollArea">
          {cartList && cartList.map(item => {
            return (
              <div className="cartItem" key={item.id}>
                <img className="shopPic" src={item.picture} alt="" />
                <div className="main">
                  <div className="skuInfo">
                    <div className="name">{item.name}</div>
                  </div>
                  <div className="payableAmount">
                    <span className="yuan">¥</span>
                    <span className="price">{item.price}</span>
                  </div>
                </div>
                <div className="skuBtnWrapper btnGroup">
                  {/* 数量组件 */}
                  <Count
                    count={item.count}
                    onPlus={() => dispatch(increCount({ id: item.id }))}
                    onMinus={() => dispatch(decreCount({ id: item.id }))}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Cart
