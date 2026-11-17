<template>
    <div>
        <PageHead title="咨询记录" />
        <el-table :data="tableData" style="width: 100%; margin-top: 25px">
            <el-table-column label="会话ID" width="100">
                <template #default="scope">
                    <div style="display: flex; align-items: center">
                        <!-- el-avatar 内部直接写昵称，实现文字头像效果 -->
                        <el-avatar :src="scope.row.avatar" :size="32" style="margin-right: 10px; background-color: #8FBC8F;">
                            {{ getNickName(scope.row) ? getNickName(scope.row).slice(0, 5) : '用户' }}
                        </el-avatar>
                    </div>
                </template>
            </el-table-column>
            
            <el-table-column label="情绪日志" min-width="450">
                <template #default="scope">
                    <div class="session-title">{{ scope.row.sessionTitle }}</div>
                    <div class="session-preview">{{ scope.row.lastMessageContent }}</div>
                </template>
            </el-table-column>

            <el-table-column prop="messageCount" label="消息数" width="100" />
            <el-table-column prop="lastMessageTime" label="时间" width="180" />
            <el-table-column label="操作" width="100" fixed="right">
                <template #default="scope">
                    <el-button type="primary" text @click="viewSessionDetail(scope.row)">详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            style="margin-top: 25px;"
            :page-size="pagination.size"
            layout="prev, pager, next"
            :total="pagination.total"
            @change="handleChange"
        />
        <el-dialog
            v-model="showDetailDialog"
            title="咨询会话详情"
            width="70%"
            :close-on-click-modal="false"
        >
            <div class="session-detail">
                <div class="detail-header">
                    <div class="detail-row">
                        <div class="detail-label">用户：</div>
                        <div class="detail-value">{{sessionDetail.userNickname}}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">开始时间：</div>
                        <div class="detail-value">{{ sessionDetail.startedAt }}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">消息数：</div>
                        <div class="detail-value">{{ sessionDetail.messageCount }}</div>
                    </div>
                </div>
                <div class="messages-container">
                    <div class="messages-header">
                        <h4>对话记录</h4>
                    </div>
                    <div class="messages-list" v-loading="LoadingMessages">
                        <div v-for="message in sessionMessages" :key="message.id" class="message-item" :class="message.senderType === 1 ? 'user-message' : 'ai-message'">
                            <div class="message-header-info">
                                <span class="sender">{{ message.senderType === 1 ? '用户' : 'AI助手' }}</span>
                                <span class="time">{{ message.createdAt }}</span>
                            </div>
                            <div class="message-content">{{ message.content }}</div>
                        </div>
                    </div>
                </div>  
            </div>
            <template #footer>
                <el-button @click="showDetailDialog = false">关闭</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue'
import PageHead from '@/components/PageHead.vue'
import { getConsultationPage,getSessionDetail } from '@/api/admin'

const tableData = ref([])

const pagination = reactive({
    currentPage: 1,
    size: 10,
    total: 0
})


// 会话详情
const showDetailDialog = ref(false)
const sessionDetail = ref({})
const sessionMessages = ref([])
const LoadingMessages = ref(false)

const viewSessionDetail = (row) => {
    LoadingMessages.value=true
    getSessionDetail(row.id).then(res => {
        LoadingMessages.value=false
        sessionMessages.value = res
        sessionDetail.value = row
        showDetailDialog.value = true
    })
}

const currentFormData = ref({})

// 兼容后端可能返回的各种昵称字段名
const getNickName = (row) => {
    return row.userNickname  
        || row.userNickName
        || row.nickname
        || row.userName
        || row.username
        || ''
}


const handleChange = (page) => {
    pagination.currentPage = page
    handleSearch(currentFormData.value)
}

const handleSearch = (formData = {}) => {
    currentFormData.value = formData
    const params = {
        ...pagination,
        ...formData
    }
    // 修复点：确保参数正确传入并在 then 中正确接收 res
    getConsultationPage(params).then(res => {
        console.log('API 返回完整数据:', res)
        const { records, total } = res
        tableData.value = records
        pagination.total = total
    })
}

onMounted(() => {
    handleSearch()
})
</script>

