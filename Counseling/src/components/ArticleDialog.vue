<template>
    <el-dialog
        title="文章详情"
        v-model="dialogVisible"
        width="60%"
        @close="handleClose"
    >
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
          <el-form-item label="文章标题" prop="title">
              <el-input v-model="formData.title" placeholder="请输入文章标题" maxlength="200" show-word-limit/>
          </el-form-item>

          <el-form-item label="所属分类" prop="categoryId">
              <el-select v-model="formData.categoryId" placeholder="请选择分类" style="width: 100%">
                  <el-option v-for="item in categories" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
          </el-form-item>

          <el-form-item label="文章摘要" prop="summary">
              <el-input type="textarea" v-model="formData.summary" placeholder="请输入文章摘要(可选)" maxlength="1000" show-word-limit :rows="4" clearable />
          </el-form-item>

          <el-form-item label="文章标签" prop="tags">
            <el-select v-model="formData.tagArray" placeholder="请选择或输入文章标签" multiple filterable allow-create style="width: 100%">
                <el-option v-for="tag in commonTags" :key="tag" :label="tag" :value="tag" />
            </el-select>
          </el-form-item>

          <el-form-item label="封面图片">
            <div class="cover-upload-container">
                <el-upload
                    class="avatar-uploader"
                    action="#"
                    :before-upload="beforeUpload"
                    :http-request="handleUploadRequest"
                    :show-file-list="false"
                    accept="image/*"
                >
                    <div v-if="!imgUrl" class="cover-placeholder">
                        <!-- 修复：加上了 Plus 图标组件 -->
                        <el-icon class="uploader-icon"><Plus /></el-icon>
                        <p>点击上传封面</p>
                    </div>
                    <img v-else :src="imgUrl" class="cover-image" alt="封面图片" />
                </el-upload>
                <div v-if="imgUrl" class="cover-remove-btn">
                    <el-button type="danger" size="small" @click="handleRemove">移除封面</el-button>
                </div>
            </div>
          </el-form-item>

          <!-- 修复：去掉了外面多余的 label 嵌套，直接引入编辑器，避免“文章内容”文字重复 -->
          <el-form-item label="文章内容" prop="content">
              <RichTextEditor v-model="formData.content" :maxLength="5000" style="width: 100%;" />
          </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue' // 引入 Plus 图标
import { uploadFile } from '@/api/admin'
import { fileBaseUrl } from '@/config/index.js'
import RichTextEditor from './RichTextEditor.vue'

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
const emit = defineEmits(['update:modelValue', 'submit'])

const dialogVisible = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})

const formRef = ref(null)

const handleClose = () => {
  formRef.value?.resetFields()
  imgUrl.value = ''
}

const handleRemove = (e) => {
    e.stopPropagation()
    imgUrl.value = ''
    formData.coverImage = ''
}

const rules = reactive({
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { max: 200, message: '文章标题最多200个字符', trigger: 'blur' }
  ],
  categoryId: [
    { required: true, message: '请选择分类', trigger: 'change' }
  ],
  content: [
    { required: true, message: '请输入文章内容', trigger: 'blur' }
  ]
})

const commonTags = [
  '情绪管理', '焦虑', '抑郁', '压力', '睡眠',
  '冥想', '正念', '放松', '心理健康', '自我成长',
  '人际关系', '工作压力', '学习方法', '生活技巧'
]

const formData = reactive({
    id: "",
    title: "",
    content: "",
    coverImage: "", 
    categoryId: '',
    summary: "",
    tags: "",
    tagArray: [] 
})

const imgUrl = ref('')

const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isImage) {
    ElMessage.error('上传封面图片，请选择图片文件')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('上传封面图片，图片大小不能超过5MB')
    return false
  }
  return true
}

const handleUploadRequest = async (options) => {
  try {
    const file = options.file
    const uploadData = new FormData()
    // 如果后端要求参数名叫其他名字，比如 'image'，请改成：
    uploadData.append('file', file) // 或者是 'image'

    const res = await uploadFile(uploadData)
    console.log('上传接口返回：', res) // 可以在 F12 控制台打印看看结构

    // 根据你实际的后端返回调整（例如 res.data.url 或 res.path）
    const filePath = res.data || res.url || res.path 
    
    if (filePath) {
      formData.coverImage = filePath
      imgUrl.value = fileBaseUrl ? `${fileBaseUrl}${filePath}` : filePath
      ElMessage.success('封面上传成功')
    } else {
      ElMessage.error('上传成功但未获取到文件路径')
    }
  } catch (error) {
    console.error(error)
    ElMessage.error('封面上传失败，请检查接口或网络')
  }
}

const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      formData.tags = formData.tagArray.join(',')
      emit('submit', { ...formData })
    }
  })
}
</script>

<style scoped>
.cover-upload-container {
    display: flex;
    align-items: center;
    gap: 16px;
}

.avatar-uploader :deep(.el-upload) {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
    width: 148px;
    height: 148px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.avatar-uploader :deep(.el-upload):hover {
    border-color: var(--el-color-primary);
}

.cover-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #8c939d;
}

.uploader-icon {
    font-size: 28px;
    margin-bottom: 8px;
}

.cover-image {
    width: 148px;
    height: 148px;
    object-fit: cover;
    display: block;
}
</style>