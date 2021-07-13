import axios from 'axios'
import { getToken } from '@/utils/auth'
import { Toast } from 'vant'
import router from '@/router'

import qs from 'qs'
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    const commonParams = {}
    if (getToken()) {
      commonParams.token = getToken()
    }
    // 判断请求的类型：如果是post请求就把默认参数拼到data里面；如果是get请求就拼到params里面
    if (config.method === 'post') {
      config.data = qs.stringify({
        ...commonParams,
        ...config.data
      })
    } else if (config.method === 'get') {
      config.params = {
        ...commonParams,
        ...config.params
      }
    }

    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)
// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.code === 1013) {
      // 特殊处理：避免未登录情况下，在首页获取购物车数据被强制跳转登录
      if (router.history.current.path !== '/home') {
        router.push('login')
      }

      return res
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Toast({
      message: error.message,
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
