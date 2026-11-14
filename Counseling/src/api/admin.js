import service from '@/utils/request'

export function login(data) {
    return service.post('/user/login', data)
}

export function categoryTree() {
    return service.get('/knowledge/category/tree')
}
export function articlePage(params) {
  return service.get('/knowledge/article/page', { params })
}

export function getArticleDetail(id) {
  return request({
    url: `/article/detail/${id}`, // 请根据你的实际后端接口路径修改
    method: 'get'
  })
}

export function uploadFile(file, businessInfo) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('businessType', 'ARTICLE')
  formData.append('businessId', businessInfo.businessId)
  formData.append('businessField', 'cover')

  return service.post('/file/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

