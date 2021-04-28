import request from '@/utils/request'

export function selectBrand(data) {
  return request({
    url: '/brand/selectBrand',
    method: 'post',
    data
  })
}
export function selectAllBrand(data) {
  return request({
    url: '/brand/selectAll',
    method: 'post',
    data
  })
}

export function updateBrand(data) {
  return request({
    url: '/brand/updateBrand',
    method: 'post',
    data
  })
}
export function addBrand(data) {
  return request({
    url: '/brand/addBrand',
    method: 'post',
    data
  })
}
export function deleteBrand(data) {
  return request({
    url: '/brand/deleteBrand',
    method: 'post',
    data
  })
}
