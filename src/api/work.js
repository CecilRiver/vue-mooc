import axios from 'utils/axios.js'

// 设置axios的baseURL
axios.defaults.baseURL = 'http://localhost:88/courese';
axios.defaults.withCredentials = false;// Cookie跨域

import Qs from 'qs'




export function imageUp (data) {
  axios.defaults.baseURL = 'http://localhost:88/courese';
  axios.defaults.withCredentials = false;// Cookie跨域
  console.log(data)
  const formData = new FormData();
    formData.append('file', data.file);
    return axios.post('work/uploadedfiles/fileUpload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

export function getAss (params) {
    axios.defaults.baseURL = 'http://localhost:88/courese';
    axios.defaults.withCredentials = false;// Cookie跨域
    return axios.post(`/work/assignments/info/${params}`)
}

export function postSub (data) {
    axios.defaults.baseURL = 'http://localhost:88/courese';
    axios.defaults.withCredentials = false;// Cookie跨域
    return axios.post('/work/submissions/save',data, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export function postAss (data) {
    axios.defaults.baseURL = 'http://localhost:88/courese';
    axios.defaults.withCredentials = false;// Cookie跨域
    return axios.post('/work/assignments/save',data, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export function postPeerRule (data) {
    axios.defaults.baseURL = 'http://localhost:88/courese';
    axios.defaults.withCredentials = false;// Cookie跨域
    return axios.post('/work/evaluationrules/save',data, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}