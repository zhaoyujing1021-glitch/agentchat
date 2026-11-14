<template>
    <el-dialog
        :title="isEdit ? '编辑文章' : '新增文章'"
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
          <el-form-item label="文章内容" prop="content">
              <RichTextEditor v-model="formData.content" :maxLength="5000" style="width: 100%;" />
          </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="btnPreview = !btnPreview">{{ btnPreview ? '隐藏预览' : '预览效果' }}</el-button>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">{{ isEdit ? '更新文章' : '创建文章' }}</el-button>
      </template>
    </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick } from 'vue'
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
  },
  article: {
    type: Object,
    default: null
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
const currentArticle = ref(null)

const isEdit = computed(() => !!props.article?.id)

watch(() => props.article, (newVal) => {
    if (newVal) {
        Object.assign(formData, newVal)
        // 使用现有ID
        businessId.value = newVal.id
        // 封面Url
        imgUrl.value = fileBaseUrl + newVal.coverImage
    }
})

const handleClose = () => {
    // 重置表单
    formRef.value.resetFields()
    // 重置ID
    businessId.value = null
    // 重置标签
    formData.tagArray = []
    // 重置封面图片和数据
    handleRemove()
    emit('update:modelValue', false)
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
  { required: true, message: '请输入文章内容', trigger: 'blur' },
  { max: 5000, message: '文章内容最多5000个字符', trigger: 'blur' }
  ],
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
const businessId = ref(null)

const handleUploadRequest = async (options) => {
  try {
    const file = options.file
    const uploadData = new FormData()
    
    // 1. 将文件追加到 FormData 中（如果后端要求字段名叫 'image'，请自行修改）
    uploadData.append('file', file)

    // 2. 每次上传时生成或更新 UUID
    businessId.value = crypto.randomUUID()
    
    // 3. 将 businessId 也追加进 FormData 中传给后端
    uploadData.append('businessId', businessId.value)

    // 4. 调用上传接口
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

// 富文本
const handleContentChange = (data) => {
  console.log(data, '富文本内容')
  formData.content = data.html
}

const editorInstance = ref(null)
const handleEditorCreated = (editor) => {
  editorInstance.value = editor
  // 编辑
  if (formData.content && editor) {
  nextTick(() => {
    editor.setHtml(formData.content)
  })
}
}

// 提交
const formRef = ref()
const loading = ref(false)
const handleSubmit = () => {
  formRef.value.validate((valid, fields) => {
    if (valid) {
      loading.value = true
    }
    console.log(formData, 'FormData')
    const submitData = {
      ...formData,
      tags: formData.tagArray.join(',')
    }
    delete submitData.tagArray
  })
}
</script>
