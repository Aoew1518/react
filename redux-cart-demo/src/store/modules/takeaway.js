// 编写store

import { createSlice } from "@reduxjs/toolkit"
import axios from "axios"

const foodsStore = createSlice({
    name: 'foods',
    initialState: {
        // 商品列表
        foodsList: [],
        // 菜单激活下标值
        activeIndex: 0,
        // 购物车列表
        cartList: []
    },
    reducers: {
        // 更改商品列表
        setFoodsList(state, action) {
            state.foodsList = action.payload
        },
        // 更改activeIndex
        changeActiveIndex(state, action) {
            state.activeIndex = action.payload
        },
        // 添加购物车
        addCart(state, action) {
            // 是否添加过？以action.payload.id去cartList中匹配 匹配到了 添加过
            const item = state.cartList.find(item => item.id === action.payload.id)
            if (item) {
                item.count++
            } else {
                // 深拷贝一份商品数据
                const cartData = Object.assign({}, action.payload)
                // 设置初始数量为1
                cartData.count = 1
                state.cartList.push(cartData)
            }
        },
        // count增
        increCount(state, action) {
            // 关键点：找到当前要修改谁的count id
            const item = state.cartList.find(item => item.id === action.payload.id)
            item.count++
        },
        // count减
        decreCount(state, action) {
            // 关键点：找到当前要修改谁的count id
            const item = state.cartList.find(item => item.id === action.payload.id)
            // 减到0的时候删除该物品
            if (item.count === 1) {
                state.cartList = state.cartList.filter(item => item.id !== action.payload.id)
            }
            item.count--
        },
        // 清除购物车
        clearCart(state) {
            state.cartList = []
        }
    }
})

// 异步获取部分
const { setFoodsList, changeActiveIndex, addCart, increCount, decreCount, clearCart } = foodsStore.actions
const fetchFoodsList = () => {
    return async (dispatch) => {
        // 编写异步逻辑
        // const res = await axios.get('http://localhost:3004/takeaway')
        const res = await axios.get('https://zhousg.atomgit.net/harmonyos-next/takeaway.json')
        // 调用dispatch函数提交action
        // 更改count默认为0
        const resData = res.data
        resData.map(item => {
            item.foods.forEach(foodItem => {
                foodItem.count = 0
            })
        })
        dispatch(setFoodsList(res.data))
    }
}

export { fetchFoodsList, changeActiveIndex, addCart, increCount, decreCount, clearCart }

const reducer = foodsStore.reducer

export default reducer