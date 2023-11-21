import axios from 'axios'
import store from '../store/index.js'
import components from '../register.js'
const Message = components.Message
const service = axios.create({
  timeout: 50000,
	headers: {
		'Content-Type': "application/json; charset=utf-8"
	},
  
})

// 请求拦截
service.interceptors.request.use(
  config => {
    config.headers['Authorization'] = localStorage.getItem("token")
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

//响应拦截
service.interceptors.response.use(
  response => {
    let {status, data} = response
    if (status !== 200) {
      Message.error('网络异常，请刷新或者重试!')
      return Promise.reject('网络异常!')
    }
    if (data.code === 401) {
      store.commit('login/SET_SHOW_LOGIN', true)
      store.dispatch('login/logout')
      return Promise.resolve({
        code: -1,
        msg: data.msg
      })
    } else {
      return Promise.resolve(response)
    }
  },
  error => {
    return Promise.reject(error)
  }
)

export default service