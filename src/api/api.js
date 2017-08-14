import axios from 'axios';
import Qs from 'qs';
import NProgress from 'nprogress';

// 每一个地址前都需要/api来进行反向代理的识别
let base = ""
if (process.env.NODE_ENV == 'development') {
    base = "/api" // [开发环境]
} else {
    base = "https://node-douban-api.herokuapp.com/movie" // [开发apicloud原生相关功能] 或 [发布环境]
}

function formatParams(params) {
    for (let i in params) {
        if (Object.prototype.toString.call(params[i]) === '[object Array]') {
            params[i] = JSON.stringify(params[i])
        }  
    }
}

function middlePromiseFun(url, params={}, type="post"){
  return   new Promise((resolve, reject) => {
      formatParams(params)
      NProgress.start()
      axios({
          method: type,
          url: url,
          timeout: 30000,
          data: Qs.stringify(params)//开发模式下,需要进行反向代理。若不加，则开发模式proxy代理情况下无法传递参数
      }).then(response => {
          NProgress.done()
          resolve(response.data)
      }, err => {
          NProgress.done()
          reject(err)
      })
  })
}

export { base };

export const requestLogin = (params) => {
  return middlePromiseFun(`${base}/self ajax address`)
}
export const getMovies = (params) => {
  return middlePromiseFun(`${base}/in_theaters`, params, "get")
}





