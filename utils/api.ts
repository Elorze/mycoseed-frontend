

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
  accuracy:number
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
 * 任务数据结构
 */
export interface Task {
  id: string                     // 任务ID (UUID)
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
  startDate?: string             // 开始时间
  deadline?: string              // 截止时间
  proofConfig?: any              // 凭证配置
  allowRepeatClaim?: boolean     // 是否允许重复领取
  createdAt?: string             // 创建时间
  updatedAt?: string             // 更新时间
  participantLimit?: number | null // 参与人数上限
  rewardDistributionMode?: 'per_person' | 'total' // 奖励分配模式
  submissionInstructions?: string // 提交说明
  // 以下字段为前端兼容字段（后端不返回）
  creatorId?: string             // 创建者ID (UUID)
  creatorName?: string           // 创建者名称
  claimerId?: number             // 接单者ID
  claimerName?: string           // 接单者名称
  claimedAt?: string             // 领取时间
  submittedAt?: string           // 提交时间
  completedAt?: string           // 完成时间
}

export interface ActivityLog {
  id: number
  type: 'join' | 'complete_task' | 'create_proposal' | 'new_community'
  userId?: number
  userName?: string
  targetId: number // communityId or taskId
  targetName: string
  timestamp: string
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

// ==================== 活动相关 API ====================

/**
 * 获取所有活动列表
 * @param status 可选：按状态筛选活动
 * TODO: 等待后端实现活动 API
 */
export const getActivities = async (status?: Activity['status']): Promise<Activity[]> => {
  console.warn('Activities API not implemented yet')
  return []
}

/**
 * 根据 ID 获取单个活动详情
 * @param id 活动 ID
 * TODO: 等待后端实现活动 API
 */
export const getActivityById = async (id: number): Promise<Activity | null> => {
  console.warn('Activities API not implemented yet')
  return null
}

/**
 * 报名参加活动
 * @param id 活动 ID
 * TODO: 等待后端实现活动 API
 */
export const joinActivity = async (id: number): Promise<{ success: boolean; message: string }> => {
  console.warn('Activities API not implemented yet')
  return { success: false, message: '活动功能暂未实现，等待后端开发' }
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
 */
export const rejectTask = async (taskId: string, reason: string, baseUrl: string): Promise<{ success: boolean; message: string }> =>
{
  try
  {
    const response = await fetch(`${baseUrl}/api/tasks/${taskId}/reject`,
      {
        method: 'PATCH',
        headers:
        {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ reason }),
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
 * @param taskId 任务 ID (UUID string)
 * @param discount 打折百分数
 * @param reason 打折理由
 * TODO: 等待后端实现审核 API
 */
export const discountTask = async (taskId: string, discount: number, reason: string): Promise<{ success: boolean; message: string }> => {
  console.warn('Task review API not implemented yet')
  return { success: false, message: '审核功能暂未实现，等待后端开发' }
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

export const sendEmailCode = async (email: string): Promise<{ result: string }> => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  console.log(`[Mock] 发送验证码到邮箱: ${email}`)
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


export const AUTH_TOKEN_KEY = 'auth_token'

export const getCookie = (key: string): string | null => {
  if(typeof document === 'undefined') return null
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

export const setCookie = (key:string,value:string,days:number=365)=>
{
  if (typeof document ==='undefined') return
  const expires=new Date()
  expires.setTime(expires.getTime()+days*24*60*60*1000)
  document.cookie=`${key}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`
}

export const deleteCookie = (key:string)=>
{
  if(typeof document ==='undefined') return
  document.cookie=`${key}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`
}

export const clearAuthToken =(): void=>
{
  deleteCookie(AUTH_TOKEN_KEY)
}

// getAuthHeaders 函数已在上面定义（第 96 行），这里删除重复定义

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
  avatar?: string                // 头像URL
  bio?: string                   // 个人简介
}

/**
 * 网络节点数据结构
 */
export interface NetworkNode {
  id: string
  name: string
  type: 'COMMUNITY' | 'USER'
  value: number                  // 用于显示的权重值
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

// Mock 社群和成员数据已删除
// TODO: 等待后端实现社群和成员 API

/**
 * 获取所有社群列表
 * TODO: 等待后端实现社群 API
 */
export const getCommunities = async (): Promise<Community[]> => {
  console.warn('Communities API not implemented yet')
  return []
}

/**
 * 根据 ID 获取单个社群详情
 * TODO: 等待后端实现社群 API
 */
export const getCommunityById = async (id: number): Promise<Community | null> => {
  console.warn('Communities API not implemented yet')
  return null
}

/**
 * 获取社群成员列表
 * TODO: 等待后端实现成员 API
 */
export const getCommunityMembers = async (communityId: number): Promise<Member[]> => {
  console.warn('Members API not implemented yet')
  return []
}

/**
 * 获取所有成员列表
 * TODO: 等待后端实现成员 API
 */
export const getMembers = async (): Promise<Member[]> => {
  console.warn('Members API not implemented yet')
  return []
}

/**
 * 根据 ID 获取单个成员详情
 * TODO: 等待后端实现成员 API
 */
export const getMemberById = async (id: number): Promise<Member | null> => {
  console.warn('Members API not implemented yet')
  return null
}

/**
 * 获取网络图数据（包含节点和连接）
 * 根据参与度和活跃度进行加权
 * TODO: 等待后端实现社群和成员 API 后，基于真实数据生成网络图
 */
export const getNetworkData = async (): Promise<{ nodes: NetworkNode[], links: NetworkLink[] }> => {
  console.warn('Network data API not implemented yet')
  // 返回空数据，等待后端实现
  return { nodes: [], links: [] }
}


// 获取活动日志（Live Feed)
export const getActivityFeed = async (): Promise<ActivityLog[]> => {
  await new Promise(resolve => setTimeout(resolve, 100))

  return []
}