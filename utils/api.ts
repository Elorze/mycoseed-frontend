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
// API 基础配置
const config = useRuntimeConfig()
export const API_BASE_URL = config.public.apiUrl || 'http://localhost:3001'
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
  allowRepeatClaim?: boolean     // 是否允许重复领取
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
// 替换 getAllTasks 函数
export const getAllTasks = async (): Promise<Task[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tasks`)
    if (!response.ok) {
      throw new Error('获取任务列表失败')
    }
    const tasks = await response.json()
    return tasks.map((task: any) => ({
      id: task.id,
      activityId: task.activityId || 0,
      title: task.title,
      description: task.description,
      reward: task.reward,
      deadline: task.deadline,
      status: task.status,
      isClaimed: task.isClaimed || false,
      objective: task.description,
      creator: '系统'
    }))
  } catch (error) {
    console.error('加载任务失败:', error)
    return []
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
}

// 替换 createTask 函数
export const createTask = async (params: CreateTaskParams): Promise<Task> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || '创建任务失败')
    }

    const task = await response.json()
    return {
      id: task.id,
      activityId: task.activityId || 0,
      title: task.title,
      description: task.description,
      reward: task.reward,
      isClaimed: false,
      status: 'unclaimed',
      allowRepeatClaim: task.allowRepeatClaim || false
    }
  } catch (error) {
    console.error('创建任务失败:', error)
    throw error
  }
}

/**
 * 领取任务
 * @param taskId 任务 ID
 */
// 替换 claimTask 函数
export const claimTask = async (taskId: number): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}/claim`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, message: error.message || '领取任务失败' }
    }

    return await response.json()
  } catch (error) {
    console.error('领取任务失败:', error)
    return { success: false, message: '网络错误，请稍后重试' }
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
export const submitProof = async (taskId: number, proof: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}/submit`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ proof })
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, message: error.message || '提交凭证失败' }
    }

    return await response.json()
  } catch (error) {
    console.error('提交凭证失败:', error)
    return { success: false, message: '网络错误，请稍后重试' }
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

// Mock 社群数据
const mockCommunities: Community[] = [
  {
    id: 1,
    name: '高雅的即兴厨房',
    description: '分享美食创意，探索即兴烹饪的乐趣。在这里，每一道菜都是艺术品。',
    memberCount: 45,
    activityCount: 12,
    totalPoints: 12500,
    category: '美食',
    createdAt: '2024-01-15T00:00:00Z',
    markdownIntro: `# 高雅的即兴厨房

欢迎来到高雅的即兴厨房！我们是一个热爱美食和创意的社群。

## 我们的理念
- 即兴烹饪，发挥创意
- 分享美食，传递快乐
- 优雅生活，品味人生

## 活动类型
- 周末烹饪聚会
- 食谱分享会
- 食材交换活动
    `
  },
  {
    id: 2,
    name: '新华社区小菜园',
    description: '社区共享菜园，一起种植、收获、分享绿色生活。',
    memberCount: 68,
    activityCount: 18,
    totalPoints: 18900,
    category: '园艺',
    createdAt: '2024-02-01T00:00:00Z',
    markdownIntro: `# 新华社区小菜园

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
  },
  {
    id: 3,
    name: '大鱼小鱼群',
    description: '水族爱好者聚集地，分享养鱼经验，交流水族知识。',
    memberCount: 32,
    activityCount: 8,
    totalPoints: 8900,
    category: '宠物',
    createdAt: '2024-03-10T00:00:00Z',
    markdownIntro: `# 大鱼小鱼群

欢迎所有水族爱好者！

## 社群特色
- 专业的水族知识分享
- 鱼友互助交流
- 定期线下聚会

## 活动内容
- 水族箱设计分享
- 鱼类疾病防治讲座
- 鱼友见面会
    `
  },
  {
    id: 4,
    name: 'Stopshop社群',
    description: '倡导理性消费，分享购物心得，一起做聪明的消费者。',
    memberCount: 156,
    activityCount: 25,
    totalPoints: 34200,
    category: '消费',
    createdAt: '2024-01-20T00:00:00Z',
    markdownIntro: `# Stopshop社群

理性消费，智慧生活！

## 我们的使命
- 帮助大家理性消费
- 分享优质购物信息
- 建立消费互助网络

## 主要活动
- 购物心得分享
- 团购组织
- 消费避坑指南
    `
  },
  {
    id: 5,
    name: '野路子OFF运动社群',
    description: '户外运动爱好者，探索自然，挑战自我，享受运动的快乐。',
    memberCount: 89,
    activityCount: 22,
    totalPoints: 25600,
    category: '运动',
    createdAt: '2024-02-15T00:00:00Z',
    markdownIntro: `# 野路子OFF运动社群

走出舒适圈，探索户外世界！

## 运动类型
- 徒步登山
- 骑行活动
- 露营野餐
- 极限运动

## 活动频率
- 每周：城市周边徒步
- 每月：远足活动
- 每季度：大型户外挑战
    `
  },
  {
    id: 6,
    name: '玩具交换屋',
    description: '让闲置玩具重新找到主人，传递快乐，减少浪费。',
    memberCount: 124,
    activityCount: 15,
    totalPoints: 17800,
    category: '交换',
    createdAt: '2024-03-01T00:00:00Z',
    markdownIntro: `# 玩具交换屋

让每一件玩具都找到新主人！

## 交换规则
- 玩具需完好无损
- 交换前需拍照确认
- 支持以物易物或积分兑换

## 活动形式
- 定期玩具交换市集
- 线上交换平台
- 玩具捐赠活动
    `
  }
]

