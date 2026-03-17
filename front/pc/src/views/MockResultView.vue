<template>
  <div class="mock-result-page">
    <div class="page-header">
      <h1 class="page-title">考试结果</h1>
    </div>

    <div class="result-summary">
      <div class="result-card">
        <div class="result-score">{{ result.totalScore }}</div>
        <div class="result-label">总分</div>
      </div>
      <div class="result-card">
        <div class="result-score" style="color: #2ecc71">{{ result.answerRate }}%</div>
        <div class="result-label">完成率</div>
      </div>
      <div class="result-card">
        <div class="result-score" style="color: #f39c12">{{ result.avgTime }}</div>
        <div class="result-label">平均用时(分钟)</div>
      </div>
      <div class="result-card">
        <div class="result-score" style="color: #9b59b6">{{ result.rank }}</div>
        <div class="result-label">排名</div>
      </div>
    </div>

    <div class="result-content">
      <div class="result-main">
        <div class="card">
          <h3 class="card-title">答题情况</h3>
          <div class="answer-list">
            <div class="answer-item" v-for="(item, idx) in result.answers" :key="idx">
              <div class="answer-header">
                <span class="answer-number">第 {{ idx + 1 }} 题</span>
                <el-tag :type="item.score >= 60 ? 'success' : 'danger'">
                  {{ item.score }}分
                </el-tag>
              </div>
              <div class="answer-question">{{ item.question }}</div>
              <div class="answer-user">
                <span class="label">你的答案：</span>
                <div class="answer-text">{{ item.userAnswer }}</div>
              </div>
              <div class="answer-reference">
                <span class="label">参考答案：</span>
                <div class="answer-text">{{ item.referenceAnswer }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="result-sidebar">
        <div class="card">
          <h3 class="card-title">操作</h3>
          <el-button type="primary" style="width: 100%" @click="$router.push('/mock')">
            <el-icon><Refresh /></el-icon>
            再做一次
          </el-button>
          <el-button style="width: 100%; margin-top: 12px" @click="$router.push('/questions')">
            <el-icon><View /></el-icon>
            查看真题
          </el-button>
        </div>

        <div class="card">
          <h3 class="card-title">答案解析</h3>
          <div class="analysis-list">
            <div class="analysis-item" v-for="(item, idx) in result.answers" :key="idx">
              <div class="analysis-title">第 {{ idx + 1 }} 题得分点</div>
              <div class="analysis-content">{{ item.keyPoints }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { Refresh, View } from '@element-plus/icons-vue'

const route = useRoute()

const result = ref({
  totalScore: 72,
  answerRate: 100,
  avgTime: 150,
  rank: 35,
  answers: [
    {
      question: '根据给定资料1，概括Z市在推进产业转型升级方面的主要做法。',
      score: 18,
      userAnswer: '一是实施技术改造，推动传统产业智能化转型；二是培育新兴产业；三是加强科技创新。',
      referenceAnswer: '主要做法：1. 实施技术改造，推动传统产业向智能化、数字化方向转型；2. 培育壮大新兴产业，重点发展新材料、新能源等战略性新兴产业；3. 加强科技创新，建设产业创新平台；4. 优化产业布局，构建现代产业体系。',
      keyPoints: '技术改造、新兴产业、科技创新、产业布局'
    },
    {
      question: '根据给定资料2，分析数字经济对传统制造业的影响。',
      score: 16,
      userAnswer: '数字经济带来了机遇也带来了挑战，促进了制造业的数字化转型，但同时也带来了就业压力。',
      referenceAnswer: '数字经济对传统制造业的影响：1. 推动生产方式变革，实现智能化生产；2. 促进产业链重构，提升效率；3. 带来新的商业模式和增长点；4. 同时也面临技术、人才等挑战。',
      keyPoints: '生产方式变革、产业链重构、商业模式、技术挑战'
    },
    {
      question: '根据给定资料3，针对农村空心化问题提出对策。',
      score: 20,
      userAnswer: '一是发展特色产业，吸引外出人员返乡；二是完善基础设施；三是加强公共服务。',
      referenceAnswer: '对策建议：1. 发展特色产业，创造就业机会；2. 完善农村基础设施；3. 提升公共服务水平；4. 推进土地制度改革；5. 加强乡村文化建设。',
      keyPoints: '产业发展、基础设施、公共服务、土地制度、文化建设'
    },
    {
      question: '请根据给定资料，结合实际，自拟题目，写一篇议论文。',
      score: 18,
      userAnswer: '标题：坚持高质量发展建设现代化强国...（文章省略）',
      referenceAnswer: '参考答案需围绕高质量发展主题，论点明确，论据充分，论证有力，逻辑清晰，字数符合要求。',
      keyPoints: '论点明确、论据充分、论证有力、逻辑清晰'
    }
  ]
})
</script>

<style scoped>
.mock-result-page {
  max-width: 1200px;
  margin: 0 auto;
}

.result-content {
  display: flex;
  gap: 24px;
}

.result-main {
  flex: 1;
}

.result-sidebar {
  width: 320px;
}

.answer-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.answer-item {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
}

.answer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.answer-number {
  font-size: 15px;
  font-weight: 600;
}

.answer-question {
  font-size: 14px;
  color: #2c3e50;
  margin-bottom: 12px;
  line-height: 1.6;
}

.answer-user,
.answer-reference {
  margin-top: 12px;
  font-size: 13px;
}

.answer-user .label,
.answer-reference .label {
  color: #7f8c8d;
  font-weight: 500;
}

.answer-text {
  margin-top: 8px;
  padding: 12px;
  background: #fff;
  border-radius: 6px;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;
}

.analysis-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.analysis-item {
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.analysis-title {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 8px;
}

.analysis-content {
  font-size: 12px;
  color: #7f8c8d;
}
</style>
