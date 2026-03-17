<template>
  <div class="mock-exam-page">
    <div class="exam-header">
      <div class="exam-info">
        <h2 class="exam-title">{{ paper.title }}</h2>
        <div class="exam-meta">
          <span>{{ paper.province }}</span>
          <span>{{ paper.year }}</span>
          <span>{{ paper.type }}</span>
        </div>
      </div>
      <div class="exam-timer" :class="timerClass">
        <el-icon><Clock /></el-icon>
        <span>{{ formattedTime }}</span>
      </div>
      <div class="exam-actions">
        <el-button @click="showAnswerCard = true">
          <el-icon><List /></el-icon>
          答题卡
        </el-button>
        <el-button type="primary" @click="handleSubmit">
          交卷
        </el-button>
      </div>
    </div>

    <div class="exam-body">
      <div class="exam-content">
        <div class="material-section" v-if="currentQuestion.material">
          <div class="material-title">给定材料</div>
          <div class="material-content">{{ currentQuestion.material }}</div>
        </div>

        <div class="question-section">
          <div class="question-header">
            <span class="question-number">第 {{ currentIndex + 1 }} 题 / 共 {{ questions.length }} 题</span>
            <el-button text type="warning" @click="toggleMark">
              <el-icon><Flag /></el-icon>
              {{ isMarked ? '取消标记' : '标记此题' }}
            </el-button>
          </div>
          <div class="question-text">{{ currentQuestion.text }}</div>
          <div class="question-requirement" v-if="currentQuestion.requirement">
            <span class="label">作答要求：</span>{{ currentQuestion.requirement }}
          </div>

          <div class="answer-area">
            <el-input
              type="textarea"
              v-model="answers[currentIndex]"
              :rows="10"
              placeholder="请在此输入答案..."
              @input="handleAnswerChange"
            />
            <div class="word-count">
              字数统计：{{ answers[currentIndex]?.length || 0 }} 字
            </div>
          </div>
        </div>

        <div class="question-nav">
          <el-button :disabled="currentIndex === 0" @click="prevQuestion">
            <el-icon><ArrowLeft /></el-icon>
            上一题
          </el-button>
          <el-button :disabled="currentIndex === questions.length - 1" @click="nextQuestion">
            下一题
            <el-icon><ArrowRight /></el-icon>
          </el-button>
        </div>
      </div>
    </div>

    <el-drawer v-model="showAnswerCard" title="答题卡" direction="rtl" size="320px">
      <div class="drawer-content">
        <div class="answer-card-header">
          <span>答题状态</span>
          <div class="legend">
            <span class="legend-item"><span class="dot done"></span> 已答</span>
            <span class="legend-item"><span class="dot"></span> 未答</span>
            <span class="legend-item"><span class="dot mark"></span> 标记</span>
          </div>
        </div>
        <div class="answer-card-list">
          <div
            class="answer-card-item"
            v-for="(q, idx) in questions"
            :key="idx"
            :class="{
              active: idx === currentIndex,
              done: answers[idx]?.length > 0,
              mark: markedQuestions.includes(idx)
            }"
            @click="goToQuestion(idx)"
          >
            {{ idx + 1 }}
          </div>
        </div>
        <div class="drawer-footer">
          <el-button type="primary" @click="handleSubmit" style="width: 100%">交卷</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Clock, List, Flag, ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()

const paper = ref({
  id: 1,
  title: '2025年河南省公务员录用考试《申论》模拟卷',
  province: '河南',
  year: '2025',
  type: '县级卷',
  duration: 180
})

const questions = ref([
  {
    id: 1,
    text: '根据给定资料1，概括Z市在推进产业转型升级方面的主要做法。',
    requirement: '不超过250字',
    material: '给定资料1：近年来，Z市积极推进产业转型升级，取得了显著成效。一是实施技术改造，推动传统产业向智能化、数字化方向转型...'
  },
  {
    id: 2,
    text: '根据给定资料2，分析数字经济对传统制造业的影响。',
    requirement: '不超过300字',
    material: '给定资料2：数字经济的快速发展为传统制造业带来了新的机遇和挑战...'
  },
  {
    id: 3,
    text: '根据给定资料3，针对农村空心化问题提出对策。',
    requirement: '不超过400字',
    material: '给定资料3：随着城镇化进程加快，农村空心化问题日益突出...'
  },
  {
    id: 4,
    text: '请根据给定资料，结合实际，自拟题目，写一篇议论文。',
    requirement: '800-1000字',
    material: '给定资料4：高质量发展是全面建设社会主义现代化国家的首要任务...'
  }
])

const answers = reactive({})
const markedQuestions = ref([])
const currentIndex = ref(0)
const showAnswerCard = ref(false)

