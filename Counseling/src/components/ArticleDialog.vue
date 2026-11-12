<template>
    <el-dialog
        title="文章详情"
        v-model="dialogVisible"
        width="50%"
        @close="handleClose"
    >
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
          <el-form-item label="文章标题" prop="title">
              <el-input v-model="formData.title" placeholder="请输入文章标题" maxlength="200" show-word-limit/>
          </el-form-item>
          <el-form-item label="所属分类" prop="categoryId">
              <el-select v-model="formData.categoryId" placeholder="请选择分类">
                  <el-option v-for="item in categories" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
          </el-form-item>
          <el-form-item label="文章摘要" prop="summary">
              <el-input type="textarea" v-model="formData.summary" placeholder="请输入文章摘要(可选)" maxlength="1000" show-word-limit :row="4" clearable />
          </el-form-item>
          <el-form-item label="文章标签" prop="tags">
            <el-select v-model="formData.tagArray" placeholder="请输入文章标签(逗号分隔)" multiple filterable allow-create style="width: 100%">
                <el-option v-for="item in commonTags" :key="tag" :label="tag" :value="tag" />
            </el-select>
        </el-form-item>
            <el-form-item label="封面图片">
            <div class="cover-upload">
                <el-upload
                    class="avatar-uploader"
                    action="#"
                    :before-upload="beforeUpload"
                    :http-request="handleUploadRequest"
                    accept="image/*"
                    >
                    <div v-if="!imgUrl" class="cover-placeholder">
                        <p>点击上传封面</p>
                    </div>
                    <img v-else :src="imgUrl" class="cover-image" alt="封面图片" />
                </el-upload>
            </div>
        </el-form-item>
      </el-form>
    </el-dialog>
</template>

<script setup>
import { ref, reactive,computed} from 'vue'
import { ElMessage } from 'element-plus'
import { uploadFile } from '@/api/admin'
import { fileBaseUrl } from '@/config/index.js'


const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  categories: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['update:modelValue'])

const dialogVisible = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }

})


const handleClose=()=>{}

const rules = reactive({
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { max: 200, message: '文章标题最多200个字符', trigger: 'blur' }
  ],
  categoryId: [
  { required: true, message: '请选择分类', trigger: 'change' }
],
})
const commonTags = [
  '情绪管理', '焦虑', '抑郁', '压力', '睡眠',
  '冥想', '正念', '放松', '心理健康', '自我成长',
  '人际关系', '工作压力', '学习方法', '生活技巧'
]

// 表单数据（严格对应后端 /knowledge/article 所需字段）
const formData = reactive({
    id: "",
    title: "",
    content: "",
    coverImage: "", // 封面图片路径
    categoryId: 0,
    summary: "",
    tags: ""
})

// 图片预览地址
const imgUrl = ref('')

// 处理文件上传请求
const handleUploadRequest = async ({ file }) => {
    try {
        // 生成业务ID
        const businessId = crypto.randomUUID()

        // 调用上传接口
        const fileRes = await uploadFile(file, {
            businessId: businessId
        })
        console.log('上传成功，后端返回：', fileRes)

        // 兼容不同的返回结构，确保能拿到 filePath
        const filePath = fileRes.filePath || fileRes

        if (filePath) {
            // 1. 拼接完整的图片地址用于前端 <img> 标签预览
            imgUrl.value = filePath.startsWith('http') 
                ? filePath 
                : fileBaseUrl + filePath.replace(/^\//, '')

            // 2. 关键：把相对路径赋值给表单提交的 coverImage 字段
            formData.coverImage = filePath

            ElMessage.success('封面上传成功')
        } else {
            ElMessage.error('上传响应异常，未获取到文件路径')
        }
    } catch (error) {
        console.error('图片上传失败：', error)
        ElMessage.error('图片上传失败，请检查网络或后端服务')
    }
}


</script>
