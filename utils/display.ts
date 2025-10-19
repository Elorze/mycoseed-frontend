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
