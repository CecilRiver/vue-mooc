import axios from 'utils/axios.js'


// 设置axios的baseURL
axios.defaults.baseURL = 'http://127.0.0.1:10000/';
axios.defaults.withCredentials = false;// Cookie跨域

import Qs from 'qs'

export function getUserName(params){
  return axios.get(`/user/users/info/${params}`);
}



// 用户登录
export function userLogin (data) {
  axios.defaults.baseURL = 'http://127.0.0.1:10000/';
  axios.defaults.withCredentials = false;// Cookie跨域
  return axios.post('/user/users/login', Qs.stringify(data))
}


//用户注册
export function userRegister(data){
  axios.defaults.baseURL = 'http://127.0.0.1:10000/';
  axios.defaults.withCredentials = false;// Cookie跨域

  return axios.post('/user/users/register',Qs.stringify(data))
}


// 用户注册接口
// export function userRegister (data) {
//   return axios.post('/api/user/register', data)
// }

// 获取用户详细信息接口
export function getUserInfo () {
  return axios.get('/api/user/info')
}

// 分页获取用户登录日志
export function getUserLogs (params) {
  return axios.get('/api/log/list', {
    params
  })
}

// 编辑账号绑定信息
export function updateUserBinds (data) {
  return axios.post('/api/user/update/binds', data)
}

// 编辑用户个人信息
export function updateUserInfo (data) {
  return axios.post('/api/user/update/info', data)
}

// 获取用户课程信息接口
export function getUserCourse (params) {
  // 设置axios的baseURL
  axios.defaults.baseURL = 'http://127.0.0.1:7000/';
  axios.defaults.withCredentials = false;// Cookie跨域
  return axios.post('/course/coursesubscriptions/userCourse', Qs.stringify(params))
}

//获取老师课程信息接口
export function getTeacherCourse (params) {
  // 设置axios的baseURL
  axios.defaults.baseURL = 'http://127.0.0.1:7000/';
  axios.defaults.withCredentials = false;// Cookie跨域
  return axios.post('/course/courses/teacherCourse', Qs.stringify(params))
}