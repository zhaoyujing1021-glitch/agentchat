<template>
  <div>
    <PageHead title="知识文章">
      <template #buttons>
        <el-button type="primary">新增</el-button>
        <el-button type="primary">编辑</el-button>
      </template>
    </PageHead>
    <TableSearch :formItem="formItem" @search="handleSearch" />
  </div>
</template>

<script setup>
import PageHead from '@/components/PageHead.vue'
import TableSearch from '@/components/TableSearch.vue'

const formItem = [
  { comp: 'input', prop: 'title', label: 'タイトル', placeholder: 'タイトル入力' },
  { comp: 'select', prop: 'categoryId', label: 'カテゴリ', placeholder: 'カテゴリ選択',options: [{
      label: '基礎知識',
      value: '1'
    },
    {
      label: '感情管理',
      value: '2'
    }] }
]

const handleSearch = (formData) => {
  console.log(formData,'検索条件')
}
</script>