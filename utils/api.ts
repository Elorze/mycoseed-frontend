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
  
  // 重新加载任务（确保获取最新数据）
  tasks = loadTasks()
  
  return tasks
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
export const getTaskById = async (id: number): Promise<Task | null> => {
  await new Promise(resolve => setTimeout(resolve, 200))
  
  // 重新加载任务（确保获取最新数据）
  tasks = loadTasks()
  
  const task = tasks.find(t => t.id === id)
  if (!task) {
    return null
  }
  
  return {
    ...task,
    isClaimed: claimedTaskIds.includes(task.id)
  }
}

/**
 * 获取所有任务列表
 */
export const getAllTasks = async (): Promise<Task[]> => {
  await new Promise(resolve => setTimeout(resolve, 200))
  
  // 重新加载任务（确保获取最新数据）
  tasks = loadTasks()
  
  return tasks.map(task => ({
    ...task,
    isClaimed: claimedTaskIds.includes(task.id)
  }))
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
  participantLimit?: number | null
  rewardDistributionMode?: 'per_person' | 'total'
  submissionInstructions?: string
  proofConfig?: any
}

export const createTask = async (params: CreateTaskParams): Promise<Task> => {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // 重新加载任务（确保获取最新数据）
  tasks = loadTasks()
  
  // 生成新任务ID（使用当前最大ID + 1）
  const newId = tasks.length > 0 
    ? Math.max(...tasks.map(t => t.id)) + 1 
    : 1
  
  const now = new Date().toISOString()
  const newTask: Task = {
    id: newId,
    activityId: 0, // 独立任务，不关联活动
    title: params.title,
    description: params.description,
    reward: params.reward,
    participantLimit: params.participantLimit ?? null,
    rewardDistributionMode: params.rewardDistributionMode || 'per_person', // 保存奖励分配模式，默认为每人积分
    isClaimed: false,
    status: 'unclaimed',
    creatorId: 1, // Mock: 当前用户ID，实际应从认证系统获取
    creatorName: '当前用户', // Mock: 当前用户名称
    proofConfig: params.proofConfig, // 保存证明配置
    submissionInstructions: params.submissionInstructions,
    startDate: params.startDate, // 保存开始日期
    deadline: params.deadline, // 保存截止日期
    createdAt: now,
    updatedAt: now
  }
  
  tasks.push(newTask)
  // 保存到 localStorage 以便跨页面同步
  persistTasks()
  
  return newTask
}

/**
 * 领取任务
 * @param taskId 任务 ID
 */
export const claimTask = async (taskId: number): Promise<{ success: boolean; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  
  // 重新加载任务（确保获取最新数据）
  tasks = loadTasks()
  
  const task = tasks.find(t => t.id === taskId)
  if (!task) {
    return { success: false, message: '任务不存在' }
  }
  
  if (task.status !== 'unclaimed') {
    return { success: false, message: '任务已被领取或已完成' }
  }
  
  if (claimedTaskIds.includes(taskId)) {
    return { success: false, message: '您已经领取过这个任务' }
  }
  
  // 更新任务状态和接单者信息
  const now = new Date().toISOString()
  task.status = 'in_progress'
  task.isClaimed = true
  task.claimerId = 1 // Mock: 当前用户ID，实际应从认证系统获取
  task.claimerName = '当前用户' // Mock: 当前用户名称
  task.claimedAt = now
  task.updatedAt = now
  
  claimedTaskIds.push(taskId)
  // 持久化任务状态变化
  persistTasks()
  return { success: true, message: '任务领取成功！' }
}

/**
 * 获取我的任务列表
 * 返回所有曾经领取过的任务（包括所有状态：进行中、审核中、已完成、已驳回）
 */
export const getMyTasks = async (): Promise<Task[]> => {
  await new Promise(resolve => setTimeout(resolve, 200))
  
  // 重新加载任务（确保获取最新数据）
  tasks = loadTasks()
  
  // Mock: 当前用户ID为1，实际应从认证系统获取
  const currentUserId = 1
  
  // 根据 claimerId 查找所有曾经领取过的任务（包括所有状态）
  return tasks.filter(task => task.claimerId === currentUserId)
}

/**
 * 提交任务完成凭证
 * @param taskId 任务 ID
 * @param proof 凭证内容
 */
