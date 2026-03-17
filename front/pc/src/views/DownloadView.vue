<template>
  <div class="download-page">
    <div class="page-header">
      <h1 class="page-title">资料下载</h1>
      <p class="page-desc">下载历年真题、备考资料</p>
    </div>

    <div class="filter-bar">
      <el-select v-model="filters.province" placeholder="选择省份" clearable @change="handleFilterChange">
        <el-option label="全部省份" value="" />
        <el-option v-for="p in provinces" :key="p.id" :label="p.name" :value="p.id" />
      </el-select>
      <el-select v-model="filters.subject" placeholder="选择科目" clearable @change="handleFilterChange">
        <el-option label="全部科目" value="" />
        <el-option label="申论" value="shenlun" />
        <el-option label="行测" value="xingce" />
      </el-select>
      <el-select v-model="filters.year" placeholder="选择年份" clearable @change="handleFilterChange">
        <el-option label="全部年份" value="" />
        <el-option label="2025" value="2025" />
        <el-option label="2024" value="2024" />
        <el-option label="2023" value="2023" />
        <el-option label="2022" value="2022" />
      </el-select>
      <el-select v-model="filters.type" placeholder="选择类型" clearable @change="handleFilterChange">
        <el-option label="全部类型" value="" />
        <el-option label="乡镇卷" value="xiangzhen" />
        <el-option label="县级卷" value="xianji" />
        <el-option label="市级卷" value="shiji" />
      </el-select>
      <el-input
        v-model="filters.keyword"
        placeholder="搜索资料名称"
        clearable
        style="width: 240px"
        @input="handleFilterChange"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>

    <div class="resource-grid" v-loading="loading">
      <div
        class="resource-card"
        v-for="item in resources"
        :key="item.id"
        @click="handlePreview(item)"
      >
        <div class="resource-thumb">
          <el-icon><Document /></el-icon>
        </div>
        <div class="resource-info">
          <h4 class="resource-title">{{ item.name }}</h4>
          <div class="resource-meta">
            <span class="resource-tag">{{ item.province }}</span>
            <span>{{ item.year }}</span>
            <span>{{ item.subject }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="empty-state" v-if="!loading && resources.length === 0">
      <el-icon><FolderOpened /></el-icon>
      <p>暂无资料</p>
    </div>

    <div class="pagination-wrapper" v-if="total > pageSize">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="prev, pager, next"
        @current-change="handlePageChange"
      />
    </div>

    <el-dialog v-model="previewVisible" title="资料预览" width="70%">
      <div class="preview-content" v-if="currentResource">
        <h3>{{ currentResource.name }}</h3>
        <p class="preview-meta">{{ currentResource.province }} · {{ currentResource.year }} · {{ currentResource.subject }}</p>
        <div class="preview-pdf" v-if="currentResource.url">
          <iframe :src="currentResource.previewUrl" width="100%" height="500px"></iframe>
        </div>
      </div>
      <template #footer>
        <el-button @click="previewVisible = false">关闭</el-button>
        <el-button type="primary" @click="handleDownload(currentResource)">
          <el-icon><Download /></el-icon>
          下载
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Search, Document, FolderOpened, Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const provinces = ref([])
const resources = ref([])
const previewVisible = ref(false)
const currentResource = ref(null)

const filters = reactive({
  province: '',
  subject: '',
  year: '',
  type: '',
  keyword: ''
})

const currentPage = ref(1)
const pageSize = ref(12)
const total = ref(0)

const mockResources = [
  { id: 1, name: '2025年河南省公务员录用考试《行测》题（网友回忆版）', province: '河南', year: '2025', subject: '行测', type: '县级', url: '/files/2025henanxingce.pdf', previewUrl: '' },
  { id: 2, name: '2024年河南省公务员录用考试《行测》题（网友回忆版）', province: '河南', year: '2024', subject: '行测', type: '县级', url: '/files/2024henanxingce.pdf', previewUrl: '' },
  { id: 3, name: '2024年公务员多省联考《申论》题（河南县级卷）', province: '河南', year: '2024', subject: '申论', type: '县级', url: '/files/2024henanshenlun.pdf', previewUrl: '' },
  { id: 4, name: '2024年公务员多省联考《申论》题（河南市级卷）', province: '河南', year: '2024', subject: '申论', type: '市级', url: '/files/2024henanshenlun.pdf', previewUrl: '' },
  { id: 5, name: '2023年河南省公务员录用考试《行测》题', province: '河南', year: '2023', subject: '行测', type: '县级', url: '/files/2023henanxingce.pdf', previewUrl: '' },
  { id: 6, name: '2023年公务员多省联考《申论》题（河南县级卷）', province: '河南', year: '2023', subject: '申论', type: '县级', url: '/files/2023henanshenlun.pdf', previewUrl: '' },
  { id: 7, name: '省考行测母题200道-判断', province: '通用', year: '', subject: '行测', type: '备考资料', url: '/files/muti-panduan.pdf', previewUrl: '' },
  { id: 8, name: '省考行测母题200道-数资', province: '通用', year: '', subject: '行测', type: '备考资料', url: '/files/muti-shuzi.pdf', previewUrl: '' },
  { id: 9, name: '省考行测母题200道-言语', province: '通用', year: '', subject: '行测', type: '备考资料', url: '/files/muti-yuyan.pdf', previewUrl: '' },
  { id: 10, name: '如何突破分数瓶颈期—判断推理篇', province: '通用', year: '', subject: '行测', type: '技巧', url: '/files/skill-panduan.pdf', previewUrl: '' },
  { id: 11, name: '如何突破分数瓶颈期—数资篇', province: '通用', year: '', subject: '行测', type: '技巧', url: '/files/skill-shuzi.pdf', previewUrl: '' },
  { id: 12, name: '如何突破分数瓶颈期—言语篇', province: '通用', year: '', subject: '行测', type: '技巧', url: '/files/skill-yuyan.pdf', previewUrl: '' }
]

onMounted(() => {
  loadProvinces()
  loadResources()
})

const loadProvinces = () => {
  provinces.value = [
    { id: 1, name: '河南' },
    { id: 2, name: '北京' },
    { id: 3, name: '上海' },
    { id: 4, name: '广东' },
    { id: 5, name: '浙江' },
    { id: 6, name: '江苏' },
    { id: 7, name: '山东' }
  ]
}

const loadResources = () => {
  loading.value = true
  setTimeout(() => {
    let list = [...mockResources]
    
    if (filters.province) {
      list = list.filter(r => r.province === filters.province || r.province === '通用')
    }
    if (filters.subject) {
      list = list.filter(r => r.subject === filters.subject)
    }
    if (filters.year) {
      list = list.filter(r => r.year === filters.year || !r.year)
    }
    if (filters.keyword) {
      list = list.filter(r => r.name.includes(filters.keyword))
    }
    
    total.value = list.length
    resources.value = list.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value)
    loading.value = false
  }, 300)
}

const handleFilterChange = () => {
  currentPage.value = 1
  loadResources()
}

const handlePageChange = (page) => {
  currentPage.value = page
  loadResources()
}

const handlePreview = (item) => {
  currentResource.value = item
  previewVisible.value = true
}

const handleDownload = (item) => {
  if (item.url) {
    const link = document.createElement('a')
    link.href = item.url
    link.download = item.name
    link.click()
    ElMessage.success('开始下载')
  }
}
</script>

<style scoped>
.download-page {
  max-width: 1400px;
  margin: 0 auto;
}

.preview-content h3 {
  margin-bottom: 8px;
}

.preview-meta {
  color: #7f8c8d;
  margin-bottom: 16px;
}

.preview-pdf {
  background: #f5f7fa;
  border-radius: 8px;
  overflow: hidden;
}
</style>
