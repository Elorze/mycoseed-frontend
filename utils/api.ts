// 导入 semi 的 API 功能 - 已注释，使用mock数据
// export { 
//   sendSMS, 
//   signIn, 
//   getMe, 
//   setEncryptedKeys,
//   AUTH_TOKEN_KEY,
//   getCookie,
//   clearAuthToken 
// } from '../../../semi/semi-app-main/utils/semi_api'

// ==================== 数据类型定义 ====================

/**
 * 活动数据结构
 */
export interface Activity {
  id: number
  name: string                    // 活动名称
  location: string                // 活动地点
  startTime: string              // 活动开始时间 (ISO 8601 格式)
  endTime: string                // 活动结束时间 (ISO 8601 格式)
  description: string            // 活动描述
  image: string                  // 活动封面图片 URL
  organizer: string              // 主办方
  participants: number           // 当前参与人数
  maxParticipants: number        // 最大参与人数
  status: 'upcoming' | 'ongoing' | 'ended'  // 活动状态
  tags: string[]                 // 活动标签
}

/**
 * 任务数据结构
 */
export interface Task {
  id: number
  activityId: number             // 所属活动ID
  title: string                  // 任务标题
  description: string            // 任务描述
  reward: number                 // 奖金（ETH）
  isClaimed: boolean             // 是否已被领取
  proof?: string                 // 完成凭证
  status: 'unclaimed' | 'in_progress' | 'under_review' | 'completed' | 'rejected'  // 任务状态
  rejectReason?: string          // 驳回理由
  discount?: number              // 打折百分数
  discountReason?: string        // 打折理由
}

// ==================== Mock 数据 ====================

const mockActivities: Activity[] = [
  {
    id: 1,
    name: 'ETH 上海黑客松 2025',
    location: '上海市浦东新区世纪大道 8 号',
    startTime: '2025-10-25T09:00:00+08:00',
    endTime: '2025-10-27T18:00:00+08:00',
    description: '为期三天的以太坊黑客松活动，汇聚全球优秀开发者，共同探索 Web3 的未来。',
    image: '/images/eth_logo.png',
    organizer: 'ETH 上海社区',
    participants: 156,
    maxParticipants: 300,
    status: 'upcoming',
    tags: ['区块链', '黑客松', 'Web3', 'DeFi']
  },
  {
    id: 2,
    name: '区块链技术分享会',
    location: '北京市朝阳区建国门外大街 1 号',
    startTime: '2025-10-20T14:00:00+08:00',
    endTime: '2025-10-20T17:00:00+08:00',
    description: '深入探讨区块链技术的最新发展，包括 Layer2、零知识证明等前沿技术。',
    image: '/images/eth_logo.png',
    organizer: '北京区块链协会',
    participants: 89,
    maxParticipants: 150,
    status: 'ongoing',
    tags: ['技术分享', 'Layer2', '零知识证明']
  },
  {
    id: 3,
    name: 'DeFi 开发者 Workshop',
    location: '深圳市南山区科技园南区',
    startTime: '2025-11-05T10:00:00+08:00',
    endTime: '2025-11-05T16:00:00+08:00',
    description: '手把手教你开发 DeFi 应用，从智能合约到前端开发全流程讲解。',
    image: '/images/eth_logo.png',
    organizer: '深圳 Web3 开发者社区',
    participants: 45,
    maxParticipants: 80,
    status: 'upcoming',
    tags: ['DeFi', 'Workshop', '智能合约', 'Solidity']
  },
  {
    id: 4,
    name: 'NFT 艺术展览',
    location: '杭州市西湖区文三路 138 号',
    startTime: '2025-09-15T10:00:00+08:00',
    endTime: '2025-09-17T20:00:00+08:00',
    description: '展示优秀的 NFT 艺术作品，探讨数字艺术与区块链的结合。',
    image: '/images/eth_logo.png',
    organizer: '杭州数字艺术馆',
    participants: 234,
    maxParticipants: 500,
    status: 'ended',
    tags: ['NFT', '艺术', '展览']
  },
  {
    id: 5,
    name: 'Web3 创业路演',
    location: '成都市高新区天府大道',
    startTime: '2025-11-12T13:00:00+08:00',
    endTime: '2025-11-12T18:00:00+08:00',
    description: '为 Web3 创业项目提供展示机会，与投资人面对面交流。',
    image: '/images/eth_logo.png',
    organizer: '成都创投联盟',
    participants: 67,
    maxParticipants: 120,
    status: 'upcoming',
    tags: ['创业', 'Web3', '投资', '路演']
  }
]

