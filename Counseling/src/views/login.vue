<template>
    <div class="container">
        <div class="title">
            <div class="back-home">
                <el-icon><Back /></el-icon>
                <span>返回首页</span>
            </div>
            <div class="title-text">
                <h2>登录您的账户</h2>
                <p>请输入您的登录信息</p>
            </div>
        </div>
        <div class="form-container">
            <el-form
                ref="ruleFormRef"
                :model="formData"
                :rules="rules"
                label-position="top"
            >
                <el-form-item label="用户名或邮箱" prop="username">
                    <el-input v-model="formData.username" size="large" placeholder="请输入用户名" />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="formData.password" size="large" placeholder="请输入密码" type="password" showp-password />
                </el-form-item>
                <el-form-item>
                    <el-button class="btn" size="large" type="primary" @click="submitForm(ruleFormRef)">登录</el-button>
                </el-form-item>
            </el-form>
            <div class="footer">
                <p>还没有账户？<router-link to="/auth/register">注册?</router-link></p>
                <el-button type="primary" @click="handleLogin">登录</el-button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import {login} from '@/api/admin'
import { useRouter } from 'vue-router'
const ruleFormRef = ref()

const formData = reactive({
    username: '',
    password: ''
})
const rules = reactive({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
    ]
})

// 登录
const router =useRouter()
const submitForm = async (formEl) => {
    await formEl.validate((valid, fields) => {
        if (valid) {
            console.log(formData,'formData')
            login(formData).then(data => {
                // 判断token是否存在
                if (!data.token) {
                    return console.error('登录失败')
                }
                // 登录成功，保存token和用户信息
                localStorage.setItem('token', data.token)
                localStorage.setItem('userInfo', JSON.stringify(data.userInfo))
                // 根据用户角色决定跳转的路径
                if (data.userInfo.userType === 2) {
                    router.push('/back/dashboard')
                } else {
                    
                }
            })
        }
    })
}
</script>