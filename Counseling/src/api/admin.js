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



export function uploadFile(file, businessInfo) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('businessType', 'ARTICLE')
    formData.append('businessId', businessInfo.businessId)
    formData.append('businessField', 'cover')

    // 关键点：使用你的 service 实例，请求 '/file/upload'
    // 因为 baseURL 是 '/api'，最终会自动变成 '/api/file/upload' 并走 Vite 代理
    return service.post('/file/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}