// Mock 任务数据
const mockTasks: Task[] = [
  // 活动1的任务
  { id: 1, activityId: 1, title: '完成项目提案', description: '提交一份完整的项目提案文档', reward: 0.5, isClaimed: false, status: 'unclaimed' },
  { id: 2, activityId: 1, title: '组建团队', description: '招募3-5名团队成员', reward: 0.3, isClaimed: false, status: 'unclaimed' },
  { id: 3, activityId: 1, title: '开发 MVP', description: '完成最小可行产品开发', reward: 1.0, isClaimed: false, status: 'unclaimed' },
  // 活动2的任务
  { id: 4, activityId: 2, title: '学习区块链基础', description: '完成区块链基础知识学习', reward: 0.2, isClaimed: false, status: 'unclaimed' },
  { id: 5, activityId: 2, title: '参与技术讨论', description: '在讨论会上提出问题或分享见解', reward: 0.15, isClaimed: false, status: 'unclaimed' },
  // 活动3的任务
  { id: 6, activityId: 3, title: '编写智能合约', description: '使用 Solidity 编写一个简单的智能合约', reward: 0.8, isClaimed: false, status: 'unclaimed' },
  { id: 7, activityId: 3, title: '部署合约', description: '将合约部署到测试网', reward: 0.4, isClaimed: false, status: 'unclaimed' },
]

// 用户已领取的任务ID列表
let claimedTaskIds: number[] = []

// ==================== 辅助函数 ====================

/**
 * 计算任务的最终奖金
 * @param task 任务
 * @returns 最终奖金
 */
export const getFinalReward = (task: Task): number => {
  if (task.discount && task.discount > 0 && task.discount <= 100) {
    return task.reward * (task.discount / 100)
  }
  return task.reward
}

// ==================== 活动相关 API ====================

/**
 * 获取所有活动列表
 * @param status 可选：按状态筛选活动
 */
export const getActivities = async (status?: Activity['status']): Promise<Activity[]> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 300))
  
  if (status) {
    return mockActivities.filter(activity => activity.status === status)
  }
  
  return mockActivities
}

/**
 * 根据 ID 获取单个活动详情
 * @param id 活动 ID
 */
export const getActivityById = async (id: number): Promise<Activity | null> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 200))
  
  const activity = mockActivities.find(activity => activity.id === id)
  return activity || null
}

/**
 * 报名参加活动
 * @param id 活动 ID
 */
export const joinActivity = async (id: number): Promise<{ success: boolean; message: string }> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const activity = mockActivities.find(activity => activity.id === id)
  
  if (!activity) {
    return { success: false, message: '活动不存在' }
  }
  
  if (activity.participants >= activity.maxParticipants) {
    return { success: false, message: '活动已满员' }
  }
  
  // Mock: 增加参与人数
  activity.participants += 1
  
  return { success: true, message: '报名成功！' }
}

// ==================== 任务相关 API ====================

/**
 * 获取活动的任务列表
 * @param activityId 活动 ID
 */
export const getTasks = async (activityId: number): Promise<Task[]> => {
  await new Promise(resolve => setTimeout(resolve, 200))
  
  return mockTasks
    .filter(task => task.activityId === activityId)
    .map(task => ({
      ...task,
      isClaimed: claimedTaskIds.includes(task.id)
    }))
}

/**
 * 获取所有任务列表
 */
export const getAllTasks = async (): Promise<Task[]> => {
  await new Promise(resolve => setTimeout(resolve, 200))
  
  return mockTasks.map(task => ({
    ...task,
    isClaimed: claimedTaskIds.includes(task.id)
  }))
}

/**
 * 领取任务
 * @param taskId 任务 ID
 */
