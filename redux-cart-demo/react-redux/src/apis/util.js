import axios from "axios";

function get(url) {
    return axios.get(url)
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            console.log(err)  // 错误处理
            throw err;
        });
}

function post(url, params) {
    return axios.post(url, params)
        .then((res) => {
            return res.data;  
        })
        .catch((err) => {
            console.log(err);
            throw err;
        });
}

export {
    get,
    post
}