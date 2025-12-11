const getApiBaseUrl = (): string => {
  // 优先使用环境变量，否则使用默认值
  let baseUrl: string
  if (import.meta.client) {
    // 客户端：从 runtimeConfig 获取
    const config = useRuntimeConfig()
    baseUrl = config.public.apiBaseUrl || 'https://mycoseed-backend.fly.dev/api'
  } else {
    // 服务端：从环境变量获取
    baseUrl = process.env.NUXT_PUBLIC_API_URL || 'https://mycoseed-backend.fly.dev/api'
  }
  
  // 如果 URL 没有以 /api 结尾，自动添加
  if (!baseUrl.endsWith('/api')) {
    baseUrl = baseUrl.replace(/\/$/, '') + '/api'
  }
  
  return baseUrl
}
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
  creatorId: number              // 创建者ID
  creatorName?: string           // 创建者名称
  claimerId?: number             // 接单者ID
  claimerName?: string           // 接单者名称
  createdAt: string              // 创建时间
  updatedAt: string              // 更新时间
  claimedAt?: string             // 领取时间
  submittedAt?: string           // 提交时间
  completedAt?: string           // 完成时间
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
const now = new Date().toISOString()
const mockTasks: Task[] = [
  // 活动1的任务
  { id: 1, activityId: 1, title: '完成项目提案', description: '提交一份完整的项目提案文档', reward: 0.5, isClaimed: false, status: 'unclaimed', creatorId: 1, creatorName: '社区管理员', createdAt: now, updatedAt: now },
  { id: 2, activityId: 1, title: '组建团队', description: '招募3-5名团队成员', reward: 0.3, isClaimed: false, status: 'unclaimed', creatorId: 1, creatorName: '社区管理员', createdAt: now, updatedAt: now },
  { id: 3, activityId: 1, title: '开发 MVP', description: '完成最小可行产品开发', reward: 1.0, isClaimed: false, status: 'unclaimed', creatorId: 1, creatorName: '社区管理员', createdAt: now, updatedAt: now },
  // 活动2的任务
  { id: 4, activityId: 2, title: '学习区块链基础', description: '完成区块链基础知识学习', reward: 0.2, isClaimed: false, status: 'unclaimed', creatorId: 1, creatorName: '社区管理员', createdAt: now, updatedAt: now },
  { id: 5, activityId: 2, title: '参与技术讨论', description: '在讨论会上提出问题或分享见解', reward: 0.15, isClaimed: false, status: 'unclaimed', creatorId: 1, creatorName: '社区管理员', createdAt: now, updatedAt: now },
  // 活动3的任务
  { id: 6, activityId: 3, title: '编写智能合约', description: '使用 Solidity 编写一个简单的智能合约', reward: 0.8, isClaimed: false, status: 'unclaimed', creatorId: 1, creatorName: '社区管理员', createdAt: now, updatedAt: now },
  { id: 7, activityId: 3, title: '部署合约', description: '将合约部署到测试网', reward: 0.4, isClaimed: false, status: 'unclaimed', creatorId: 1, creatorName: '社区管理员', createdAt: now, updatedAt: now },
]

// 用户已领取的任务ID列表
let claimedTaskIds: number[] = []

// ==================== 辅助函数 ====================

/**
 * 将后端数据库格式的任务转换为前端格式
 */
const mapDbTaskToTask = (dbTask: any): Task => ({
  id: String(dbTask.id), // UUID 保持为字符串
  activityId: dbTask.activity_id || 0,
  title: dbTask.title,
  description: dbTask.description,
  reward: parseFloat(dbTask.reward),
  isClaimed: dbTask.is_claimed || false,
  proof: dbTask.proof,
  status: dbTask.status as TaskStatus,
  rejectReason: dbTask.reject_reason,
  discount: dbTask.discount ? parseFloat(dbTask.discount) : undefined,
  discountReason: dbTask.discount_reason,
  startDate: dbTask.start_date,
  deadline: dbTask.deadline,
  proofConfig: dbTask.proof_config,
  allowRepeatClaim: dbTask.allow_repeat_claim || false,
  createdAt: dbTask.created_at,
  updatedAt: dbTask.updated_at
})

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
 * 根据 ID 获取单个任务详情
 * @param id 任务 ID
 */
export const getTaskById = async (id:number|string):Promise<Task|null>=>
{
  try
  {
    const taskId = String(id)
    const apiUrl = getApiBaseUrl()
    const response = await fetch(`${apiUrl}/tasks/${taskId}`)

    if(!response.ok)
    {
      if(response.status === 404)
      {
        return null
      }
      throw new Error(`获取任务失败：${response.statusText}`)
    }
    const data= await response.json()
    return mapDbTaskToTask(data)
  }catch(error)
  {
    console.error('获取任务失败：',error)
    throw error
  }
}

