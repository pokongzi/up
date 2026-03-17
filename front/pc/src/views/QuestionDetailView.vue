<template>
  <div class="question-detail-page">
    <div class="page-header">
      <el-button text @click="$router.back()">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
    </div>

    <div class="detail-content" v-if="question">
      <div class="content-main">
        <h1 class="question-title">{{ question.title }}</h1>
        
        <div class="material-section" v-if="question.material">
          <div class="material-title">给定材料</div>
          <div class="material-content">{{ question.material }}</div>
        </div>

        <div class="question-section" v-for="(q, idx) in question.questions" :key="idx">
          <div class="question-text">{{ idx + 1 }}. {{ q.text }}</div>
          <div class="question-requirement" v-if="q.requirement">
            <span class="label">作答要求：</span>{{ q.requirement }}
          </div>
        </div>

        <div class="answers-section">
          <h3>答案对比</h3>
          <div class="answer-compare">
            <div class="answer-card" v-for="ans in answers" :key="ans.source">
              <div class="answer-source">{{ ans.source }}</div>
              <div class="answer-content">{{ ans.content }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="content-sidebar">
        <div class="sidebar-card">
          <h4>题目信息</h4>
          <div class="info-item">
            <span class="label">省份：</span>{{ question.province }}
          </div>
          <div class="info-item">
            <span class="label">年份：</span>{{ question.year }}
          </div>
          <div class="info-item">
            <span class="label">类型：</span>{{ question.type }}
          </div>
          <div class="info-item">
            <span class="label">科目：</span>{{ question.subject }}
          </div>
        </div>
        
        <div class="sidebar-card">
          <h4>相关操作</h4>
          <el-button type="primary" style="width: 100%" @click="$router.push('/mock')">
            <el-icon><Edit /></el-icon>
            模拟此题
          </el-button>
          <el-button style="width: 100%; margin-top: 8px">
            <el-icon><Star /></el-icon>
            收藏此题
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft, Edit, Star } from '@element-plus/icons-vue'

const route = useRoute()
const question = ref(null)
const answers = ref([])

onMounted(() => {
  const id = route.params.id
  question.value = {
    id,
    title: '2024年公务员多省联考《申论》题（河南县级卷）',
    province: '河南',
    year: '2024',
    type: '县级卷',
    subject: '申论',
    material: '给定资料1-5，讲述了多个地方在推进高质量发展过程中的生动实践。Z市通过实施技术改造，推动传统产业转型升级；F市大力发展数字经济，培育新动能；W县推进乡村振兴，实现产业兴旺、生态宜居、乡风文明、治理有效、生活富裕的目标。这些地方的经验表明，高质量发展需要坚持创新驱动、绿色发展、共享发展的理念。',
    questions: [
      { text: '根据给定资料1，概括Z市在推进产业转型升级方面的主要做法。', requirement: '不超过250字' },
      { text: '根据给定资料2，分析数字经济对传统制造业的影响。', requirement: '不超过300字' }
    ]
  }

  answers.value = [
    { source: '华图', content: '一、主要做法：\n1. 实施技术改造，推动传统产业向智能化、数字化方向转型。\n2. 培育壮大新兴产业，重点发展新材料、新能源等战略性新兴产业。\n3. 加强科技创新，建设产业创新平台，提升企业自主创新能力。\n4. 优化产业布局，构建现代产业体系。' },
    { source: '粉笔', content: '一、具体举措：\n1. 加快技术改造升级，支持企业设备更新和智能化改造。\n2. 大力发展高新技术企业，培育科技型企业集群。\n3. 推进产学研合作，建立产业技术创新联盟。\n4. 优化营商环境，降低企业运营成本。' },
    { source: '中公', content: '一、经验做法：\n1. 实施创新驱动发展战略，提升产业核心竞争力。\n2. 推进数字经济与制造业深度融合。\n3. 加强关键技术攻关，突破"卡脖子"技术难题。\n4. 构建现代产业体系，推动产业集群化发展。' }
  ]
})
</script>

<style scoped>
.question-detail-page {
  max-width: 1400px;
  margin: 0 auto;
}

.detail-content {
  display: flex;
  gap: 24px;
}

.content-main {
  flex: 1;
  background: #fff;
  border-radius: 12px;
  padding: 32px;
}

.question-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
  line-height: 1.5;
}

.material-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
}

.material-content {
  font-size: 14px;
  line-height: 1.8;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
}

.question-text {
  font-size: 15px;
  font-weight: 500;
  margin-top: 24px;
  margin-bottom: 12px;
}

.question-requirement {
  font-size: 13px;
  color: #7f8c8d;
}

.question-requirement .label {
  color: #e74c3c;
}

.answers-section {
  margin-top: 40px;
}

.answers-section h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
}

.content-sidebar {
  width: 280px;
}

.sidebar-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
}

.sidebar-card h4 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e4e7ed;
}

.info-item {
  margin-bottom: 12px;
  font-size: 14px;
}

.info-item .label {
  color: #7f8c8d;
}
</style>