const remainingTime = ref(paper.value.duration * 60)
let timer = null

const formattedTime = computed(() => {
  const minutes = Math.floor(remainingTime.value / 60)
  const seconds = remainingTime.value % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})

const timerClass = computed(() => {
  if (remainingTime.value < 300) return 'danger'
  if (remainingTime.value < 600) return 'warning'
  return ''
})

const currentQuestion = computed(() => questions.value[currentIndex.value])

const isMarked = computed(() => markedQuestions.value.includes(currentIndex.value))

onMounted(() => {
  timer = setInterval(() => {
    if (remainingTime.value > 0) {
      remainingTime.value--
    } else {
      handleSubmit()
    }
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const handleAnswerChange = () => {}

const toggleMark = () => {
  const idx = currentIndex.value
  if (isMarked.value) {
    markedQuestions.value = markedQuestions.value.filter(i => i !== idx)
  } else {
    markedQuestions.value.push(idx)
  }
}

const prevQuestion = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

const nextQuestion = () => {
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++
  }
}

const goToQuestion = (idx) => {
  currentIndex.value = idx
  showAnswerCard.value = false
}

const handleSubmit = async () => {
  const unanswered = questions.value.filter((_, idx) => !answers[idx]?.length)
  
  let msg = '确定要交卷吗？'
  if (unanswered.length > 0) {
    msg = `您还有 ${unanswered.length} 题未作答，确定要交卷吗？`
  }

  try {
    await ElMessageBox.confirm(msg, '交卷确认', {
      confirmButtonText: '确定交卷',
      cancelButtonText: '继续作答',
      type: 'warning'
    })
    
    if (timer) clearInterval(timer)
    router.push(`/mock/result/${paper.value.id}`)
  } catch {}
}
</script>

<style scoped>
.mock-exam-page {
  min-height: 100vh;
  background: #f5f7fa;
}

.exam-header {
  background: #fff;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e4e7ed;
  position: sticky;
  top: 0;
  z-index: 100;
}

.exam-info {
  flex: 1;
}

.exam-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
}

.exam-meta {
  font-size: 13px;
  color: #7f8c8d;
}

.exam-meta span {
  margin-right: 12px;
}

.exam-timer {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
  padding: 8px 20px;
  background: #f0f4f8;
  border-radius: 8px;
  margin: 0 20px;
}

.exam-timer.warning {
  color: #f39c12;
  background: #fef5e7;
}

.exam-timer.danger {
  color: #e74c3c;
  background: #fdeaea;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.exam-actions {
  display: flex;
  gap: 12px;
}

.exam-body {
  padding: 24px;
  max-width: 1000px;
  margin: 0 auto;
}

.exam-content {
  background: #fff;
  border-radius: 12px;
  padding: 32px;
}

.material-section {
  background: #fafbfc;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 24px;
  border: 1px solid #e4e7ed;
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
}

.question-section {
  margin-bottom: 24px;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.question-number {
  font-size: 14px;
  color: #7f8c8d;
  font-weight: 500;
}

.question-text {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 12px;
  line-height: 1.6;
}

.question-requirement {
  font-size: 13px;
  color: #7f8c8d;
  margin-bottom: 20px;
}

.question-requirement .label {
  color: #e74c3c;
}

.answer-area {
  margin-top: 20px;
}

.word-count {
  text-align: right;
  font-size: 13px;
  color: #7f8c8d;
  margin-top: 8px;
}

.question-nav {
  display: flex;
  justify-content: space-between;
  padding-top: 24px;
  border-top: 1px solid #e4e7ed;
}

.drawer-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.answer-card-header {
  padding-bottom: 16px;
  border-bottom: 1px solid #e4e7ed;
  margin-bottom: 16px;
}

.answer-card-header > span {
  font-size: 16px;
  font-weight: 600;
}

.legend {
  display: flex;
  gap: 16px;
  margin-top: 12px;
  font-size: 12px;
  color: #7f8c8d;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 4px;
  background: #f0f4f8;
}

.dot.done {
  background: #2ecc71;
}

.dot.mark {
  background: transparent;
  border: 2px solid #f39c12;
}

.answer-card-list {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  align-content: start;
}

.answer-card-item {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  background: #f0f4f8;
  color: #7f8c8d;
}

.answer-card-item:hover {
  background: #e0e8f0;
}

.answer-card-item.active {
  background: #3498db;
  color: #fff;
}

.answer-card-item.done {
  background: #2ecc71;
  color: #fff;
}

.answer-card-item.mark {
  border: 2px solid #f39c12;
}

.drawer-footer {
  padding-top: 16px;
  border-top: 1px solid #e4e7ed;
}
</style>
