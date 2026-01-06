// ==================== 数据类型定义 ====================

export interface ProofFile
{
  url: string
  hash:string
  name:string
  size:number
  type:string
}

export interface GPSData
{
  latitude:number
  longitude:number
  accuracy?:number  // 精度字段改为可选，不再使用
  timestamp:string
}

export interface ProofData
{
  description:string
  files:ProofFile[]
  gps?:GPSData
  submittedAt:string
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
 * 创建活动参数
 */
export interface CreateActivityParams {
  name: string
  description: string
  startTime: string
  endTime: string
  location?: string
  reward?: number
  maxParticipants?: number
  organizer?: string
  tags?: string[]
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
  participantLimit?: number | null // 参与人数上限（null 表示不限）
  rewardDistributionMode?: 'per_person' | 'total' // 奖励分配模式：每人积分或总积分
  isClaimed: boolean             // 是否已被领取
  proof?: string                 // 完成凭证
  proofConfig?: any              // 证明配置（提交要求）
  submissionInstructions?: string // 提交说明（备注）
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
  startDate?: string             // 开始日期（创建时设置）
  deadline?: string              // 截止日期（创建时设置）
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

// 任务数据（从 localStorage 加载，不包含 mock 数据）
let tasks: Task[] = []

// 用户已领取的任务ID列表
let claimedTaskIds: number[] = []

// 从 localStorage 加载任务
const loadTasks = (): Task[] => {
  if (typeof window === 'undefined') {
    return []
  }
  
  try {
    const savedTasks = localStorage.getItem('tasks')
    if (savedTasks) {
      return JSON.parse(savedTasks) as Task[]
    }
  } catch (e) {
    console.warn('Failed to load tasks from localStorage:', e)
  }
  
  return []
}

// 初始化任务列表（从 localStorage 加载）
tasks = loadTasks()

// 将任务列表持久化到 localStorage，保持状态同步
const persistTasks = () => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('tasks', JSON.stringify(tasks))
    } catch (e) {
      console.warn('Failed to save tasks to localStorage:', e)
    }
  }
}

// ==================== 交易记录和积分存储 ====================

// 交易记录存储（按用户ID存储）
const getTransactionsKey = (userId: number) => `transactions_${userId}`

/**
 * 获取用户的交易记录
 * @param userId 用户ID
 */
export const getTransactions = async (userId: number): Promise<Transaction[]> => {
  await new Promise(resolve => setTimeout(resolve, 200))
  
  if (typeof window === 'undefined') {
    return []
  }
  
  try {
    const key = getTransactionsKey(userId)
    const saved = localStorage.getItem(key)
    if (saved) {
      const transactions = JSON.parse(saved) as Transaction[]
      // 按时间倒序排列（最新的在前）
      return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }
  } catch (e) {
    console.warn('Failed to load transactions from localStorage:', e)
  }
  
  return []
}

/**
 * 添加交易记录
 * @param userId 用户ID
 * @param transaction 交易记录
 */
export const addTransaction = async (userId: number, transaction: Transaction): Promise<void> => {
  if (typeof window === 'undefined') {
    return
  }
  
  try {
    const key = getTransactionsKey(userId)
    const existing = await getTransactions(userId)
    
    // 生成新ID（使用当前最大ID + 1）
    const newId = existing.length > 0 
      ? Math.max(...existing.map(t => t.id)) + 1 
      : 1
    
    const newTransaction: Transaction = {
      ...transaction,
      id: newId
    }
    
    existing.unshift(newTransaction) // 添加到最前面
    
    localStorage.setItem(key, JSON.stringify(existing))
  } catch (e) {
    console.warn('Failed to save transaction to localStorage:', e)
  }
}

// 用户积分存储（按用户ID存储）
const getUserPointsKey = (userId: number) => `user_points_${userId}`

/**
 * 获取用户的社区积分
 * @param userId 用户ID
 * @param communityId 社区ID
 */
