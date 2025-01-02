import { useParams, useSearchParams } from "react-router-dom"

const Article = () => {
  // // 得到一个函数，调用这个函数可以得到当前路由参数对象
  // const [params] = useSearchParams()
  // const id = params.get('id')
  // const name = params.get('name')
  // console.log(params);
  // console.log(useSearchParams());
  // // 直接得到当前路由参数对象
  // console.log(useParams());

  const params = useParams()
  const id = params.id
  const name = params.name
  return <div>我是文章页{id}-{name}</div>
}

export default Article