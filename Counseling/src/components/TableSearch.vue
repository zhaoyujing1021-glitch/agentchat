<template>
    <el-form ref="formRef" :model="formData">
      <el-row :gutter="24">
        <template v-for="item in formItemAttrs" :key="item.prop">
          <el-col v-bind="item.col">
            <el-form-item :label="item.label" :prop="item.prop">
                <component 
                    v-model="formData[item.prop]" 
                    :is="isComp(item.comp)" 
                    :placeholder="item.placeholder"
                >
                    <template v-if="item.comp === 'select'">
                        <el-option label="全部" value="" />
                        <el-option
                            v-for="opt in item.options"
                            :key="opt.value"
                            :label="opt.label"
                            :value="opt.value" />
                    </template>
                </component>
            </el-form-item>
          </el-col>   
        </template>
      </el-row>
      <el-row>
          <el-form-item>
              <el-button type="primary" @click="handleSearch">検索</el-button> 
              <el-button @click="handleReset">リセット</el-button>
          </el-form-item>
      </el-row>
    </el-form>
</template>

<script setup>
import {ref, reactive,computed } from 'vue'



const props = defineProps({
    formItem: {
        type: Array,
        default: () => []
    }
})
const emit = defineEmits(['search', 'reset'])

const formItemAttrs = computed(() => {
    return props.formItem.map(item => ({
        ...item,
        col: item.col || { xs: 24, sm: 12, md: 8, lg: 6, xl: 6 }
    }))
})

const formData = reactive({})
const isComp = (comp) => {
    return {
        input: 'el-input',
        select: 'el-select'
    }[comp]
}

const formRef = ref(null)

const handleReset = () => {

    if (formRef.value) {
        formRef.value.resetFields()
    }


    Object.keys(formData).forEach(key => {
        formData[key] = ''
    })


    emit('reset')
}
</script>