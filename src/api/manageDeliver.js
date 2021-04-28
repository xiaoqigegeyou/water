import request from '@/utils/request'

export function selectDeliver(data) {
  return request({
    url: '/deliver/selectDeliver',
    method: 'post',
    data
  })
}
export function selectAllDeliver(data) {
  return request({
    url: '/deliver/selectAll',
    method: 'post',
    data
  })
}
export function updateDeliver(data) {
  return request({
    url: '/deliver/updateDeliver',
    method: 'post',
    data
  })
}
export function addDeliver(data) {
  return request({
    url: '/deliver/addDeliver',
    method: 'post',
    data
  })
}
export function deleteDeliver(data) {
  return request({
    url: '/deliver/deleteDeliver',
    method: 'post',
    data
  })
}