export const submitProof = async (taskId: number, proof: string): Promise<{ success: boolean; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  
  // 重新加载任务（确保获取最新数据）
  tasks = loadTasks()
  
  const task = tasks.find(t => t.id === taskId)
  if (!task) {
    return { success: false, message: '任务不存在' }
  }
  
  if (task.status !== 'in_progress') {
    return { success: false, message: '任务状态不正确，无法提交凭证' }
  }
  
  if (!claimedTaskIds.includes(taskId)) {
    return { success: false, message: '您还没有领取这个任务' }
  }
  
  const now = new Date().toISOString()
  task.proof = proof
  task.status = 'under_review'
  task.submittedAt = now
  task.updatedAt = now
  // 持久化任务状态变化
  persistTasks()
  return { success: true, message: '凭证提交成功！' }
}

/**
 * 获取审核中的任务列表
 */
export const getReviewTasks = async (): Promise<Task[]> => {
  await new Promise(resolve => setTimeout(resolve, 200))
  
  // 重新加载任务（确保获取最新数据）
  tasks = loadTasks()
  
  return tasks.filter(task => task.status === 'under_review')
}

/**
 * 审核通过任务
 * @param taskId 任务 ID
 */
export const approveTask = async (taskId: number): Promise<{ success: boolean; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  
  // 重新加载任务（确保获取最新数据）
  tasks = loadTasks()
  
  const task = tasks.find(t => t.id === taskId)
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
  
  // 如果任务有完成者，添加积分和交易记录
  if (task.claimerId) {
    try {
      // 计算实际奖励（考虑折扣）
      let points = task.reward // 任务奖励直接就是社区积分
      if (task.discount && task.discount > 0 && task.discount <= 100) {
        // 如果有打折，按比例计算：points = reward * (1 - discount / 100)
        points = task.reward * (1 - task.discount / 100)
      }
      
      // 获取完成者信息
      const member = await getMemberById(task.claimerId)
      if (member && member.communities.length > 0) {
        const communityId = member.communities[0] // 使用第一个社区
        const community = await getCommunityById(communityId)
        
        if (community) {
          // 更新用户积分
          await updateUserCommunityPoints(task.claimerId, communityId, points)
          
          // 创建交易记录
          const dateStr = new Date().toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          }).replace(/\//g, '-')
          
          // 获取积分缩写
          let currency = 'CP'
          if (community.pointName === '零废弃积分') {
            currency = 'ZWP'
          } else if (community.pointName === '南塘豆') {
            currency = 'NTD'
          }
          
          await addTransaction(task.claimerId, {
            id: 0, // 会在 addTransaction 中自动生成
            type: 'in',
            title: task.title,
            date: dateStr,
            amount: Math.round(points * 100) / 100, // 保留两位小数
            currency: currency,
            taskId: task.id,
            taskTitle: task.title
          })
        }
      }
    } catch (error) {
      console.error('Failed to add points and transaction:', error)
      // 即使积分添加失败，任务审核仍然成功
    }
  }
  
  // 持久化任务状态变化
  persistTasks()
  return { success: true, message: '任务审核通过！' }
}

/**
 * 驳回任务
 * @param taskId 任务 ID
 * @param reason 驳回理由
 * @param rejectOption 拒绝选项：'resubmit' 重新提交证明, 'reclaim' 重新发布任务, 'end' 结束任务
 */