export const getUserCommunityPoints = async (userId: number, communityId: number): Promise<number> => {
  await new Promise(resolve => setTimeout(resolve, 200))
  
  if (typeof window === 'undefined') {
    return 0
  }
  
  try {
    const key = getUserPointsKey(userId)
    const saved = localStorage.getItem(key)
    if (saved) {
      const points = JSON.parse(saved) as Record<number, number>
      return points[communityId] || 0
    }
  } catch (e) {
    console.warn('Failed to load user points from localStorage:', e)
  }
  
  return 0
}

/**
 * 更新用户的社区积分
 * @param userId 用户ID
 * @param communityId 社区ID
 * @param points 积分数量（正数表示增加，负数表示减少）
 */
export const updateUserCommunityPoints = async (userId: number, communityId: number, points: number): Promise<number> => {
  if (typeof window === 'undefined') {
    return 0
  }
  
  try {
    const key = getUserPointsKey(userId)
    let userPoints: Record<number, number> = {}
    
    const saved = localStorage.getItem(key)
    if (saved) {
      userPoints = JSON.parse(saved)
    }
    
    const currentPoints = userPoints[communityId] || 0
    const newPoints = Math.max(0, currentPoints + points) // 确保积分不为负数
    userPoints[communityId] = newPoints
    
    localStorage.setItem(key, JSON.stringify(userPoints))
    return newPoints
  } catch (e) {
    console.warn('Failed to update user points in localStorage:', e)
    return 0
  }
}

/**
 * 获取用户的所有积分（所有社区）
 * @param userId 用户ID
 */
export const getUserPoints = async (userId: number): Promise<Record<number, number>> => {
  await new Promise(resolve => setTimeout(resolve, 200))
  
  if (typeof window === 'undefined') {
    return {}
  }
  
  try {
    const key = getUserPointsKey(userId)
    const saved = localStorage.getItem(key)
    if (saved) {
      return JSON.parse(saved) as Record<number, number>
    }
  } catch (e) {
    console.warn('Failed to load user points from localStorage:', e)
  }
  
  return {}
}

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

const getAuthHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  }

  if (typeof window !== 'undefined') {
    const token = getCookie(AUTH_TOKEN_KEY)
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }

  return headers
}

/**
 * 获取 API 基础 URL
 * 优先从环境变量读取，否则使用默认值
 */
export const getApiBaseUrl = (): string => {
  // 优先使用环境变量（兼容客户端和服务器端）
  if (typeof window !== 'undefined') {
    // 客户端环境：使用 import.meta.env
    const env = (import.meta as any).env
    if (env?.NUXT_PUBLIC_API_URL) {
      return env.NUXT_PUBLIC_API_URL
    }
  } else {
    // 服务器端环境：使用 process.env
    const processEnv = (globalThis as any).process?.env || {}
    if (processEnv.NUXT_PUBLIC_API_URL) {
      return processEnv.NUXT_PUBLIC_API_URL
    }
  }
  
  // 尝试从 Nuxt 运行时配置获取（如果可用）
  if (typeof window !== 'undefined') {
    try {
      const nuxtApp = (window as any).__NUXT__
      if (nuxtApp?.config?.public?.apiUrl) {
        return nuxtApp.config.public.apiUrl
      }
    } catch (e) {
      // 忽略错误
    }
  }
  
  // 默认值（开发环境）
  return 'http://localhost:3001'
}

// ==================== 活动相关 API ====================

/**
 * 获取所有活动列表
 * @param status 可选：按状态筛选活动
 * TODO: 等待后端实现活动 API
 */
export const getActivities = async (status?: Activity['status']): Promise<Activity[]> => {
  console.warn('活动 API 暂未实现，返回空数组')
  return []
}

/**
 * 根据 ID 获取单个活动详情
 * @param id 活动 ID
 * TODO: 等待后端实现活动 API
 */
export const getActivityById = async (id: number): Promise<Activity | null> => {
  console.warn('活动 API 暂未实现，返回 null')
  return null
}

/**
 * 报名参加活动
 * @param id 活动 ID
 * TODO: 等待后端实现活动 API
 */
export const joinActivity = async (id: number): Promise<{ success: boolean; message: string }> => {
  console.warn('活动 API 暂未实现，返回错误消息')
  return { success: false, message: '活动功能暂未实现，等待后端开发' }
}

