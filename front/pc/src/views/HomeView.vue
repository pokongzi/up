<template>
  <div class="home-page">
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">申小行真题</h1>
        <p class="hero-subtitle">让备考更高效，让上岸更简单</p>
        <div class="hero-actions">
          <el-button type="primary" size="large" @click="$router.push('/questions')">
            <el-icon><Document /></el-icon>
            查看真题
          </el-button>
          <el-button size="large" @click="$router.push('/mock')">
            <el-icon><Edit /></el-icon>
            开始模拟
          </el-button>
        </div>
      </div>
      <div class="hero-stats">
        <div class="stat-item">
          <span class="stat-number">30+</span>
          <span class="stat-label">省份覆盖</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">1000+</span>
          <span class="stat-label">历年真题</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">3</span>
          <span class="stat-label">权威答案</span>
        </div>
      </div>
    </div>

    <div class="feature-section">
      <div class="feature-card" @click="$router.push('/download')">
        <div class="feature-icon download">
          <el-icon><Download /></el-icon>
        </div>
        <h3>资料下载</h3>
        <p>历年真题、备考资料一键下载</p>
      </div>
      <div class="feature-card" @click="$router.push('/questions')">
        <div class="feature-icon view">
          <el-icon><View /></el-icon>
        </div>
        <h3>真题查看</h3>
        <p>在线浏览真题，多机构答案对比</p>
      </div>
      <div class="feature-card" @click="$router.push('/mock')">
        <div class="feature-icon exam">
          <el-icon><Edit /></el-icon>
        </div>
        <h3>在线模拟</h3>
        <p>全真模拟考试环境，检验学习成果</p>
      </div>
    </div>

    <div class="recent-section">
      <h2 class="section-title">最近更新</h2>
      <div class="recent-grid">
        <div class="recent-item" v-for="item in recentUpdates" :key="item.id">
          <div class="recent-icon">
            <el-icon><Document /></el-icon>
          </div>
          <div class="recent-info">
            <h4>{{ item.title }}</h4>
            <p>{{ item.province }} · {{ item.year }} · {{ item.type }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Document, Edit, View, Download } from '@element-plus/icons-vue'

const recentUpdates = ref([
  { id: 1, title: '2025年河南省公务员录用考试《行测》题', province: '河南', year: '2025', type: '行测' },
  { id: 2, title: '2024年公务员多省联考《申论》题（河南县级卷）', province: '河南', year: '2024', type: '申论' },
  { id: 3, title: '2024年公务员多省联考《申论》题（河南市级卷）', province: '河南', year: '2024', type: '申论' },
  { id: 4, title: '2024年河南省公务员录用考试《行测》题', province: '河南', year: '2024', type: '行测' }
])
</script>

<style scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
}

.hero-section {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  border-radius: 20px;
  padding: 60px 40px;
  color: #fff;
  text-align: center;
  margin-bottom: 40px;
}

.hero-title {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #3498db 0%, #2ecc71 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 20px;
  opacity: 0.9;
  margin-bottom: 40px;
}

.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 48px;
}

.hero-actions .el-button {
  padding: 16px 32px;
  font-size: 16px;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 60px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 36px;
  font-weight: 700;
  color: #3498db;
}

.stat-label {
  font-size: 14px;
  opacity: 0.8;
}

.feature-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 40px;
}

.feature-card {
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.feature-icon {
  width: 72px;
  height: 72px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  margin: 0 auto 20px;
}

.feature-icon.download {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.feature-icon.view {
  background: linear-gradient(135deg, #3498db 0%, #2ecc71 100%);
  color: #fff;
}

.feature-icon.exam {
  background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
  color: #fff;
}

.feature-card h3 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #2c3e50;
}

.feature-card p {
  font-size: 14px;
  color: #7f8c8d;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 24px;
}

.recent-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.recent-item {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.recent-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.recent-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: linear-gradient(135deg, #3498db 0%, #2ecc71 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.recent-info h4 {
  font-size: 15px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 4px;
}

.recent-info p {
  font-size: 13px;
  color: #7f8c8d;
}
</style>
