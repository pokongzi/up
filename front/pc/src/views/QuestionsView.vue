<template>
  <div class="questions-page">
    <div class="page-header">
      <h1 class="page-title">真题在线查看</h1>
      <p class="page-desc">浏览历年真题，对比多机构答案</p>
    </div>

    <div class="filter-bar">
      <el-select v-model="filters.province" placeholder="选择省份" clearable @change="handleProvinceChange">
        <el-option label="全部省份" value="" />
        <el-option v-for="p in provinces" :key="p.id" :label="p.name" :value="p.id" />
      </el-select>
      <el-select v-model="filters.year" placeholder="选择年份" clearable :disabled="!filters.province" @change="loadQuestions">
        <el-option label="全部年份" value="" />
        <el-option v-for="y in years" :key="y" :label="y" :value="y" />
      </el-select>
      <el-select v-model="filters.type" placeholder="选择类型" clearable @change="loadQuestions">
        <el-option label="全部类型" value="" />
        <el-option label="乡镇卷" value="xiangzhen" />
        <el-option label="县级卷" value="xianji" />
        <el-option label="市级卷" value="shiji" />
      </el-select>
      <el-select v-model="filters.subject" placeholder="选择科目" clearable @change="loadQuestions">
        <el-option label="全部科目" value="" />
        <el-option label="申论" value="shenlun" />
        <el-option label="行测" value="xingce" />
      </el-select>
    </div>

    <div class="questions-layout">
      <div class="questions-list-section">
        <div class="list-header">
          <span>题目列表</span>
          <span class="list-count">共 {{ total }} 题</span>
        </div>
        <div class="question-list" v-loading="loading">
          <div
            class="question-item"
            v-for="q in questions"
            :key="q.id"
            :class="{ active: currentQuestion?.id === q.id }"
            @click="selectQuestion(q)"
          >
            <div class="question-item-title">{{ q.title }}</div>
            <div class="question-item-meta">
              <span>{{ q.province }}</span>
              <span>{{ q.year }}</span>
              <span>{{ q.type }}</span>
            </div>
          </div>
        </div>
        <div class="empty-state" v-if="!loading && questions.length === 0">
          <el-icon><Document /></el-icon>
          <p>暂无题目</p>
        </div>
        <div class="pagination-wrapper">
          <el-pagination
            v-model:current-page="currentPage"
            :page-size="pageSize"
            :total="total"
            layout="prev, pager, next"
            @current-change="handlePageChange"
          />
        </div>
      </div>

      <div class="question-detail-section">
        <div class="detail-empty" v-if="!currentQuestion">
          <el-icon><Document /></el-icon>
          <p>请选择题目查看详情</p>
        </div>
        <div class="question-content" v-else v-loading="detailLoading">
          <div class="content-header">
            <h2>{{ currentQuestion.title }}</h2>
            <div class="content-actions">
              <el-button :type="isCollected ? 'warning' : 'default'" circle @click="toggleCollect">
                <el-icon><Star /></el-icon>
              </el-button>
              <el-button circle @click="shareQuestion">
                <el-icon><Share /></el-icon>
              </el-button>
            </div>
          </div>
          
          <div class="material-section" v-if="currentQuestion.material">
            <div class="material-title">给定材料</div>
            <div class="material-content">{{ currentQuestion.material }}</div>
          </div>

          <div class="question-section" v-for="(item, idx) in currentQuestion.questions" :key="idx">
            <div class="question-text">{{ idx + 1 }}. {{ item.text }}</div>
            <div class="question-requirement" v-if="item.requirement">
              <span class="label">作答要求：</span>{{ item.requirement }}
            </div>
          </div>

          <div class="answers-section">
            <div class="answers-header">
              <h3>答案对比</h3>
            </div>
            <div class="answer-compare">
              <div class="answer-card" v-for="ans in answers" :key="ans.source">
                <div class="answer-source">{{ ans.source }}</div>
                <div class="answer-content">{{ ans.content }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Document, Star, Share } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const detailLoading = ref(false)
const provinces = ref([])
const years = ref([])
const questions = ref([])
const currentQuestion = ref(null)
const answers = ref([])
const isCollected = ref(false)