/**
 * 创建活动
 * @param params 活动参数
 * TODO: 等待后端实现活动 API
 */
export const createActivity = async (params: CreateActivityParams): Promise<Activity> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500))
  
  console.warn('Activities API not implemented yet')
  
  // 返回Mock数据，让页面可以正常渲染
  return {
    id: Date.now(), // 临时ID
    name: params.name,
    description: params.description,
    location: params.location || '',
    startTime: params.startTime,
    endTime: params.endTime,
    image: '',
    organizer: params.organizer || '',
    participants: 0,
    maxParticipants: params.maxParticipants || 0,
    status: 'upcoming',
    tags: params.tags || []
  }
}

// ==================== 任务相关 API ====================

/**
 * 获取活动的任务列表
 * @param activityId 活动 ID
 * @param baseUrl API 基础 URL
 */
export const getTasks = async (activityId: number, baseUrl: string): Promise<Task[]> => {
  try {
    // 获取所有任务，然后在前端过滤
    const allTasks = await getAllTasks(baseUrl)
    return allTasks.filter(task => task.activityId === activityId)
  } catch (error: any) {
    console.error('Get tasks error:', error)
    throw error
  }
}

/**
 * 根据 ID 获取单个任务详情
 * @param id 任务 ID (UUID string)
 * @param baseUrl API 基础 URL
 */