export const claimTask = async (taskId: number): Promise<{ success: boolean; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const task = mockTasks.find(t => t.id === taskId)
  if (!task) {
    return { success: false, message: '任务不存在' }
  }
  
  if (claimedTaskIds.includes(taskId)) {
    return { success: false, message: '您已经领取过这个任务' }
  }
  
  claimedTaskIds.push(taskId)
  task.status = 'in_progress'
  return { success: true, message: '任务领取成功！' }
}

/**
 * 获取我的任务列表
 */
export const getMyTasks = async (): Promise<Task[]> => {
  await new Promise(resolve => setTimeout(resolve, 200))
  
  return mockTasks.filter(task => claimedTaskIds.includes(task.id))
}

/**
 * 提交任务完成凭证
 * @param taskId 任务 ID
 * @param proof 凭证内容
 */
export const submitProof = async (taskId: number, proof: string): Promise<{ success: boolean; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const task = mockTasks.find(t => t.id === taskId)
  if (!task) {
    return { success: false, message: '任务不存在' }
  }
  
  if (!claimedTaskIds.includes(taskId)) {
    return { success: false, message: '您还没有领取这个任务' }
  }
  
  task.proof = proof
  task.status = 'under_review'
  return { success: true, message: '凭证提交成功！' }
}

/**
 * 获取审核中的任务列表
 */
export const getReviewTasks = async (): Promise<Task[]> => {
  await new Promise(resolve => setTimeout(resolve, 200))
  
  return mockTasks.filter(task => task.status === 'under_review')
}

/**
 * 审核通过任务
 * @param taskId 任务 ID
 */
export const approveTask = async (taskId: number): Promise<{ success: boolean; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const task = mockTasks.find(t => t.id === taskId)
  if (!task) {
    return { success: false, message: '任务不存在' }
  }
  
  task.status = 'completed'
  return { success: true, message: '任务审核通过！' }
}

/**
 * 驳回任务
 * @param taskId 任务 ID
 * @param reason 驳回理由
 */
export const rejectTask = async (taskId: number, reason: string): Promise<{ success: boolean; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const task = mockTasks.find(t => t.id === taskId)
  if (!task) {
    return { success: false, message: '任务不存在' }
  }
  
  task.status = 'rejected'
  task.rejectReason = reason
  task.proof = undefined
  return { success: true, message: '任务已驳回！' }
}

/**
 * 打折审核任务
 * @param taskId 任务 ID
 * @param discount 打折百分数
 * @param reason 打折理由
 */
export const discountTask = async (taskId: number, discount: number, reason: string): Promise<{ success: boolean; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const task = mockTasks.find(t => t.id === taskId)
  if (!task) {
    return { success: false, message: '任务不存在' }
  }
  
  task.status = 'completed'
  task.discount = discount
  task.discountReason = reason
  return { success: true, message: '任务已打折通过！' }
}

// ==================== 用户相关 API ====================
// Mock 用户数据
const mockUser = {
  id: 1,
  phone: '13800138000',
  evm_chain_address: '0x4fc3...b0d1',
  encrypted_keys: null,
  created_at: '2025-01-01T00:00:00Z'
}

// Mock API 函数
export const sendSMS = async (phone: string): Promise<{ result: string }> => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  console.log(`[Mock] 发送验证码到: ${phone}`)
  return { result: 'ok' }
}

export const signIn = async (phone: string, code: string): Promise<{ result: string }> => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  console.log(`[Mock] 登录: ${phone}, 验证码: ${code}`)
  return { result: 'ok' }
}

export const getMe = async (): Promise<any> => {
  await new Promise(resolve => setTimeout(resolve, 500))
  console.log('[Mock] 获取用户信息')
  return mockUser
}

export const setEncryptedKeys = async (keys: string): Promise<{ result: string }> => {
  await new Promise(resolve => setTimeout(resolve, 500))
  console.log('[Mock] 设置加密密钥')
  return { result: 'ok' }
}

export const AUTH_TOKEN_KEY = 'auth_token'

export const getCookie = (key: string): string | null => {
  // Mock: 总是返回一个token
  return 'mock_auth_token'
}

export const clearAuthToken = (): void => {
  console.log('[Mock] 清除认证token')
}