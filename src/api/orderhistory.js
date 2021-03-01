import request from '@/utils/request'

export function selectorder(data) {
  return request({
    url: '/order/selectorder',
    method: 'post',
    data
  })
}
export function updateorder(data) {
  return request({
    url: '/order/updateorder',
    method: 'post',
    data
  })
}