export const getTaskById = async (id: string, baseUrl: string): Promise<Task | null> => {
  try {
    const response = await fetch(`${baseUrl}/api/tasks/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
    return null
      }
      const error = await response.json()
      throw new Error(error.error || '获取任务失败')
    }

    const task: Task = await response.json()
    return task
  } catch (error: any) {
    console.error('Get task by id error:', error)
    throw error
  }
}

/**
 * 获取所有任务列表
 * @param baseUrl API 基础 URL
 */
export const getAllTasks = async (baseUrl: string): Promise<Task[]> => {
  try {
    const response = await fetch(`${baseUrl}/api/tasks`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || '获取任务列表失败')
    }

    const tasks: Task[] = await response.json()
    return tasks
  } catch (error: any) {
    console.error('Get all tasks error:', error)
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
  allowRepeatClaim?: boolean  // 是否允许重复领取
  participantLimit?: number | null
  rewardDistributionMode?: 'per_person' | 'total'
  submissionInstructions?: string
}

/**
 * 创建新任务
 * @param params 任务参数
 * @param baseUrl API 基础 URL
 */
export const createTask = async (params: CreateTaskParams, baseUrl: string): Promise<Task> => {
  try {
    const response = await fetch(`${baseUrl}/api/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({
    title: params.title,
    description: params.description,
    reward: params.reward,
        startDate: params.startDate,
        deadline: params.deadline,
        proofConfig: params.proofConfig || null,
        allowRepeatClaim: params.allowRepeatClaim || false,
        participantLimit: params.participantLimit ?? null,
        rewardDistributionMode: params.rewardDistributionMode || 'per_person',
        submissionInstructions: params.submissionInstructions,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || '创建任务失败')
    }

    const task: Task = await response.json()
    return task
  } catch (error: any) {
    console.error('Create task error:', error)
    throw error
  }
}

/**
 * 领取任务
 * @param taskId 任务 ID (UUID string)
 * @param baseUrl API 基础 URL
 * @param userIdentifier 用户标识（可选，如果已登录则从 getMe 获取用户ID）
 */
export const claimTask = async (taskId: string, baseUrl: string, userIdentifier?: string): Promise<{ success: boolean; message: string }> => {
  try {
    // 如果没有提供 userIdentifier，尝试从当前登录用户获取
    let userId = userIdentifier
    if (!userId) {
      try {
        const user = await getMe(baseUrl)
        userId = user.id
      } catch (e) {
        // 如果未登录，使用临时标识符（从 localStorage 获取）
        if (typeof window !== 'undefined') {
          userId = localStorage.getItem('current_identifier') || undefined
        }
      }
    }

    const response = await fetch(`${baseUrl}/api/tasks/${taskId}/claim`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({
        userIdentifier: userId,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, message: error.message || '领取任务失败' }
    }

    const result = await response.json()
    return result
  } catch (error: any) {
    console.error('Claim task error:', error)
    return { success: false, message: error.message || '领取任务失败' }
  }
}

/**
 * 获取我的任务列表
 * @param baseUrl API 基础 URL
 */
export const getMyTasks = async (baseUrl: string): Promise<Task[]> => {
  try {
    // 获取所有任务，然后在前端过滤（需要根据用户ID过滤）
    // 注意：这个功能需要后端支持，或者前端根据 task_claims 表查询
    // 目前先返回所有任务，后续可以优化
    const allTasks = await getAllTasks(baseUrl)
    
    // 尝试获取当前用户ID
    try {
      const user = await getMe(baseUrl)
      // TODO: 如果后端提供了根据用户ID获取任务的接口，应该调用那个接口
      // 目前先返回所有任务，前端可以根据需要进一步过滤
      return allTasks.filter(task => task.isClaimed)
    } catch (e) {
      // 如果未登录，返回空数组
      return []
    }
  } catch (error: any) {
    console.error('Get my tasks error:', error)
    throw error
  }
}

/**
 * 提交任务完成凭证
 * @param taskId 任务 ID (UUID string)
 * @param proof 凭证数据
 * @param baseUrl API 基础 URL
 */
export const submitProof = async (taskId: string, proof: ProofData, baseUrl: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${baseUrl}/api/tasks/${taskId}/submit`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({
        proof: proof, // 直接传递对象，后端会序列化
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, message: error.message || '提交凭证失败' }
    }

    const result = await response.json()
    return result
  } catch (error: any) {
    console.error('Submit proof error:', error)
    return { success: false, message: error.message || '提交凭证失败' }
  }
}

/**
 * 获取审核中的任务列表
 * @param baseUrl API 基础 URL
 */
export const getReviewTasks = async (baseUrl: string): Promise<Task[]> => {
  try {
    // 从后端获取所有任务，然后过滤出审核中的任务
    const allTasks = await getAllTasks(baseUrl)
    return allTasks.filter(task => task.status === 'under_review')
  } catch (error) {
    console.error('Get review tasks error:', error)
    return []
  }
}

/**
 * 审核通过任务
 * @param taskId 任务 ID (UUID string)
 * @param baseUrl API 基础 URL
 * @param comments 可选的审核评语
 */
export const approveTask = async (taskId: string, baseUrl: string, comments?: string): Promise<{ success: boolean; message: string }> =>
{
  try
  {
    const response = await fetch(`${baseUrl}/api/tasks/${taskId}/approve`,
      {
        method: 'PATCH',
        headers: 
        {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: comments ? JSON.stringify({ comments }) : undefined,
      }
    )

    if (!response.ok)
    {
      const error = await response.json()
      return {
        success: false,
        message: error.message || '审核失败'
      }
    }

    const result = await response.json()
    return result
  } catch (error: any)
  {
    console.error('Approve task error:', error)
    return { success: false, message: error.message || '审核失败'}
  }
}

/**
 * 驳回任务
 * @param taskId 任务 ID (UUID string)
 * @param reason 驳回理由
 * @param baseUrl API 基础 URL
 * @param rejectOption 驳回选项：'resubmit' 重新提交证明，'reclaim' 重新发布任务
 */
export const rejectTask = async (taskId: string, reason: string, baseUrl: string, rejectOption?: 'resubmit' | 'reclaim'): Promise<{ success: boolean; message: string }> =>
{
  try
  {
    // 构建请求体，确保 rejectOption 总是被包含（如果存在）
    const body: any = { reason }
    if (rejectOption) {
      body.rejectOption = rejectOption
    }
    
    const response = await fetch(`${baseUrl}/api/tasks/${taskId}/reject`,
      {
        method: 'PATCH',
        headers:
        {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(body),
      }
    )

    if (!response.ok)
    {
      const error = await response.json()
      return { success: false, message: error.message || '审核失败'}
    }

    const result = await response.json()
    return result
  } catch (error: any)
  {
    console.error('Reject task error:', error)
    return { success: false, message: error.message || '审核失败' }
  }
}

/**
 * 打折审核任务
 * @param taskId 任务 ID (number 或 string)
 * @param discount 打折百分数
 * @param reason 打折理由
 * TODO: 等待后端实现打折 API
 */
export const discountTask = async (
  taskId: number | string,
  discount: number,
  reason: string
): Promise<{ success: boolean; message: string }> => {
  console.warn('打折功能暂未实现')
  return { success: false, message: '打折功能暂未实现，请使用审核功能' }
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
/**
 * 发送短信验证码
 * @param phone 手机号
 * @param baseUrl API 基础 URL
 */
export const sendSMS = async (phone: string, baseUrl: string): Promise<{ result: string }> => {
  const response = await fetch(`${baseUrl}/api/auth/send-sms`,
    {
      method:'POST',
      headers:
      {
        'Content-Type':'application/json',
      },
      body:JSON.stringify({phone}),
    }
  )

  if(!response.ok)
  {
    const error= await response.json()
    throw new Error(error.message||'Failed to send SMS')
  }
  return response.json()
}

/**
 * 发送邮箱验证码
 * @param email 邮箱地址
 * TODO: 等待后端实现邮箱验证码 API
 */
export const sendEmailCode = async (email: string): Promise<{ result: string }> => {
  console.warn('邮箱验证码功能暂未实现，返回 Mock 响应')
  await new Promise(resolve => setTimeout(resolve, 1000))
  return { result: 'ok' }
}

/**
 * 登录
 * @param identifier 手机号或邮箱
 * @param code 验证码
 * @param baseUrl API 基础 URL
 */
export const signIn = async (identifier: string, code: string, baseUrl: string): Promise<{ result: string; auth_token?:string }> => {
  const response = await fetch(`${baseUrl}/api/auth/signin`,
    {
      method:'POST',
      headers:
      {
        'Content-Type':'application/json',
      },
      body:JSON.stringify({phone: identifier, code}),
    }
  )

  if(!response.ok)
  {
    const error = await response.json()
    throw new Error(error.message || 'Failed to sign in')
  }

  const data = await response.json()

  // 保存token到cookie
  if (data.auth_token)
  {
    setCookie(AUTH_TOKEN_KEY,data.auth_token)
  }

  return data
}

/**
 * 使用邮箱登录
 * @param email 邮箱
 * @param code 验证码
 * @param baseUrl API 基础 URL
 * @param userType 用户类型（可选）
 */
export const signInWithEmail = async (email: string, code: string, baseUrl: string, userType?: 'member' | 'community'): Promise<{ result: string; isNewUser?: boolean }> => {
  return signIn(email, code, baseUrl)
}

/**
 * 获取当前用户信息
 * @param baseUrl API 基础 URL
 */
export const getMe = async (baseUrl: string): Promise<any> => {
  const response = await fetch(`${baseUrl}/api/auth/me`,
    {
      method:'GET',
      headers: getAuthHeaders(),
    }
  )

  if(!response.ok)
  {
    if(response.status===401)
    {
      clearAuthToken()
    }
    throw new Error('Failed to get user info')
  }
  return response.json()
}

export const setEncryptedKeys = async (keys: string): Promise<{ result: string }> => {
  await new Promise(resolve => setTimeout(resolve, 500))
  console.log('[Mock] 设置加密密钥')
  return { result: 'ok' }
}

export const AUTH_TOKEN_KEY = 'auth_token'

// 使用 localStorage 存储 token，避免部署后丢失
export const getCookie = (key: string): string | null => {
  if(typeof window === 'undefined') return null
  try {
    // 优先从 localStorage 读取
    let token = localStorage.getItem(key)
    
    // 如果 localStorage 中没有，尝试从 cookie 读取（兼容旧数据）
    if (!token) {
      const cookies = document.cookie.split(';')
      for (let cookie of cookies)
      {
        const [name,value]= cookie.trim().split('=')
        if(name===key)
        {
          token = decodeURIComponent(value)
          // 迁移到 localStorage
          if (token) {
            localStorage.setItem(key, token)
            // 删除旧的 cookie
            document.cookie=`${key}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`
          }
          break
        }
      }
    }
    
    return token
  } catch (e) {
    // 如果 localStorage 不可用，回退到 cookie
    const cookies = document.cookie.split(';')
    for (let cookie of cookies)
    {
      const [name,value]= cookie.trim().split('=')
      if(name===key)
      {
        return decodeURIComponent(value)
      }
    }
    return null
  }
}

export const setCookie = (key:string,value:string,days:number=365)=>
{
  if (typeof window ==='undefined') return
  try {
    // 优先使用 localStorage
    localStorage.setItem(key, value)
  } catch (e) {
    // 如果 localStorage 不可用，回退到 cookie
    const expires=new Date()
    expires.setTime(expires.getTime()+days*24*60*60*1000)
    document.cookie=`${key}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`
  }
}

export const deleteCookie = (key:string)=>
{
  if(typeof window ==='undefined') return
  try {
    localStorage.removeItem(key)
  } catch (e) {
    // 如果 localStorage 不可用，回退到 cookie
    document.cookie=`${key}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`
  }
}

export const clearAuthToken =(): void=>
{
  deleteCookie(AUTH_TOKEN_KEY)
}

// 保存当前登录标识符
export const setCurrentIdentifier = (identifier: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('current_identifier', identifier)
  }
}

/**
 * 上传头像
 * @param file 头像文件
 * @param baseUrl API 基础 URL
 */
export const uploadAvatar = async (file: File, baseUrl: string): Promise<{ url: string; hash: string }> => {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const headers = getAuthHeaders()
    // 移除 content-type,让浏览器自动设置（包含boundary）
    delete (headers as any)['Content-Type']

    const response = await fetch(`${baseUrl}/api/upload/avatar`, {
      method: 'POST',
      headers,
      body: formData
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || '上传头像失败')
    }

    const result = await response.json()
    return { url: result.url, hash: result.hash }
  } catch (error: any) {
    console.error('Upload avatar error:', error)
    throw error
  }
}

// 更新用户信息
export interface UserProfile {
  name: string
  bio?: string
  avatar?: string
}

export const updateUserProfile = async (userId: string | number, profile: UserProfile, baseUrl: string): Promise<{ success: boolean; message: string }> => {
  try {
    const headers = getAuthHeaders()

    const response = await fetch(`${baseUrl}/api/auth/me`, {
      method: 'PATCH',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profile)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || '更新用户信息失败')
    }

    const result = await response.json()

    if (result.result === 'ok') {
      return { success: true, message: '用户信息更新成功'}
    } else {
      throw new Error(result.message || '更新用户信息失败')
    }
  } catch (error: any) {
    console.error('Update user profile error:', error)
    throw error
  }
}

/**
 * 上传任务凭证照片
 * @param files 照片数组
 * @param taskId 任务 ID
 * @param baseUrl API 基础 URL
 */
export const uploadProofFile = async (
  files: File[],
  taskId: string,
  baseUrl: string
): Promise<ProofFile[]> => {
  try {
    const formData = new FormData()
    files.forEach(file => {
      formData.append('files', file)
    })
    formData.append('taskId', taskId)

    const headers = getAuthHeaders()
    // 移除 content-type,让浏览器自动设置（包含boundary）
    delete (headers as any)['Content-Type']

    const response = await fetch(`${baseUrl}/api/upload/proof`, {
      method: 'POST',
      headers,
      body: formData
    })

    if (!response.ok) {
      // 检查响应内容类型
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        const error = await response.json()
        throw new Error(error.message || error.error || '上传文件失败')
      } else {
        // 如果不是 JSON，可能是 HTML 错误页面（如 404）
        if (response.status === 404) {
          throw new Error('上传接口不存在，请检查后端服务是否正常运行')
        }
        throw new Error(`上传文件失败 (${response.status}): ${response.statusText}`)
      }
    }

    const result = await response.json()
    return result.files
  } catch (error: any) {
    console.error('Upload proof file error:', error)
    throw error
  }
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
  location?: string              // 社群位置 (例如: 上海, 北京)
  pointName?: string             // 社区积分名称
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
  location?: string              // 节点位置（针对社群）
}

/**
 * 网络连接数据结构
 */
export interface NetworkLink {
  source: string                 // 源节点ID
  target: string                 // 目标节点ID
  weight: number                 // 连接权重（基于参与度和活跃度）
}

// Mock 社群数据（两个社区）
const mockCommunities: Community[] = [
  {
    id: 1,
    name: '有种行动队',
    description: '社区种菜志愿者组织，一起种植、收获、分享绿色生活。',
    memberCount: 68,
    activityCount: 18,
    totalPoints: 18900,
    category: '园艺',
    location: '上海',
    pointName: '零废弃积分',
    createdAt: '2024-02-01T00:00:00Z',
    markdownIntro: `# 有种行动队

欢迎加入我们的社区种菜志愿者组织！一起体验种植的乐趣，践行零废弃生活。

## 我们的目标
- 推广绿色生活理念
- 学习有机种植技术
- 分享收获的喜悦
- 践行零废弃生活方式

## 活动安排
- 每周六上午：集体种植
- 每月一次：收获分享会
- 不定期：种植技术讲座
- 零废弃积分奖励机制
    `
  },
  {
    id: 2,
    name: '南塘',
    description: '素舍提供乡村村民宿餐饮，体验乡村生活，感受自然之美。',
    memberCount: 45,
    activityCount: 12,
    totalPoints: 12500,
    category: '乡村生活',
    location: '安徽',
    pointName: '南塘豆',
    createdAt: '2024-03-15T00:00:00Z',
    markdownIntro: `# 南塘

欢迎来到南塘，素舍提供乡村村民宿餐饮服务。

## 我们的特色
- 乡村民宿体验
- 地道乡村餐饮
- 自然生态体验
- 南塘豆积分奖励

## 服务内容
- 民宿住宿服务
- 乡村特色餐饮
- 农事体验活动
- 乡村文化体验
    `
  }
]

// Mock 成员数据（关联到两个社区）
const mockMembers: Member[] = [
  { id: 1, name: '赵园丁', title: '资深园丁', reputation: 920, totalContributions: 30, completedTasks: 22, totalReward: 4.0, skills: ['有机种植', '土壤管理', '病虫害防治'], communities: [1], participationScore: 98, activityScore: 95, avatarSeed: 'gardener1' },
  { id: 2, name: '钱农夫', title: '种植专家', reputation: 780, totalContributions: 22, completedTasks: 18, totalReward: 3.0, skills: ['蔬菜种植', '堆肥制作'], communities: [1], participationScore: 88, activityScore: 85, avatarSeed: 'farmer1' },
  { id: 3, name: '孙绿手指', title: '园艺爱好者', reputation: 650, totalContributions: 16, completedTasks: 13, totalReward: 2.2, skills: ['花卉种植', '园艺设计'], communities: [1], participationScore: 75, activityScore: 72, avatarSeed: 'green1' },
  { id: 4, name: '周菜农', title: '菜园管理员', reputation: 580, totalContributions: 12, completedTasks: 10, totalReward: 1.8, skills: ['菜园管理', '收获分享'], communities: [1], participationScore: 68, activityScore: 65, avatarSeed: 'veggie1' },
  { id: 5, name: '吴新手', title: '种植新手', reputation: 420, totalContributions: 8, completedTasks: 6, totalReward: 1.0, skills: ['基础种植'], communities: [1], participationScore: 58, activityScore: 55, avatarSeed: 'newbie1' },
  { id: 6, name: '李素舍', title: '民宿主人', reputation: 850, totalContributions: 25, completedTasks: 20, totalReward: 3.5, skills: ['民宿管理', '乡村餐饮', '文化体验'], communities: [2], participationScore: 92, activityScore: 88, avatarSeed: 'host1' },
  { id: 7, name: '王乡村', title: '乡村体验师', reputation: 720, totalContributions: 18, completedTasks: 15, totalReward: 2.8, skills: ['农事体验', '乡村导览'], communities: [2], participationScore: 82, activityScore: 78, avatarSeed: 'rural1' },
  { id: 8, name: '张田园', title: '田园生活家', reputation: 600, totalContributions: 14, completedTasks: 11, totalReward: 2.0, skills: ['田园生活', '自然体验'], communities: [2], participationScore: 70, activityScore: 68, avatarSeed: 'field1' }
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
 * 根据成员ID获取钱包地址
 * 由于member对象中没有identifier，我们基于member ID生成确定性钱包地址
 */
export const getWalletAddressByMemberId = async (id: number): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 100))
  
  // 基于member ID生成确定性钱包地址
  // 使用ID作为种子，生成一个看起来像真实地址的字符串
  const seed = `member_${id}`
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  
  // 生成40个字符的十六进制地址（去掉0x前缀后）
  const hexString = Math.abs(hash).toString(16).padStart(8, '0')
  const address = `0x${hexString.repeat(5).slice(0, 40)}`
  
  return address
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
      activityScore: avgActivity,
      location: comm.location
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

/**
 * 活动日志数据结构
 */
export interface ActivityLog {
  id: number
  type: 'join' | 'complete_task' | 'create_proposal' | 'new_community'
  userId?: number
  userName?: string
  targetId: number // communityId or taskId
  targetName: string
  timestamp: string
}

/**
 * 交易记录数据结构
 */
export interface Transaction {
  id: number
  type: 'in' | 'out'
  title: string
  date: string
  amount: number
  currency: string  // 'CP', 'ETH', 'ZWP', 'NTD' 等
  taskId?: number   // 关联的任务ID
  taskTitle?: string // 任务标题
}

/**
 * 社区交易记录数据结构（包含用户信息）
 */
export interface CommunityTransaction {
  id: number
  userId: number
  userName: string
  userAvatarSeed?: string
  type: 'in' | 'out'
  title: string
  date: string
  amount: number
  currency: string
  taskId?: number
  taskTitle?: string
}

/**
 * 获取活动日志（Live Feed）
 */
export const getActivityFeed = async (): Promise<ActivityLog[]> => {
  await new Promise(resolve => setTimeout(resolve, 100))
  
  // Mock 一些动态数据
  const logs: ActivityLog[] = [
    { id: 1, type: 'join', userId: 5, userName: '吴新手', targetId: 1, targetName: '有种行动队', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
    { id: 2, type: 'complete_task', userId: 1, userName: '赵园丁', targetId: 101, targetName: '修剪灌木', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
    { id: 3, type: 'join', userId: 8, userName: '张田园', targetId: 2, targetName: '南塘', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
    { id: 4, type: 'complete_task', userId: 6, userName: '李素舍', targetId: 102, targetName: '民宿接待', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
    { id: 5, type: 'create_proposal', userId: 2, userName: '钱农夫', targetId: 1, targetName: '增加堆肥箱', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
    { id: 6, type: 'join', userId: 7, userName: '王乡村', targetId: 2, targetName: '南塘', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString() }
  ]
  
  return logs
}

/**
 * 获取社区所有成员的交易记录
 * @param communityId 社区ID
 */
export const getCommunityTransactions = async (communityId: number): Promise<CommunityTransaction[]> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  
  try {
    // 获取该社区的所有成员
    const members = mockMembers.filter(m => m.communities.includes(communityId))
    
    // 获取所有成员的交易记录
    const allTransactions: CommunityTransaction[] = []
    
    for (const member of members) {
      const userTransactions = await getTransactions(member.id)
      
      // 转换为社区交易记录格式
      for (const tx of userTransactions) {
        allTransactions.push({
          id: tx.id,
          userId: member.id,
          userName: member.name,
          userAvatarSeed: member.avatarSeed,
          type: tx.type,
          title: tx.title,
          date: tx.date,
          amount: tx.amount,
          currency: tx.currency,
          taskId: tx.taskId,
          taskTitle: tx.taskTitle
        })
      }
    }
    
    // 按时间倒序排列（最新的在前）
    return allTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } catch (error) {
    console.error('Failed to load community transactions:', error)
    return []
  }
}
