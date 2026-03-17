import axios from 'axios'
import { ElMessage } from 'element-plus'

const request = axios.create({
  baseURL: '/api',
  timeout: 30000
})

request.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 0 && res.code !== 200) {
      ElMessage.error(res.message || '请求失败')
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    return res.data
  },
  error => {
    ElMessage.error(error.message || '网络错误')
    return Promise.reject(error)
  }
)

export default request

export const getProvinces = () => request.get('/areas/provinces')

export const getAreasByParent = (parentId) => request.get(`/areas/${parentId}/children`)

export const getQuestions = (params) => request.get('/questions', { params })

export const getQuestionDetail = (id) => request.get(`/questions/${id}`)

export const getQuestionAnswers = (id) => request.get(`/questions/${id}/answers`)

export const getResources = (params) => request.get('/resources', { params })

export const getResourcePreview = (id) => request.get(`/resources/${id}/preview`)

export const downloadResource = (id) => request.get(`/resources/${id}/download`)

export const getPapers = (params) => request.get('/papers', { params })

export const getPaperDetail = (id) => request.get(`/papers/${id}`)

export const startExam = (paperId) => request.post('/exams/start', { paper_id: paperId })

export const getExamStatus = (examId) => request.get(`/exams/${examId}/status`)

export const saveAnswer = (examId, data) => request.post(`/exams/${examId}/answers`, data)

export const submitExam = (examId) => request.post(`/exams/${examId}/submit`)

export const getExamResult = (examId) => request.get(`/exams/${examId}/result`)

export const getExamHistory = (params) => request.get('/exams/history', { params })

export const collectQuestion = (questionId) => request.post('/user/collect', { question_id: questionId })

export const uncollectQuestion = (questionId) => request.delete(`/user/collect/${questionId}`)

export const getUserCollections = () => request.get('/user/collections')
