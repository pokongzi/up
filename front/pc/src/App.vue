<template>
  <div class="app-container">
    <header class="app-header">
      <div class="header-logo">
        <div class="logo-icon">申</div>
        <span>申小行真题</span>
      </div>
      <nav class="header-nav">
        <router-link to="/" class="nav-item" :class="{ active: route.path === '/' }">首页</router-link>
        <router-link to="/download" class="nav-item" :class="{ active: route.path === '/download' }">资料下载</router-link>
        <router-link to="/questions" class="nav-item" :class="{ active: route.path.startsWith('/questions') }">真题查看</router-link>
        <router-link to="/mock" class="nav-item" :class="{ active: route.path.startsWith('/mock') }">在线模拟</router-link>
      </nav>
    </header>
    
    <main class="app-main">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<style>
@import '@/assets/main.css';

.app-container {
  min-height: 100vh;
  background: #f5f7fa;
}

.app-header {
  height: 60px;
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
}

.header-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #fff;
  font-size: 20px;
  font-weight: 600;
}

.logo-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #3498db 0%, #2ecc71 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
}

.header-nav {
  display: flex;
  gap: 8px;
}

.nav-item {
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  padding: 8px 20px;
  border-radius: 6px;
  font-size: 15px;
  transition: all 0.3s ease;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}

.nav-item.active {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.app-main {
  padding: 24px;
  max-width: 1400px;
  margin: 60px auto 0;
}
</style>
