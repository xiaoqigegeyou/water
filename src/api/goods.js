import request from '@/utils/request'

export function insrtOrder(data) {
  return request({
    url: '/order/insert',
    method: 'post',
    data
  })
}
export function allBrand() {
  return request({
    url: '/brand/selectAll',
    method: 'post'

  })
}
export function allDeliver() {
  return request({
    url: '/deliver/selectAll',
    method: 'post'

  })
}
