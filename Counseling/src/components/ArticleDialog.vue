<template>
  <el-dialog :title="isEdit ? '编辑文章' : '新增文章'" v-model="dialogVisible" width="60%" @close="handleClose">
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formData.title" placeholder="请输入文章标题" maxlength="200" show-word-limit />
      </el-form-item>

      <el-form-item label="所属分类" prop="categoryId">
        <el-select v-model="formData.categoryId" placeholder="请选择分类" style="width: 100%">
          <el-option v-for="item in categories" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="文章摘要" prop="summary">
        <el-input type="textarea" v-model="formData.summary" placeholder="请输入文章摘要(可选)" maxlength="1000" show-word-limit
          :rows="4" clearable />
      </el-form-item>

      <el-form-item label="文章标签" prop="tags">
        <el-select v-model="formData.tagArray" placeholder="请选择或输入文章标签" multiple filterable allow-create
          style="width: 100%">
          <el-option v-for="tag in commonTags" :key="tag" :label="tag" :value="tag" />
        </el-select>
      </el-form-item>

      <el-form-item label="封面图片">
        <div class="cover-upload-container">
          <el-upload class="avatar-uploader" action="#" :before-upload="beforeUpload"
            :http-request="handleUploadRequest" :show-file-list="false" accept="image/*">
            <div v-if="!imgUrl" class="cover-placeholder">
              <el-icon class="uploader-icon">
                <Plus />
              </el-icon>
              <p>点击上传封面</p>
            </div>
            <img v-else :src="imgUrl" class="cover-image" alt="封面图片" />
          </el-upload>
          <div v-if="imgUrl" class="cover-remove-btn">
            <el-button type="danger" size="small" @click.stop="handleRemove">移除封面</el-button>
          </div>
        </div>
      </el-form-item>

      <el-form-item label="文章内容" prop="content">
        <!-- 如果你的富文本组件支持自定义事件，可以绑定 @change 和 @created -->
        <RichTextEditor v-model="formData.content" :maxLength="5000" style="width: 100%;" @change="handleContentChange"
          @created="handleEditorCreated" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="loading">{{ isEdit ? '更新文章' : '创建文章' }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { uploadFile, createArticle, updateArticle } from '@/api/admin'
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

const emit = defineEmits(['update:modelValue', 'submit', 'success'])

const dialogVisible = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})

// 1. 保留并使用 currentArticle 用于记录当前编辑的对象
const currentArticle = ref(null)

const isEdit = computed(() => !!props.article?.id)

watch(() => props.article, (newVal) => {
  if (newVal) {
    currentArticle.value = newVal // 赋值给已声明的变量
    Object.assign(formData, newVal)

    // 处理标签回显（把逗号分隔的字符串转为数组）
    if (newVal.tags) {
      formData.tagArray = newVal.tags.split(',').filter(Boolean)
    }

    businessId.value = newVal.id
    if (newVal.coverImage) {
      imgUrl.value = newVal.coverImage.startsWith('http') ? newVal.coverImage : fileBaseUrl + newVal.coverImage
    }
  }
}, { immediate: true })

const handleClose = () => {
  formRef.value?.resetFields()
  businessId.value = null
  formData.tagArray = []
  currentArticle.value = null
  handleRemove()
  emit('update:modelValue', false)
}

const handleRemove = () => {
  imgUrl.value = ''
  formData.coverImage = ''
}

const rules = reactive({
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { max: 200, message: '文章标题最多200个字符', trigger: 'blur' }
  ],
  categoryId: [
    { required: true, message: '請选择分类', trigger: 'change' }
  ],
  content: [
    { required: true, message: '请输入文章内容', trigger: 'blur' },
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
const businessId = ref(null)

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

    // 严格对照接口文档追加四个参数
    uploadData.append('file', file)
    uploadData.append('businessType', 'ARTICLE')

    businessId.value = businessId.value || crypto.randomUUID()
    uploadData.append('businessId', businessId.value)

    uploadData.append('businessField', 'cover')

    const res = await uploadFile(uploadData)
    console.log('上传接口返回：', res)


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

// 2. 将富文本相关方法挂载到模板中（如果 RichTextEditor 支持这些事件）
const editorInstance = ref(null)
const handleEditorCreated = (editor) => {
  editorInstance.value = editor
  if (formData.content && editor) {
    nextTick(() => {
      editor.setHtml(formData.content)
    })
  }
}
const handleContentChange = (data) => {
  formData.content = typeof data === 'string' ? data : data.html
}

// 3. 统一使用成功回调函数
const handleSuccess = () => {
  dialogVisible.value = false
  emit('success') // 通知父组件刷新列表
}

// 提交
const formRef = ref()
const loading = ref(false)
const handleSubmit = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return

    loading.value = true
    try {
      const submitData = {
        ...formData,
        tags: formData.tagArray.join(',')
      }
      delete submitData.tagArray

      if (!isEdit.value) {
        submitData.id = businessId.value
        await createArticle(submitData)
        ElMessage.success('创建文章成功')
      } else {
        await updateArticle(props.article.id, submitData)
        ElMessage.success('更新文章成功')
      }
      handleSuccess() // 调用刚刚未使用的成功处理函数
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  })
}
</script>