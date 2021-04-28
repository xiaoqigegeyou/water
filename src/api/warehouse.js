import request from '@/utils/request'

export function selectInandout(data) {
  return request({
    url: '/inandout/selectInandout',
    method: 'post',
    data
  })
}

export function selectAllInandout(data) {
  return request({
    url: '/inandout/selectAll',
    method: 'post',
    data
  })
}
export function updateInandout(data) {
  return request({
    url: '/inandout/updateInandout',
    method: 'post',
    data
  })
}
export function addInandout(data) {
  return request({
    url: '/inandout/addInandout',
    method: 'post',
    data
  })
}
export function deleteInandout(data) {
  return request({
    url: '/inandout/deleteInandout',
    method: 'post',
    data
  })
}
//入库
export function selectInwater(data) {
  return request({
    url: '/inwater/selectInwater',
    method: 'post',
    data
  })
}
export function updateInwater(data) {
  return request({
    url: '/inwater/updateInwater',
    method: 'post',
    data
  })
}
export function addInwater(data) {
  return request({
    url: '/inwater/addInwater',
    method: 'post',
    data
  })
}
export function deleteInwater(data) {
  return request({
    url: '/inwater/deleteInwater',
    method: 'post',
    data
  })
}


//出库
export function selectOutwater(data) {
  return request({
    url: '/outwater/selectOutwater',
    method: 'post',
    data
  })
}
export function updateOutwater(data) {
  return request({
    url: '/outwater/updateOutwater',
    method: 'post',
    data
  })
}
export function addOutwater(data) {
  return request({
    url: '/outwater/addOutwater',
    method: 'post',
    data
  })
}
export function deleteOutwater(data) {
  return request({
    url: '/outwater/deleteOutwater',
    method: 'post',
    data
  })
}
