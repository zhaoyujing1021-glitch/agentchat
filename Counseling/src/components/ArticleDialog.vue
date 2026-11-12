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
      </el-form>
    </el-dialog>3
</template>

<script setup>
import { ref, reactive,computed} from 'vue'

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
//表单数据
const formData = reactive({
  "title": "",
  "content": "",
  "coverImage": "",
  "categoryId": 0,
  "summary": "",
  "tags": "",
  "id": ""
})
const rules = reactive({
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { max: 200, message: '文章标题最多200个字符', trigger: 'blur' }
  ],
  categoryId: [
  { required: true, message: '请选择分类', trigger: 'change' }
],
})
</script>
