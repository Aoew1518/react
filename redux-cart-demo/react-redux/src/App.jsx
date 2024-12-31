import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// 导入actionCreater
import { inscrement, decrement, addToNum } from './store/modules/counterStore'
import { setChannels } from './store/modules/channelStore'
// import { fetchChannlList } from './store/modules/channelStore'
import { get } from './apis/util'

// 异步函数调用 get 函数
async function getChannlList() {
  const url = 'http://geek.itheima.net/v1_0/channels';
  const res = await get(url);
  return res.data.channels;
}

function App() {
  const { count } = useSelector(state => state.counter)
  const { channelList } = useSelector(state => state.channel)
  const dispatch = useDispatch()

  // 使用useEffect触发异步请求执行
  useEffect(() => {
    // 加载频道数据
    const loadChannels = async () => {
      const channels = await getChannlList()
      dispatch(setChannels(channels))
    }
    loadChannels();
  }, [])

  return (
    <div className="App">
      <button onClick={() => dispatch(decrement())}>-</button>
      {count}
      <button onClick={() => dispatch(inscrement())}>+</button>
      <button onClick={() => dispatch(addToNum(10))}>add To 10</button>
      <button onClick={() => dispatch(addToNum(20))}>add To 20</button>
      <ul>
        {channelList && channelList.map(item => <li key={item.id}>{item.name}</li>)}
      </ul>
    </div>
  )
}

export default App
