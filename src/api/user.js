import request from '@/utils/request'

export function login(tell, pass) {
  return request({
    url: '/user/login',
    method: 'post',
    // baseURL:'http://localhost:8080',
    data: {
      tell,
      pass
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}
export function updateInfo(data) {
  return request({
    url: '/user/updateInfo',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'get'
  })
}

export function register(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}
