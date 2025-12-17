import { ref } from 'vue'

export interface GPSPosition {
  latitude: number
  longitude: number
  accuracy: number
  timestamp: string
}

export const useGeolocation = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const position = ref<GPSPosition | null>(null)

  /**
   * 获取当前GPS位置
   */
  const getCurrentLocation = (): Promise<GPSPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('您的浏览器不支持GPS定位'))
        return
      }

      loading.value = true
      error.value = null

      navigator.geolocation.getCurrentPosition(
        (geoPosition) => {
          const gpsData: GPSPosition = {
            latitude: geoPosition.coords.latitude,
            longitude: geoPosition.coords.longitude,
            accuracy: geoPosition.coords.accuracy || 0,
            timestamp: new Date().toISOString()
          }
          position.value = gpsData
          loading.value = false
          resolve(gpsData)
        },
        (err) => {
          let errorMessage = '获取GPS位置失败'
          switch (err.code) {
            case err.PERMISSION_DENIED:
              errorMessage = '用户拒绝了GPS定位请求'
              break
            case err.POSITION_UNAVAILABLE:
              errorMessage = 'GPS位置信息不可用'
              break
            case err.TIMEOUT:
              errorMessage = '获取GPS位置超时'
              break
          }
          error.value = errorMessage
          loading.value = false
          reject(new Error(errorMessage))
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
    })
  }

  /**
   * 验证GPS精度是否符合要求
   * @param accuracy 当前GPS精度（米）
   * @param requiredLevel 要求的精度级别：'high' | 'medium' | 'low'
   */
  const validateGPSAccuracy = (accuracy: number, requiredLevel: string): boolean => {
    const thresholds: Record<string, number> = {
      high: 10,    // 10米
      medium: 100, // 100米
      low: 1000    // 1000米
    }
    const threshold = thresholds[requiredLevel] || 100
    return accuracy <= threshold
  }

  return {
    loading,
    error,
    position,
    getCurrentLocation,
    validateGPSAccuracy
  }
}
