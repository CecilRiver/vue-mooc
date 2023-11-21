import axios from 'utils/axios.js'
// 设置axios的baseURL
axios.defaults.baseURL = 'http://127.0.0.1:7000/';
axios.defaults.withCredentials = false;// Cookie跨域

import Qs from 'qs'

//教师创建课程
export function createLesson(params){
      // 设置axios的baseURL
axios.defaults.baseURL = 'http://127.0.0.1:7000/';
axios.defaults.withCredentials = false;// Cookie跨域
return axios.post('course/courses/createCourse',Qs.stringify(params))
}


// 课程导航
export function getLessonNav () {
    // 设置axios的baseURL
axios.defaults.baseURL = 'http://127.0.0.1:7000/';
axios.defaults.withCredentials = false;// Cookie跨域
  return axios.get('/course/categories/list')
}

// 课程列表
export function getLessonList (params) {
  // 设置axios的baseURL
axios.defaults.baseURL = 'http://127.0.0.1:7000/';
axios.defaults.withCredentials = false;// Cookie跨域
  return axios.get('/course/courses/list', {
    params
  })
}

//课程限制查询
export function getLessionLimit(params){
  axios.defaults.baseURL = 'http://127.0.0.1:7000/';
  axios.defaults.withCredentials = false;// Cookie跨域
  return axios.get('/course/courses/limitList', {
    params
  })
}



// 课程详情
export function getLessonDetail(params) {
  axios.defaults.baseURL = 'http://127.0.0.1:7000/';
  axios.defaults.withCredentials = false;// Cookie跨域
  return axios.get(`/course/courses/info/${params.id}`);
  
}

// 类别详情
export function getLessionType(params) {
  return axios.get(`/course/categories/info/${params.id}`);
}

// 课程目录
export function getLessonComment (params) {
  return axios.get('/api/lesson/comment', {
    params
  })
}

// 课程问答
export function getLessonQa (params) {
  return axios.get('/api/lesson/qa', {
    params
  })
}