/**
 * 获取所有任务列表
 */
export const getAllTasks = async (): Promise<Task[]>=>
{
  try
  {
    const apiUrl = getApiBaseUrl()
    const response = await fetch(`${apiUrl}/tasks`)

    if(!response.ok)
    {
      throw new Error(`获取任务列表失败：${response.statusText}`)
    }

    const data = await response.json()

    //转换后端数据格式到前端格式
    return data.map(mapDbTaskToTask)
  } catch(error)
  {
    console.error('获取任务列表失败：',error)
    throw error
  }
}

/**
 * 创建新任务
 */
export interface CreateTaskParams {
  title: string
  description: string
  reward: number
  startDate: string
  deadline: string
  proofConfig?: any
}

export const createTask = async (params: CreateTaskParams): Promise<Task> => {
  try {
    const apiUrl = getApiBaseUrl()
    const response = await fetch(`${apiUrl}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: params.title,
        description: params.description,
        reward: params.reward,
        startDate: params.startDate,
        deadline: params.deadline,
        proofConfig: params.proofConfig || null,
        allowRepeatClaim: params.allowRepeatClaim || false
      })
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `创建任务失败: ${response.statusText}`)
    }
    
    const data = await response.json()
    return mapDbTaskToTask(data)
  } catch (error) {
    console.error('创建任务失败:', error)
    throw error
  }
}

/**
 * 领取任务
 * @param taskId 任务 ID
 */
export const claimTask = async (taskId: number | string): Promise<{ success: boolean; message: string }> => {
  try {
    const id = String(taskId) // 确保ID是字符串
    const apiUrl = getApiBaseUrl()
    const response = await fetch(`${apiUrl}/tasks/${id}/claim`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // userIdentifier 暂时不传，后续添加
      })
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        message: errorData.message || errorData.error || `领取任务失败: ${response.statusText}`
      }
    }
    
    const data = await response.json()
    return {
      success: data.success !== false,
      message: data.message || '任务领取成功！'
    }
  } catch (error) {
    console.error('领取任务失败:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : '网络错误，请稍后重试'
    }
  }
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
export const submitProof = async (taskId: number | string, proof: string): Promise<{ success: boolean; message: string }> => {
  try {
    const id = String(taskId) // 确保ID是字符串
    const apiUrl = getApiBaseUrl()
    const response = await fetch(`${apiUrl}/tasks/${id}/submit`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        proof: proof
      })
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        message: errorData.message || errorData.error || `提交凭证失败: ${response.statusText}`
      }
    }
    
    const data = await response.json()
    return {
      success: data.success !== false,
      message: data.message || '凭证提交成功！'
    }
  } catch (error) {
    console.error('提交凭证失败:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : '网络错误，请稍后重试'
    }
  }
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
  
  if (task.status !== 'under_review') {
    return { success: false, message: '任务状态不正确，无法审核' }
  }
  
  const now = new Date().toISOString()
  task.status = 'completed'
  task.completedAt = now
  task.updatedAt = now
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
  
  if (task.status !== 'under_review') {
    return { success: false, message: '任务状态不正确，无法驳回' }
  }
  
  const now = new Date().toISOString()
  task.status = 'rejected'
  task.rejectReason = reason
  task.proof = undefined
  task.updatedAt = now
  // 重置任务状态，允许重新领取
  const taskIndex = claimedTaskIds.indexOf(taskId)
  if (taskIndex > -1) {
    claimedTaskIds.splice(taskIndex, 1)
  }
  task.isClaimed = false
  task.claimerId = undefined
  task.claimerName = undefined
  task.claimedAt = undefined
  task.submittedAt = undefined
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
// 钱包地址映射表（硬编码，基于手机号）
const phoneToWalletMap: Record<string, string> = {
  '13800138000': '0x4fc3a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8',
  '13800138001': '0x5fd4b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f9',
  '13800138002': '0x6fe5c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7fa',
  '13900139000': '0x7af6d4e5f6a7b8c9d0e1f2a3b4c5d6e7fb',
  '13900139001': '0x8bf7e5f6a7b8c9d0e1f2a3b4c5d6e7fc',
}

// 邮箱到钱包地址映射表
const emailToWalletMap: Record<string, string> = {
  'test@example.com': '0x9cf8f6a7b8c9d0e1f2a3b4c5d6e7fd',
  'admin@example.com': '0xad09g7b8c9d0e1f2a3b4c5d6e7fe',
  'user@example.com': '0xbe1ah8c9d0e1f2a3b4c5d6e7ff',
}

// 存储用户数据（模拟数据库）
const userDatabase: Record<string, any> = {}
const communityDatabase: Record<string, any> = {}

// 根据手机号或邮箱获取钱包地址
const getWalletAddress = (identifier: string): string => {
  // 判断是手机号还是邮箱
  if (/^\d{11}$/.test(identifier)) {
    // 手机号
    return phoneToWalletMap[identifier] || `0x${identifier.slice(-8).padStart(40, '0')}`
  } else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)) {
    // 邮箱
    return emailToWalletMap[identifier] || `0x${identifier.slice(0, 8).padStart(40, '0')}`
  }
  return '0x0000000000000000000000000000000000000000'
}

// Mock 用户数据
const mockUser = {
  id: 1,
  phone: '13800138000',
  email: null,
  evm_chain_address: '0x4fc3a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8',
  encrypted_keys: null,
  userType: 'member' as 'member' | 'community',
  isProfileSetup: false,
  created_at: '2025-01-01T00:00:00Z'
}

// Mock API 函数
export const sendSMS = async (phone: string): Promise<{ result: string }> => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  console.log(`[Mock] 发送验证码到手机: ${phone}`)
  return { result: 'ok' }
}

export const sendEmailCode = async (email: string): Promise<{ result: string }> => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  console.log(`[Mock] 发送验证码到邮箱: ${email}`)
  return { result: 'ok' }
}

export const signIn = async (identifier: string, code: string, userType?: 'member' | 'community'): Promise<{ result: string; isNewUser?: boolean }> => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  console.log(`[Mock] 登录: ${identifier}, 验证码: ${code}, 用户类型: ${userType || '未指定'}`)
  
  // 检查是否是新用户（检查两个数据库）
  const existingUser = userDatabase[identifier] || communityDatabase[identifier]
  const isNewUser = !existingUser
  
  if (isNewUser && userType) {
    // 创建新用户
    const walletAddress = getWalletAddress(identifier)
    const isPhone = /^\d{11}$/.test(identifier)
    
    if (userType === 'community') {
      communityDatabase[identifier] = {
        id: Object.keys(communityDatabase).length + 1,
        identifier: identifier,
        identifierType: isPhone ? 'phone' : 'email',
        evm_chain_address: walletAddress,
        userType: 'community',
        isProfileSetup: false,
        created_at: new Date().toISOString()
      }
    } else {
      userDatabase[identifier] = {
        id: Object.keys(userDatabase).length + 1,
        identifier: identifier,
        identifierType: isPhone ? 'phone' : 'email',
        evm_chain_address: walletAddress,
        userType: 'member',
        isProfileSetup: false,
        created_at: new Date().toISOString()
      }
    }
  }
  
  return { result: 'ok', isNewUser }
}

export const signInWithEmail = async (email: string, code: string, userType?: 'member' | 'community'): Promise<{ result: string; isNewUser?: boolean }> => {
  return signIn(email, code, userType)
}

export const getMe = async (): Promise<any> => {
  await new Promise(resolve => setTimeout(resolve, 500))
  console.log('[Mock] 获取用户信息')
  
  // 从localStorage获取当前登录的标识符
  if (typeof window !== 'undefined') {
    const currentIdentifier = localStorage.getItem('current_identifier')
    if (currentIdentifier) {
      const user = userDatabase[currentIdentifier] || communityDatabase[currentIdentifier]
      if (user) {
        return user
      }
    }
  }
  
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
  if (typeof window !== 'undefined') {
    localStorage.removeItem('current_identifier')
  }
}

// 保存当前登录标识符
export const setCurrentIdentifier = (identifier: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('current_identifier', identifier)
  }
}

// 头像上传API
export const uploadAvatar = async (file: File): Promise<{ url: string }> => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  console.log('[Mock] 上传头像:', file.name)
  
  // 模拟上传，返回本地预览URL
  const url = URL.createObjectURL(file)
  return { url }
}

// 更新用户信息
export interface UserProfile {
  name: string
  bio?: string
  avatar?: string
}

export const updateUserProfile = async (userId: number, profile: UserProfile): Promise<{ success: boolean; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 500))
  console.log('[Mock] 更新用户信息:', userId, profile)
  
  // 更新用户数据库
  if (typeof window !== 'undefined') {
    const currentIdentifier = localStorage.getItem('current_identifier')
    if (currentIdentifier && userDatabase[currentIdentifier]) {
      userDatabase[currentIdentifier] = {
        ...userDatabase[currentIdentifier],
        name: profile.name,
        bio: profile.bio,
        avatar: profile.avatar,
        isProfileSetup: true
      }
    }
  }
  
  return { success: true, message: '用户信息更新成功' }
}

// 更新社区信息
export interface CommunityProfile {
  name: string
  description?: string
  avatar?: string
}

export const updateCommunityProfile = async (communityId: number, profile: CommunityProfile): Promise<{ success: boolean; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 500))
  console.log('[Mock] 更新社区信息:', communityId, profile)
  
  // 更新社区数据库
  if (typeof window !== 'undefined') {
    const currentIdentifier = localStorage.getItem('current_identifier')
    if (currentIdentifier && communityDatabase[currentIdentifier]) {
      communityDatabase[currentIdentifier] = {
        ...communityDatabase[currentIdentifier],
        name: profile.name,
        description: profile.description,
        avatar: profile.avatar,
        isProfileSetup: true
      }
    }
  }
  
  return { success: true, message: '社区信息更新成功' }
}

// ==================== 社群相关 API ====================

/**
 * 社群数据结构
 */
export interface Community {
  id: number
  name: string                    // 社群名称
  description: string            // 社群描述
  memberCount: number            // 成员数量
  activityCount: number          // 活动数量
  totalPoints: number            // 总积分
  markdownIntro?: string         // Markdown 格式的介绍
  category?: string              // 社群类别
  createdAt: string              // 创建时间
}

/**
 * 成员数据结构
 */
export interface Member {
  id: number
  name: string                   // 成员名称
  title?: string                 // 头衔
  reputation: number             // 声誉值
  totalContributions: number     // 总贡献数
  completedTasks: number         // 完成任务数
  totalReward: number            // 总奖励
  skills: string[]               // 技能标签
  communities: number[]          // 所属社群ID列表
  participationScore: number    // 参与度分数 (0-100)
  activityScore: number          // 活跃度分数 (0-100)
  avatarSeed?: string            // 头像种子
}

/**
 * 网络节点数据结构
 */
export interface NetworkNode {
  id: string
  name: string
  type: 'COMMUNITY' | 'USER'
  value: number                  // 用于显示的权重值
  participationScore?: number   // 参与度
  activityScore?: number         // 活跃度
  communityId?: number           // 如果是成员，所属社群ID
}

/**
 * 网络连接数据结构
 */
export interface NetworkLink {
  source: string                 // 源节点ID
  target: string                 // 目标节点ID
  weight: number                 // 连接权重（基于参与度和活跃度）
}

// Mock 社群数据（仅保留一个「高新华社区小菜园」）
const mockCommunities: Community[] = [
  {
    id: 1,
    name: '高新华社区小菜园',
    description: '社区共享菜园，一起种植、收获、分享绿色生活。',
    memberCount: 68,
    activityCount: 18,
    totalPoints: 18900,
    category: '园艺',
    createdAt: '2024-02-01T00:00:00Z',
    markdownIntro: `# 高新华社区小菜园

欢迎加入我们的社区菜园！一起体验种植的乐趣。

## 我们的目标
- 推广绿色生活理念
- 学习有机种植技术
- 分享收获的喜悦

## 活动安排
- 每周六上午：集体种植
- 每月一次：收获分享会
- 不定期：种植技术讲座
    `
  }
]

// Mock 成员数据（仅保留与高新华社区小菜园相关的成员）
const mockMembers: Member[] = [
  { id: 1, name: '赵园丁', title: '资深园丁', reputation: 920, totalContributions: 30, completedTasks: 22, totalReward: 4.0, skills: ['有机种植', '土壤管理', '病虫害防治'], communities: [1], participationScore: 98, activityScore: 95, avatarSeed: 'gardener1' },
  { id: 2, name: '钱农夫', title: '种植专家', reputation: 780, totalContributions: 22, completedTasks: 18, totalReward: 3.0, skills: ['蔬菜种植', '堆肥制作'], communities: [1], participationScore: 88, activityScore: 85, avatarSeed: 'farmer1' },
  { id: 3, name: '孙绿手指', title: '园艺爱好者', reputation: 650, totalContributions: 16, completedTasks: 13, totalReward: 2.2, skills: ['花卉种植', '园艺设计'], communities: [1], participationScore: 75, activityScore: 72, avatarSeed: 'green1' },
  { id: 4, name: '周菜农', title: '菜园管理员', reputation: 580, totalContributions: 12, completedTasks: 10, totalReward: 1.8, skills: ['菜园管理', '收获分享'], communities: [1], participationScore: 68, activityScore: 65, avatarSeed: 'veggie1' },
  { id: 5, name: '吴新手', title: '种植新手', reputation: 420, totalContributions: 8, completedTasks: 6, totalReward: 1.0, skills: ['基础种植'], communities: [1], participationScore: 58, activityScore: 55, avatarSeed: 'newbie1' }
]

/**
 * 获取所有社群列表
 */
export const getCommunities = async (): Promise<Community[]> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  return mockCommunities
}

/**
 * 根据 ID 获取单个社群详情
 */
export const getCommunityById = async (id: number): Promise<Community | null> => {
  await new Promise(resolve => setTimeout(resolve, 200))
  const community = mockCommunities.find(c => c.id === id)
  return community || null
}

/**
 * 获取社群成员列表
 */
export const getCommunityMembers = async (communityId: number): Promise<Member[]> => {
  await new Promise(resolve => setTimeout(resolve, 200))
  return mockMembers.filter(m => m.communities.includes(communityId))
}

/**
 * 获取所有成员列表
 */
export const getMembers = async (): Promise<Member[]> => {
  await new Promise(resolve => setTimeout(resolve, 200))
  return mockMembers
}

/**
 * 根据 ID 获取单个成员详情
 */
export const getMemberById = async (id: number): Promise<Member | null> => {
  await new Promise(resolve => setTimeout(resolve, 200))
  const member = mockMembers.find(m => m.id === id)
  return member || null
}

/**
 * 获取网络图数据（包含节点和连接）
 * 根据参与度和活跃度进行加权
 */
export const getNetworkData = async (): Promise<{ nodes: NetworkNode[], links: NetworkLink[] }> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const nodes: NetworkNode[] = []
  const links: NetworkLink[] = []
  
  // 添加社群节点
  mockCommunities.forEach(comm => {
    // 社群的价值基于成员数量和活跃度
    const memberCount = mockMembers.filter(m => m.communities.includes(comm.id)).length
    const avgParticipation = mockMembers
      .filter(m => m.communities.includes(comm.id))
      .reduce((sum, m) => sum + m.participationScore, 0) / memberCount || 0
    const avgActivity = mockMembers
      .filter(m => m.communities.includes(comm.id))
      .reduce((sum, m) => sum + m.activityScore, 0) / memberCount || 0
    
    // 综合权重 = 成员数 * (参与度 + 活跃度) / 2
    const value = Math.round(memberCount * (avgParticipation + avgActivity) / 2)
    
    nodes.push({
      id: `comm${comm.id}`,
      name: comm.name,
      type: 'COMMUNITY',
      value: value,
      participationScore: avgParticipation,
      activityScore: avgActivity
    })
  })
  
  // 添加成员节点
  mockMembers.forEach(member => {
    // 成员的价值基于参与度和活跃度的加权平均
    const value = Math.round((member.participationScore * 0.6 + member.activityScore * 0.4) * 10)
    
    nodes.push({
      id: `user${member.id}`,
      name: member.name,
      type: 'USER',
      value: value,
      participationScore: member.participationScore,
      activityScore: member.activityScore,
      communityId: member.communities[0] // 主要社群
    })
    
    // 创建成员与社群的连接
    member.communities.forEach(commId => {
      // 连接权重基于成员的参与度和活跃度
      const weight = Math.round((member.participationScore + member.activityScore) / 20)
      links.push({
        source: `user${member.id}`,
        target: `comm${commId}`,
        weight: Math.max(1, weight) // 最小权重为1
      })
    })
    
    // 创建成员之间的连接（同一社群的成员）
    member.communities.forEach(commId => {
      const sameCommunityMembers = mockMembers.filter(
        m => m.id !== member.id && m.communities.includes(commId)
      )
      
      // 只连接活跃度相近的成员（避免连接过多）
      sameCommunityMembers.forEach(otherMember => {
        const activityDiff = Math.abs(member.activityScore - otherMember.activityScore)
        if (activityDiff < 20 && Math.random() > 0.7) { // 30%概率连接
          const weight = Math.round((100 - activityDiff) / 10)
          // 检查是否已存在反向连接
          if (!links.find(l => 
            (l.source === `user${otherMember.id}` && l.target === `user${member.id}`) ||
            (l.source === `user${member.id}` && l.target === `user${otherMember.id}`)
          )) {
            links.push({
              source: `user${member.id}`,
              target: `user${otherMember.id}`,
              weight: Math.max(1, weight)
            })
          }
        }
      })
    })
  })
  
  return { nodes, links }
}