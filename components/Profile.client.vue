<template>
    <div class="flex flex-col w-full max-w-2xl mx-auto min-h-[80vh] rounded-xl bg-white shadow-lg px-6 py-8">
        <!-- 顶部账户信息 -->
        <div class="w-full flex items-center justify-between mb-4">
            <AddressDisplay :address="mockAddress" />
            <ProfileSettings />
        </div>

        <!-- 资产总览 -->
        <div class="w-full flex items-center justify-between mb-2">
            <div>
                <div class="text-gray-400 text-sm">余额</div>
                <div class="flex items-center gap-2">
                    <span class="text-3xl font-bold">{{ displayBalance(mockBalance) }} ETH</span>
                </div>
            </div>
        </div>

        <!-- 操作按钮 -->
        <div class="w-full flex justify-center gap-18 my-4">
            <div class="flex flex-col items-center cursor-pointer" @click="navigateTo('/activities')">
                <div class="bg-yellow-50 rounded-full w-14 h-14 flex items-center justify-center mb-1">
                    <span class="text-orange-500 text-2xl">📝</span>
                </div>
                <span class="text-sm mt-1">活动</span>
            </div>
            <div class="flex flex-col items-center cursor-pointer" @click="navigateTo('/dao')">
                <div class="bg-purple-50 rounded-full w-14 h-14 flex items-center justify-center mb-1">
                    <span class="text-purple-500 text-2xl">🏛️</span>
                </div>
                <span class="text-sm mt-1">DAO</span>
            </div>
        </div>

        <!-- 分割线 -->
        <div class="w-full border-t border-muted my-4"></div>

         <!-- 加载动画 -->
         <div class="flex flex-col gap-4 mt-4" v-if="loading">
            <div class="w-full h-10 rounded-lg loading-bg"></div>
            <div class="w-80 h-10 rounded-lg loading-bg"></div>
            <div class="w-full h-10 rounded-lg loading-bg"></div>
            <div class="w-80 h-10 rounded-lg loading-bg"></div>
        </div>

        <!-- 资产列表 -->
        <div class="flex flex-col flex-1 overflow-y-auto">
            <!-- 主链资产 -->
            <div class="w-full flex items-center justify-between mb-4 hover:bg-gray-50 rounded-lg py-3 px-4 cursor-pointer transition-colors">
                <div class="flex items-center gap-3">
                    <img :src="'/images/eth_logo.png'" class="w-10 h-10 rounded-full" alt="eth" />
                    <div>
                        <div class="font-medium">ETH</div>
                        <div class="text-gray-400 text-sm">OP Mainnet</div>
                    </div>
                </div>
                <div class="flex flex-col items-end">
                    <span class="font-medium">{{ displayBalance(mockBalance) }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
// Mock 数据 - 默认钱包地址
const mockAddress = '0x4fc3...b0d1'
const mockBalance = BigInt('8600000000000000') // 0.0086 ETH

// 格式化余额显示
const displayBalance = (balance) => {
  return (Number(balance) / 1e18).toFixed(4)
}
</script>
