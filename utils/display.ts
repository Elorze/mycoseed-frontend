// Mock 显示工具函数
export const formatAddress = (address: string) => {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export const displayBalance = (balance: bigint, decimals = 4, tokenDecimals = 18) => {
  const divisor = BigInt(10 ** tokenDecimals)
  const integerPart = balance / divisor
  const fractionalPart = balance % divisor
  
  if (fractionalPart === 0n) {
    return integerPart.toString()
  }
  
  const fractionalStr = fractionalPart.toString().padStart(tokenDecimals, '0')
  const trimmedFractional = fractionalStr.slice(0, decimals).replace(/0+$/, '')
  
  if (trimmedFractional === '') {
    return integerPart.toString()
  }
  
  return `${integerPart}.${trimmedFractional}`
}

/**
 * 根据积分名称获取缩写
 */
export const getPointAbbr = (pointName: string | undefined): string => {
  if (!pointName) return 'PTS'
  if (pointName === '零废弃积分') return 'ZWP'
  if (pointName === '南塘豆') return 'NTD'
  return 'PTS'
}

/**
 * 根据任务获取对应的积分符号
 * @param task 任务对象
 * @param communities 社区列表（可选，如果不提供会从API获取）
 */
export const getTaskRewardSymbol = async (task: any, communities?: any[]): Promise<string> => {
  try {
    const { getMemberById, getCommunities } = await import('./api')
    
    // 获取任务创建者的信息
    const creator = await getMemberById(task.creatorId)
    if (!creator || !creator.communities || creator.communities.length === 0) {
      return '积分' // 默认显示"积分"
    }
    
    // 获取社区列表（如果未提供）
    let communityList = communities
    if (!communityList) {
      communityList = await getCommunities()
    }
    
    // 找到创建者所属的第一个社区
    const community = communityList.find(c => creator.communities.includes(c.id))
    if (community && community.pointName) {
      return getPointAbbr(community.pointName)
    }
    
    return '积分'
  } catch (error) {
    console.error('Failed to get task reward symbol:', error)
    return '积分'
  }
}
