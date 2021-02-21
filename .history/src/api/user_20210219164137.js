import request from '@/utils/request'

export function login(tell,pass) {
  return request({
    url: '/user/login',
    method: 'post',
    data:{
      tell
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}