export const rejectTask = async (taskId: number, reason: string, rejectOption: 'resubmit' | 'reclaim' | 'end' = 'end'): Promise<{ success: boolean; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  
  // 重新加载任务（确保获取最新数据）
  tasks = loadTasks()
  
  const task = tasks.find(t => t.id === taskId)
  if (!task) {
    return { success: false, message: '任务不存在' }
  }
  
  if (task.status !== 'under_review') {
    return { success: false, message: '任务状态不正确，无法驳回' }
  }
  
  const now = new Date().toISOString()
  task.rejectReason = reason
  task.proof = undefined
  task.updatedAt = now
  
  if (rejectOption === 'resubmit') {
    // 重新提交证明：状态回到进行中，保留领取者信息
    task.status = 'in_progress'
    task.submittedAt = undefined
    // 保留 claimerId, claimerName, claimedAt
  } else if (rejectOption === 'reclaim') {
    // 重新发布任务：只清除当前审核的领取者信息
    // 获取当前审核的领取者ID（用于后续可能的清理操作）
    const currentClaimerId = task.claimerId
    
    // 清除当前审核的领取者信息（只清除当前审核的这个领取者）
    task.claimerId = undefined
    task.claimerName = undefined
    task.claimedAt = undefined
    task.submittedAt = undefined
    task.proof = undefined
    
    // 判断任务类型：多人报名 vs 单人任务
    // 如果是多人报名的活动（participantLimit > 1），保留其他领取者信息，状态保持为进行中
    // 如果是单人任务（participantLimit === 1 或 null），清除所有信息，状态设为未领取
    if (task.participantLimit && task.participantLimit > 1) {
      // 多人报名任务：只清除当前审核的领取者信息
      // 其他领取者的信息保持不变（在其他地方存储，不在这里的task对象中）
      // 任务状态保持为进行中，让其他领取者可以继续
      task.status = 'in_progress'
      // 注意：由于当前Task数据结构只存储单个claimerId，其他领取者的信息可能在别处存储
      // 这里只清除当前审核的领取者信息，不影响其他领取者
    } else {
      // 单人任务：清除所有领取者信息，任务状态设为未领取
      task.status = 'unclaimed'
      task.isClaimed = false
      // 从claimedTaskIds中移除当前任务
      // 注意：如果是多人报名，claimedTaskIds应该按用户区分，这里只移除当前用户的任务
      const taskIndex = claimedTaskIds.indexOf(taskId)
      if (taskIndex > -1) {
        claimedTaskIds.splice(taskIndex, 1)
      }
    }
  } else {
    // 结束任务：状态设为已拒绝，任务结束
    task.status = 'rejected'
    const taskIndex = claimedTaskIds.indexOf(taskId)
    if (taskIndex > -1) {
      claimedTaskIds.splice(taskIndex, 1)
    }
    task.isClaimed = false
    task.claimerId = undefined
    task.claimerName = undefined
    task.claimedAt = undefined
    task.submittedAt = undefined
  }
  
  // 持久化任务状态变化
  persistTasks()
  
  let message = '任务已驳回！'
  if (rejectOption === 'resubmit') {
    message = '任务已退回，需要重新提交证明'
  } else if (rejectOption === 'reclaim') {
    message = '任务已重新发布，可以重新领取'
  }
  
  return { success: true, message }
}

/**
 * 打折审核任务
 * @param taskId 任务 ID
 * @param discount 打折百分数
 * @param reason 打折理由
 */
export const discountTask = async (taskId: number, discount: number, reason: string): Promise<{ success: boolean; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  
  // 重新加载任务（确保获取最新数据）
  tasks = loadTasks()
  
  const task = tasks.find(t => t.id === taskId)
  if (!task) {
    return { success: false, message: '任务不存在' }
  }
  
  task.status = 'completed'
  task.discount = discount
  task.discountReason = reason
  task.completedAt = new Date().toISOString()
  task.updatedAt = new Date().toISOString()
  
  // 如果任务有完成者，添加积分和交易记录
  if (task.claimerId) {
    try {
      // 计算实际奖励（考虑折扣）
      // 如果有打折，按比例计算：points = reward * (1 - discount / 100)
      const points = task.reward * (1 - discount / 100)
      
      // 获取完成者信息
      const member = await getMemberById(task.claimerId)
      if (member && member.communities.length > 0) {
        const communityId = member.communities[0] // 使用第一个社区
        const community = await getCommunityById(communityId)
        
        if (community) {
          // 更新用户积分
          await updateUserCommunityPoints(task.claimerId, communityId, points)
          
          // 创建交易记录
          const dateStr = new Date().toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          }).replace(/\//g, '-')
          
          // 获取积分缩写
          let currency = 'CP'
          if (community.pointName === '零废弃积分') {
            currency = 'ZWP'
          } else if (community.pointName === '南塘豆') {
            currency = 'NTD'
          }
          
          await addTransaction(task.claimerId, {
            id: 0, // 会在 addTransaction 中自动生成
            type: 'in',
            title: task.title,
            date: dateStr,
            amount: Math.round(points * 100) / 100, // 保留两位小数
            currency: currency,
            taskId: task.id,
            taskTitle: task.title
          })
        }
      }
    } catch (error) {
      console.error('Failed to add points and transaction:', error)
      // 即使积分添加失败，任务审核仍然成功
    }
  }
  
  // 持久化任务状态变化
  persistTasks()
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
