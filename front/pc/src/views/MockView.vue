<template>
  <div class="mock-page">
    <div class="page-header">
      <h1 class="page-title">在线模拟</h1>
      <p class="page-desc">全真模拟考试环境，检验学习成果</p>
    </div>

    <el-tabs v-model="activeTab" @tab-change="handleTabChange">
      <el-tab-pane label="全真模拟" name="full">
        <div class="paper-grid">
          <div class="paper-card" v-for="paper in fullPapers" :key="paper.id" @click="startExam(paper)">
            <div class="paper-thumb">
              <el-icon><Document /></el-icon>
            </div>
            <div class="paper-info">
              <h4>{{ paper.title }}</h4>
              <p>{{ paper.province }} · {{ paper.year }} · {{ paper.type }}</p>
              <div class="paper-meta">
                <span><el-icon><Clock /></el-icon> {{ paper.duration }}分钟</span>
                <span><el-icon><Files /></el-icon> {{ paper.questionCount }}题</span>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="专项练习" name="special">
        <div class="special-grid">
          <div class="special-card" v-for="item in specialTypes" :key="item.id" @click="startSpecialPractice(item)">
            <div class="special-icon" :style="{ background: item.color }">
              <el-icon><Edit /></el-icon>
            </div>
            <div class="special-info">
              <h4>{{ item.name }}</h4>
              <p>{{ item.desc }}</p>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="历年真题" name="history">
        <div class="filter-bar">
          <el-select v-model="historyFilters.province" placeholder="选择省份" clearable>
            <el-option v-for="p in provinces" :key="p" :label="p" :value="p" />
          </el-select>
          <el-select v-model="historyFilters.year" placeholder="选择年份" clearable>
            <el-option label="2025" value="2025" />
            <el-option label="2024" value="2024" />
            <el-option label="2023" value="2023" />
          </el-select>
        </div>
        <div class="paper-grid">
          <div class="paper-card" v-for="paper in historyPapers" :key="paper.id" @click="startExam(paper)">
            <div class="paper-thumb">
              <el-icon><Document /></el-icon>
            </div>
            <div class="paper-info">
              <h4>{{ paper.title }}</h4>
              <p>{{ paper.province }} · {{ paper.year }} · {{ paper.type }}</p>
              <div class="paper-meta">
                <span><el-icon><Clock /></el-icon> {{ paper.duration }}分钟</span>
                <span><el-icon><Files /></el-icon> {{ paper.questionCount }}题</span>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="我的记录" name="records">
        <div class="records-list">
          <div class="record-card" v-for="record in examRecords" :key="record.id">
            <div class="record-info">
              <h4>{{ record.paperTitle }}</h4>
              <p>{{ record.examTime }}</p>
            </div>
            <div class="record-score">
              <span class="score">{{ record.score }}</span>
              <span class="label">分</span>
            </div>
            <div class="record-actions">
              <el-button type="primary" link @click="viewResult(record)">查看详情</el-button>
            </div>
          </div>
        </div>
        <div class="empty-state" v-if="examRecords.length === 0">
          <el-icon><Document /></el-icon>
          <p>暂无考试记录</p>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Document, Clock, Files, Edit } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'

const router = useRouter()
const activeTab = ref('full')

const provinces = ['河南', '北京', '上海', '广东', '浙江']

const historyFilters = reactive({
  province: '',
  year: ''
})

const fullPapers = ref([
  { id: 1, title: '2025年河南省公务员录用考试《申论》模拟卷', province: '河南', year: '2025', type: '县级卷', duration: 180, questionCount: 4 },
  { id: 2, title: '2024年河南省公务员录用考试《申论》模拟卷', province: '河南', year: '2024', type: '县级卷', duration: 180, questionCount: 4 },
  { id: 3, title: '2024年河南省公务员录用考试《申论》模拟卷', province: '河南', year: '2024', type: '乡镇卷', duration: 150, questionCount: 4 }
])

const specialTypes = [
  { id: 1, name: '归纳概括', desc: '练习归纳概括题型', color: 'linear-gradient(135deg, #3498db, #2ecc71)' },
  { id: 2, name: '对策建议', desc: '练习提出对策题型', color: 'linear-gradient(135deg, #9b59b6, #e74c3c)' },
  { id: 3, name: '贯彻执行', desc: '练习公文写作题型', color: 'linear-gradient(135deg, #f39c12, #e67e22)' },
  { id: 4, name: '大作文', desc: '练习申论大作文', color: 'linear-gradient(135deg, #1abc9c, #16a085)' }
]

const historyPapers = ref([
  { id: 10, title: '2024年公务员多省联考《申论》题（河南县级卷）', province: '河南', year: '2024', type: '县级卷', duration: 180, questionCount: 4 },
  { id: 11, title: '2024年公务员多省联考《申论》题（河南市级卷）', province: '河南', year: '2024', type: '市级卷', duration: 180, questionCount: 4 },
  { id: 12, title: '2023年河南省公务员录用考试《申论》题', province: '河南', year: '2023', type: '县级卷', duration: 180, questionCount: 4 }
])

const examRecords = ref([
  { id: 1, paperTitle: '2024年河南省公务员录用考试《申论》模拟卷', examTime: '2024-01-15 14:30', score: 72 },
  { id: 2, paperTitle: '2024年公务员多省联考《申论》题（河南县级卷）', examTime: '2024-01-10 09:00', score: 68 }
])

const handleTabChange = (tab) => {
  activeTab.value = tab
}

const startExam = async (paper) => {
  try {
    await ElMessageBox.confirm(
      `即将开始「${paper.title}」，考试时长${paper.duration}分钟，请做好准备。`,
      '开始考试',
      {
        confirmButtonText: '开始答题',
        cancelButtonText: '再想想',
        type: 'info'
      }
    )
    router.push(`/mock/${paper.id}`)
  } catch {}
}

const startSpecialPractice = (item) => {
  router.push(`/mock/special/${item.id}`)
}

const viewResult = (record) => {
  router.push(`/mock/result/${record.id}`)
}
</script>

<style scoped>
.mock-page {
  max-width: 1200px;
  margin: 0 auto;
}

.paper-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.paper-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.paper-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.paper-thumb {
  height: 120px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 48px;
}

.paper-info {
  padding: 20px;
}

.paper-info h4 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #2c3e50;
}

.paper-info p {
  font-size: 13px;
  color: #7f8c8d;
  margin-bottom: 12px;
}

.paper-meta {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #7f8c8d;
}

.paper-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.special-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.special-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 16px;
}

.special-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.special-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 24px;
}

.special-info h4 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.special-info p {
  font-size: 13px;
  color: #7f8c8d;
}

.records-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.record-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.record-info {
  flex: 1;
}

.record-info h4 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.record-info p {
  font-size: 13px;
  color: #7f8c8d;
}

.record-score {
  text-align: center;
  padding: 12px 24px;
  background: linear-gradient(135deg, #3498db, #2ecc71);
  border-radius: 12px;
  color: #fff;
}

.record-score .score {
  font-size: 28px;
  font-weight: 700;
}

.record-score .label {
  font-size: 14px;
  margin-left: 4px;
}
</style>
