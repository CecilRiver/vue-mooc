import axios from 'utils/axios.js'
import { ERR_OK } from 'api/config.js'
import * as types from '../mutation-types.js'
import { getUserInfo, setUserInfo, removeUserInfo,getToken,setToken } from 'utils/cache.js'
const state = {
  showLogin: false,
  action: '',
  userinfo: getUserInfo(),
  token: ''
}
const mutations = {
  [types.SET_SHOW_LOGIN] (state, showLogin) {
    state.showLogin = showLogin
  },
  [types.SET_LOGIN_ACTION] (state, action) {
    state.action = action
  },
  [types.SET_USER_INFO] (state, userinfo) {
    state.userinfo = userinfo
    if (userinfo) {
      setUserInfo(userinfo)
      //console.log("hahaha")
    } else {
      removeUserInfo(userinfo)
    }
  },
  [types.SET_TOKEN] (state, token) {
    state.token = token
    console.log("New token set:", state.token); // 打印新的 token 值
  }
}

const actions = {
  
  logout ({commit }) {
    return new Promise((resolve, reject) => {
      
// 设置axios的baseURL
axios.defaults.baseURL = 'http://localhost:88/courese';
axios.defaults.withCredentials = false;// Cookie跨域
      axios.get('/auth/logout').then(res => {
        //const { code } = res
        if (res.code === ERR_OK) {
          commit(types.SET_USER_INFO, '')
          resolve()
        } else {
          reject()
        }
      }).catch(() => {
        reject()
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}