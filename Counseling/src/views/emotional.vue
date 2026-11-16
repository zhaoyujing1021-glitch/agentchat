<template>
    <div>
        <PageHead title="情绪日志" />
        <TableSearch :formItem="formItem" @search="handleSearch" />
    </div>
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick } from 'vue'
import PageHead from '@/components/PageHead.vue'
import TableSearch from '@/components/TableSearch.vue'

const formItem = [
    { comp: 'input', prop: 'userId', label: '用户ID', placeholder: '请输入用户ID' },
    { comp: 'select', prop: 'moodScreRange', label: '情绪评分', placeholder: '请选择评分范围', options: [{
        label: '低分(1-3)',
        value: '1-3'
    },{
        label: '中分(4-6)',
        value: '4-6'
    },{
        label: '高分(7-10)',
        value: '7-10'
    }] }
]

const handleSearch = () => {}
</script>