const filters = reactive({
  province: '',
  year: '',
  type: '',
  subject: ''
})

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const mockQuestions = [
  {
    id: 1,
    title: '2024年公务员多省联考《申论》题（河南县级卷）',
    province: '河南',
    year: '2024',
    type: '县级卷',
    subject: '申论',
    material: '给定资料1-5，讲述了多个地方在推进高质量发展过程中的生动实践...',
    questions: [
      { text: '根据给定资料1，概括Z市在推进产业转型升级方面的主要做法。', requirement: '不超过250字' },
      { text: '根据给定资料2，分析数字经济对传统制造业的影响。', requirement: '不超过300字' }
    ]
  },
  {
    id: 2,
    title: '2024年公务员多省联考《申论》题（河南市级卷）',
    province: '河南',
    year: '2024',
    type: '市级卷',
    subject: '申论',
    material: '给定资料1-4，讲述了基层治理中的创新实践...',
    questions: [
      { text: '根据给定资料1，概括F市在社区治理方面的创新举措。', requirement: '不超过200字' }
    ]
  },
  {
    id: 3,
    title: '2023年河南省公务员录用考试《申论》题（县级卷）',
    province: '河南',
    year: '2023',
    type: '县级卷',
    subject: '申论',
    material: '给定资料1-5，讲述了乡村振兴的典型案例...',
    questions: [
      { text: '根据给定资料1，概括W县在推进乡村振兴中的主要经验。', requirement: '不超过250字' },
      { text: '根据给定资料3，针对农村空心化问题提出对策。', requirement: '不超过400字' }
    ]
  }
]

const mockAnswers = [
  { source: '华图', content: '一、产业升级做法：1. 实施技术改造...（详细答案略）' },
  { source: '粉笔', content: '一、主要做法：1. 加快技术创新...（详细答案略）' },
  { source: '中公', content: '一、具体举措：1. 推进智能化改造...（详细答案略）' }
]

onMounted(() => {
  loadProvinces()
  loadQuestions()
})

const loadProvinces = () => {
  provinces.value = [
    { id: 1, name: '河南' },
    { id: 2, name: '北京' },
    { id: 3, name: '上海' },
    { id: 4, name: '广东' }
  ]
}

const loadQuestions = () => {
  loading.value = true
  setTimeout(() => {
    let list = [...mockQuestions]
    
    if (filters.province) {
      list = list.filter(q => q.province === filters.province)
    }
    if (filters.year) {
      list = list.filter(q => q.year === filters.year)
    }
    if (filters.type) {
      list = list.filter(q => q.type.includes(filters.type))
    }
    if (filters.subject) {
      list = list.filter(q => q.subject === filters.subject)
    }
    
    total.value = list.length
    questions.value = list.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value)
    loading.value = false
  }, 300)
}

const handleProvinceChange = () => {
  years.value = ['2025', '2024', '2023', '2022']
  filters.year = ''
  loadQuestions()
}

const handlePageChange = (page) => {
  currentPage.value = page
  loadQuestions()
}

const selectQuestion = (q) => {
  currentQuestion.value = q
  detailLoading.value = true
  setTimeout(() => {
    answers.value = mockAnswers
    isCollected.value = false
    detailLoading.value = false
  }, 300)
}

const toggleCollect = () => {
  isCollected.value = !isCollected.value
  ElMessage.success(isCollected.value ? '收藏成功' : '已取消收藏')
}

const shareQuestion = () => {
  ElMessage.success('分享链接已复制')
}
</script>

<style scoped>
.questions-page {
  height: calc(100vh - var(--header-height));
  display: flex;
  flex-direction: column;
}

.questions-layout {
  flex: 1;
  display: flex;
  gap: 20px;
  min-height: 0;
}

.questions-list-section {
  width: 400px;
  background: #fff;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.list-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.list-count {
  font-size: 13px;
  color: #7f8c8d;
  font-weight: normal;
}

.question-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.question-detail-section {
  flex: 1;
  background: #fff;
  border-radius: 12px;
  overflow-y: auto;
}

.detail-empty {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #7f8c8d;
}

.detail-empty .el-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.question-content {
  padding: 24px;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.content-header h2 {
  font-size: 20px;
  font-weight: 600;
  flex: 1;
}

.content-actions {
  display: flex;
  gap: 8px;
}

.material-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #2c3e50;
}

.material-content {
  font-size: 14px;
  line-height: 1.8;
  color: #34495e;
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  white-space: pre-wrap;
}

.question-text {
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 12-top: 20px;
  marginpx;
}

.question-requirement {
  font-size: 13px;
  color: #7f8c8d;
  margin-bottom: 16px;
}

.question-requirement .label {
  color: #e74c3c;
}

.answers-section {
  margin-top: 32px;
}

.answers-header {
  margin-bottom: 16px;
}

.answers-header h3 {
  font-size: 18px;
  font-weight: 600;
}
</style>
