<template>
  <div class="editor-container">
    <!-- 工具栏 -->
    <Toolbar
      class="editor-toolbar"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    />

    <!-- 编辑区域 -->
    <Editor
      class="editor-content"
      v-model="valueHtml"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onCreated="handleCreated"
      @onChange="handleChange"
    />

    <!-- 底部字数统计栏 -->
    <div class="editor-footer">
      <span class="word-count">{{ textLength }} / {{ maxLength }}</span>
      <div class="progress-bar">
        <div
          class="progress-fill"
          :style="{ width: `${Math.min((textLength / maxLength) * 100, 100)}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css' // 引入 wangEditor 样式
import { onBeforeUnmount, ref, shallowRef, watch } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

// 接收父组件 v-model 传值与字数上限配置
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  maxLength: {
    type: Number,
    default: 5000
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

// 编辑器实例，必须用 shallowRef（官方文档强制要求，避免 Vue 响应式代理导致内部报错）
const editorRef = shallowRef()

// 编辑器模式：'default' 或 'simple'
const mode = 'default'

// 内容 HTML
const valueHtml = ref(props.modelValue)

// 纯文本字数统计
const textLength = ref(0)

// 监听外部传入的 modelValue 变化（用于表单回显或重置）
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal !== valueHtml.value) {
      valueHtml.value = newVal || ''
    }
  }
)

// 工具栏配置：严格对应截图中的按钮顺序与分组
const toolbarConfig = {
  toolbarKeys: [
    'bold',           // 加粗
    'italic',         // 斜体
    'underline',      // 下划线
    'color',          // 文字颜色
    'bgColor',        // 背景色
    '|',
    'fontSize',       // 字号
    'fontFamily',     // 字体
    '|',
    'header1',        // H1
    'header2',        // H2
    'header3',        // H3
    '|',
    'bulletedList',   // 无序列表
    'numberedList',   // 有序列表
    'blockquote',     // 引用
    '|',
    'insertLink',     // 插入链接
    '|',
    'undo',           // 撤销
    'redo'            // 重做
  ]
}

// 编辑器配置
const editorConfig = {
  placeholder: '请输入文章内容，支持富文本格式\n\n可以使用加粗、斜体、列表、标题等格式来丰富文章内容。',
  maxLength: props.maxLength,
  // 达到最大字数限制时的回调
  onMaxLength(editor) {
    console.warn(`已达到最大字数限制：${props.maxLength} 字`)
  }
}

// 编辑器创建完成回调
const handleCreated = (editor) => {
  editorRef.value = editor
  updateTextLength(editor)
}

// 内容变化回调
const handleChange = (editor) => {
  updateTextLength(editor)
  emit('update:modelValue', valueHtml.value)
  emit('change', {
    html: valueHtml.value,
    text: editor.getText()
  })
}

// 计算纯文本长度（去除首尾换行符干扰）
const updateTextLength = (editor) => {
  if (!editor) return
  const text = editor.getText().replace(/\r?\n/g, '')
  textLength.value = text.length
}

// 组件销毁时，及时销毁编辑器实例，防止内存泄漏
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})
</script>

<style scoped>
.editor-container {
  width: 100%;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  background-color: #ffffff;
  overflow: hidden;
}

.editor-toolbar {
  border-bottom: 1px solid #f0f0f0;
  background-color: #fafafa;
}

.editor-content {
  height: 400px;
  overflow-y: hidden;
}

.editor-footer {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  border-top: 1px solid #f0f0f0;
  background-color: #ffffff;
  font-size: 12px;
  color: #909399;
}

.word-count {
  font-variant-numeric: tabular-nums;
}

.progress-bar {
  width: 60px;
  height: 4px;
  background-color: #ebeef5;
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #409eff;
  transition: width 0.2s ease;
}

/* 调整 placeholder 样式与换行显示 */
:deep(.w-e-text-placeholder) {
  color: #a8abb2;
  font-style: normal;
  white-space: pre-wrap;
  line-height: 1.6;
}
</style>