// Mock 成员数据（为每个社群创建成员）
const mockMembers: Member[] = [
  // 高雅的即兴厨房成员
  { id: 1, name: '张厨师', title: '主厨', reputation: 850, totalContributions: 25, completedTasks: 18, totalReward: 3.2, skills: ['烹饪', '创意料理', '美食摄影'], communities: [1], participationScore: 95, activityScore: 88, avatarSeed: 'chef1' },
  { id: 2, name: '李美食家', title: '美食评论家', reputation: 720, totalContributions: 18, completedTasks: 15, totalReward: 2.5, skills: ['美食评论', '品鉴'], communities: [1], participationScore: 85, activityScore: 82, avatarSeed: 'foodie1' },
  { id: 3, name: '王烘焙师', title: '烘焙达人', reputation: 680, totalContributions: 15, completedTasks: 12, totalReward: 2.0, skills: ['烘焙', '甜品制作'], communities: [1], participationScore: 78, activityScore: 75, avatarSeed: 'baker1' },
  { id: 4, name: '陈料理', title: '料理爱好者', reputation: 520, totalContributions: 10, completedTasks: 8, totalReward: 1.2, skills: ['家常菜', '营养搭配'], communities: [1], participationScore: 65, activityScore: 60, avatarSeed: 'cook1' },
  { id: 5, name: '刘小厨', title: '新手厨师', reputation: 380, totalContributions: 6, completedTasks: 5, totalReward: 0.8, skills: ['基础烹饪'], communities: [1], participationScore: 55, activityScore: 50, avatarSeed: 'chef2' },
  
  // 新华社区小菜园成员
  { id: 6, name: '赵园丁', title: '资深园丁', reputation: 920, totalContributions: 30, completedTasks: 22, totalReward: 4.0, skills: ['有机种植', '土壤管理', '病虫害防治'], communities: [2], participationScore: 98, activityScore: 95, avatarSeed: 'gardener1' },
  { id: 7, name: '钱农夫', title: '种植专家', reputation: 780, totalContributions: 22, completedTasks: 18, totalReward: 3.0, skills: ['蔬菜种植', '堆肥制作'], communities: [2], participationScore: 88, activityScore: 85, avatarSeed: 'farmer1' },
  { id: 8, name: '孙绿手指', title: '园艺爱好者', reputation: 650, totalContributions: 16, completedTasks: 13, totalReward: 2.2, skills: ['花卉种植', '园艺设计'], communities: [2], participationScore: 75, activityScore: 72, avatarSeed: 'green1' },
  { id: 9, name: '周菜农', title: '菜园管理员', reputation: 580, totalContributions: 12, completedTasks: 10, totalReward: 1.8, skills: ['菜园管理', '收获分享'], communities: [2], participationScore: 68, activityScore: 65, avatarSeed: 'veggie1' },
  { id: 10, name: '吴新手', title: '种植新手', reputation: 420, totalContributions: 8, completedTasks: 6, totalReward: 1.0, skills: ['基础种植'], communities: [2], participationScore: 58, activityScore: 55, avatarSeed: 'newbie1' },
  
  // 大鱼小鱼群成员
  { id: 11, name: '郑鱼友', title: '水族专家', reputation: 880, totalContributions: 28, completedTasks: 20, totalReward: 3.5, skills: ['水族箱设计', '鱼类繁殖', '水质管理'], communities: [3], participationScore: 92, activityScore: 90, avatarSeed: 'fish1' },
  { id: 12, name: '王水族', title: '资深鱼友', reputation: 720, totalContributions: 20, completedTasks: 16, totalReward: 2.8, skills: ['热带鱼养殖', '水草种植'], communities: [3], participationScore: 82, activityScore: 80, avatarSeed: 'aqua1' },
  { id: 13, name: '冯小鱼', title: '鱼友', reputation: 560, totalContributions: 14, completedTasks: 11, totalReward: 1.9, skills: ['基础养鱼', '鱼病防治'], communities: [3], participationScore: 70, activityScore: 68, avatarSeed: 'fish2' },
  { id: 14, name: '陈水族', title: '新手鱼友', reputation: 450, totalContributions: 9, completedTasks: 7, totalReward: 1.3, skills: ['入门养鱼'], communities: [3], participationScore: 60, activityScore: 58, avatarSeed: 'newfish1' },
  
  // Stopshop社群成员
  { id: 15, name: '韩购物', title: '购物达人', reputation: 950, totalContributions: 35, completedTasks: 28, totalReward: 5.0, skills: ['比价', '优惠信息', '团购组织'], communities: [4], participationScore: 100, activityScore: 98, avatarSeed: 'shop1' },
  { id: 16, name: '杨省钱', title: '省钱专家', reputation: 820, totalContributions: 26, completedTasks: 21, totalReward: 3.8, skills: ['优惠券', '折扣信息'], communities: [4], participationScore: 90, activityScore: 88, avatarSeed: 'save1' },
  { id: 17, name: '朱理性', title: '理性消费者', reputation: 680, totalContributions: 19, completedTasks: 15, totalReward: 2.6, skills: ['消费分析', '产品评测'], communities: [4], participationScore: 78, activityScore: 75, avatarSeed: 'rational1' },
  { id: 18, name: '秦购物', title: '购物爱好者', reputation: 580, totalContributions: 14, completedTasks: 11, totalReward: 2.0, skills: ['购物分享'], communities: [4], participationScore: 68, activityScore: 65, avatarSeed: 'shop2' },
  { id: 19, name: '尤新手', title: '新手买家', reputation: 420, totalContributions: 9, completedTasks: 7, totalReward: 1.2, skills: ['基础购物'], communities: [4], participationScore: 58, activityScore: 55, avatarSeed: 'buyer1' },
  
  // 野路子OFF运动社群成员
  { id: 20, name: '许登山', title: '登山领队', reputation: 980, totalContributions: 38, completedTasks: 30, totalReward: 5.5, skills: ['登山', '户外生存', '路线规划'], communities: [5], participationScore: 100, activityScore: 100, avatarSeed: 'hike1' },
  { id: 21, name: '何骑行', title: '骑行达人', reputation: 850, totalContributions: 28, completedTasks: 22, totalReward: 4.2, skills: ['长途骑行', '自行车维修'], communities: [5], participationScore: 95, activityScore: 92, avatarSeed: 'bike1' },
  { id: 22, name: '吕户外', title: '户外爱好者', reputation: 720, totalContributions: 22, completedTasks: 18, totalReward: 3.2, skills: ['露营', '徒步'], communities: [5], participationScore: 85, activityScore: 82, avatarSeed: 'outdoor1' },
  { id: 23, name: '施运动', title: '运动新手', reputation: 520, totalContributions: 12, completedTasks: 9, totalReward: 1.8, skills: ['基础运动'], communities: [5], participationScore: 65, activityScore: 62, avatarSeed: 'sport1' },
  
  // 玩具交换屋成员
  { id: 24, name: '张玩具', title: '玩具收藏家', reputation: 880, totalContributions: 32, completedTasks: 25, totalReward: 4.5, skills: ['玩具收藏', '玩具修复', '交换组织'], communities: [6], participationScore: 96, activityScore: 94, avatarSeed: 'toy1' },
  { id: 25, name: '孔交换', title: '交换达人', reputation: 750, totalContributions: 24, completedTasks: 19, totalReward: 3.5, skills: ['物品交换', '价值评估'], communities: [6], participationScore: 86, activityScore: 83, avatarSeed: 'swap1' },
  { id: 26, name: '曹玩具', title: '玩具爱好者', reputation: 620, totalContributions: 17, completedTasks: 13, totalReward: 2.3, skills: ['玩具分享', '交换'], communities: [6], participationScore: 72, activityScore: 70, avatarSeed: 'toy2' },
  { id: 27, name: '严新手', title: '交换新手', reputation: 480, totalContributions: 11, completedTasks: 8, totalReward: 1.5, skills: ['基础交换'], communities: [6], participationScore: 62, activityScore: 60, avatarSeed: 'newswap1' },
  
  // 跨社群成员（参与多个社群）
  { id: 28, name: '林多面手', title: '活跃成员', reputation: 1100, totalContributions: 45, completedTasks: 35, totalReward: 6.5, skills: ['多领域', '组织能力'], communities: [1, 2, 4], participationScore: 100, activityScore: 100, avatarSeed: 'multi1' },
  { id: 29, name: '黄社交', title: '社交达人', reputation: 920, totalContributions: 35, completedTasks: 28, totalReward: 5.0, skills: ['社交', '活动组织'], communities: [3, 5, 6], participationScore: 95, activityScore: 93, avatarSeed: 'social1' },
  { id: 30, name: '罗新手', title: '新成员', reputation: 350, totalContributions: 5, completedTasks: 4, totalReward: 0.6, skills: ['学习'], communities: [1, 6], participationScore: 50, activityScore: 48, avatarSeed: 'new1' }
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