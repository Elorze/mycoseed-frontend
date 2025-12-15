<template>
  <div ref="container" class="w-full h-full relative bg-mario-sky overflow-hidden">
    <svg ref="svgRef" class="w-full h-full block"></svg>
    
    <!-- Loading State -->
    <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div class="font-pixel text-white text-xl animate-pulse">LOADING WORLD...</div>
    </div>

    <!-- Tooltip Overlay -->
    <div 
      v-if="hoveredNode"
      class="absolute pointer-events-none z-10 pixel-tooltip"
      :style="{ left: tooltipX + 'px', top: tooltipY + 'px' }"
    >
      <div class="bg-white border-2 border-black p-2 shadow-pixel flex flex-col gap-1">
        <div class="font-pixel text-xs uppercase text-mario-red">{{ hoveredNode.type === 'COMMUNITY' ? '社群' : '用户' }}</div>
        <div class="font-vt323 text-lg leading-none">{{ hoveredNode.name }}</div>
        <div class="flex items-center gap-1 text-xs text-gray-500">
          <div class="w-2 h-2 bg-mario-coin rounded-full"></div>
          {{ hoveredNode.value }} 权重
        </div>
        <div v-if="hoveredNode.participationScore" class="text-xs text-blue-600">
          参与度: {{ Math.round(hoveredNode.participationScore) }}%
        </div>
        <div v-if="hoveredNode.activityScore" class="text-xs text-green-600">
          活跃度: {{ Math.round(hoveredNode.activityScore) }}%
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted, watch } from 'vue'
import * as d3 from 'd3'
import { useApi } from '~/composables/useApi'

const container = ref<HTMLElement | null>(null)
const svgRef = ref<SVGElement | null>(null)
const loading = ref(true)
const hoveredNode = ref<any>(null)
const tooltipX = ref(0)
const tooltipY = ref(0)

const emit = defineEmits(['nodeClick'])
const { getNetworkData } = useApi()

// 从 API 获取网络数据
const initialData = ref({
  nodes: [] as any[],
  links: [] as any[]
})

let simulation: d3.Simulation<d3.SimulationNodeDatum, undefined> | null = null

onMounted(async () => {
  if (!container.value || !svgRef.value) return
  
  // 从 API 获取网络数据
  try {
    const networkData = await getNetworkData()
    initialData.value = networkData
    initGraph(initialData.value)
  } catch (error) {
    console.error('Failed to load network data:', error)
    // 使用空数据
    initGraph({ nodes: [], links: [] })
  }
  
  loading.value = false
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (simulation) simulation.stop()
  window.removeEventListener('resize', handleResize)
})

const handleResize = () => {
  if (!simulation || !container.value) return
  const { width, height } = container.value.getBoundingClientRect()
  simulation.force('center', d3.forceCenter(width / 2, height / 2))
  simulation.alpha(0.3).restart()
}

const initGraph = (data: any) => {
  const width = container.value?.clientWidth || 800
  const height = container.value?.clientHeight || 600

  const svg = d3.select(svgRef.value)
  svg.selectAll('*').remove()

  // 1. Define Arrowhead Marker
  svg.append("defs").append("marker")
    .attr("id", "arrow")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 20) // Adjust based on node radius
    .attr("refY", 0)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M0,-5L10,0L0,5")
    .attr("fill", "#000")

  // 2. Simulation Setup
  // 根据节点的参与度和活跃度调整距离和电荷强度
  const getNodeStrength = (node: any) => {
    if (node.type === 'COMMUNITY') {
      // 社群节点：根据价值调整电荷强度
      return -500 - (node.value || 0) * 0.5
    } else {
      // 用户节点：根据参与度和活跃度调整
      const score = (node.participationScore || 0) + (node.activityScore || 0)
      return -200 - score * 2
    }
  }
  
  const getLinkDistance = (link: any) => {
    // 根据连接权重调整距离，权重越大距离越近
    const baseDistance = 120
    const weightFactor = link.weight || 1
    return baseDistance / (1 + weightFactor * 0.1)
  }
  
  simulation = d3.forceSimulation(data.nodes)
    .force("link", d3.forceLink(data.links)
      .id((d: any) => d.id)
      .distance(getLinkDistance))
    .force("charge", d3.forceManyBody().strength(getNodeStrength))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collide", d3.forceCollide().radius((d: any) => {
      // 根据节点类型和活跃度调整碰撞半径
      if (d.type === 'COMMUNITY') return 40
      const score = (d.participationScore || 0) + (d.activityScore || 0)
      return 20 + score * 0.1
    }))

  // 3. Draw Links (Vines)
  // 根据权重调整线条粗细和透明度
  const link = svg.append("g")
    .selectAll("line")
    .data(data.links)
    .join("line")
    .attr("stroke", "#00cc00") // Green vines
    .attr("stroke-width", (d: any) => {
      // 根据权重调整线条粗细，权重越大线条越粗
      const weight = d.weight || 1
      return Math.max(1, Math.min(6, weight * 0.8))
    })
    .attr("stroke-opacity", (d: any) => {
      // 根据权重调整透明度
      const weight = d.weight || 1
      return Math.min(1, 0.4 + weight * 0.1)
    })
    .attr("stroke-dasharray", "4,2") // Pixelated vine look
    .style("image-rendering", "pixelated")

  // 4. Draw Nodes
  const node = svg.append("g")
    .selectAll("g")
    .data(data.nodes)
    .join("g")
    .attr("cursor", "pointer")
    .call(drag(simulation) as any)
    .on("mouseover", (event, d) => {
      hoveredNode.value = d
      updateTooltipPosition(event)
      d3.select(event.currentTarget).select("rect").attr("stroke", "#ffcc00").attr("stroke-width", 4)
    })
    .on("mousemove", (event) => {
      updateTooltipPosition(event)
    })
    .on("mouseout", (event) => {
      hoveredNode.value = null
      d3.select(event.currentTarget).select("rect").attr("stroke", "#000").attr("stroke-width", 2)
    })
    .on("click", (event, d) => {
      emit('nodeClick', d)
    })

  // Draw Node Shape (Square for pixel art feel)
  // 根据参与度和活跃度调整节点大小
  node.append("rect")
    .attr("width", (d: any) => {
      if (d.type === 'COMMUNITY') {
        // 社群节点：根据价值调整大小
        const size = 30 + (d.value || 0) / 100
        return Math.min(60, Math.max(30, size))
      } else {
        // 用户节点：根据参与度和活跃度调整大小
        const score = (d.participationScore || 0) + (d.activityScore || 0)
        const size = 15 + score * 0.15
        return Math.min(30, Math.max(15, size))
      }
    })
    .attr("height", (d: any) => {
      if (d.type === 'COMMUNITY') {
        const size = 30 + (d.value || 0) / 100
        return Math.min(60, Math.max(30, size))
      } else {
        const score = (d.participationScore || 0) + (d.activityScore || 0)
        const size = 15 + score * 0.15
        return Math.min(30, Math.max(15, size))
      }
    })
    .attr("x", (d: any) => {
      const width = d.type === 'COMMUNITY' 
        ? Math.min(60, Math.max(30, 30 + (d.value || 0) / 100))
        : Math.min(30, Math.max(15, 15 + ((d.participationScore || 0) + (d.activityScore || 0)) * 0.15))
      return -width / 2
    })
    .attr("y", (d: any) => {
      const height = d.type === 'COMMUNITY' 
        ? Math.min(60, Math.max(30, 30 + (d.value || 0) / 100))
        : Math.min(30, Math.max(15, 15 + ((d.participationScore || 0) + (d.activityScore || 0)) * 0.15))
      return -height / 2
    })
    .attr("fill", (d: any) => {
      if (d.type === 'COMMUNITY') {
        return '#ff3844' // Red house
      } else {
        // 用户节点：根据活跃度调整颜色亮度
        const activityScore = d.activityScore || 0
        if (activityScore >= 90) return '#fff' // 高活跃度：白色
        if (activityScore >= 70) return '#f0f0f0' // 中高活跃度：浅灰
        if (activityScore >= 50) return '#e0e0e0' // 中等活跃度：灰色
        return '#d0d0d0' // 低活跃度：深灰
      }
    })
    .attr("stroke", "#000")
    .attr("stroke-width", (d: any) => {
      // 根据活跃度调整边框粗细
      if (d.type === 'COMMUNITY') return 3
      const activityScore = d.activityScore || 0
      return activityScore >= 80 ? 3 : 2
    })
    
  // Add Icon/Emoji inside
  node.append("text")
    .text((d: any) => d.type === 'COMMUNITY' ? '🏰' : '🍄')
    .attr("text-anchor", "middle")
    .attr("dy", ".35em")
    .attr("font-size", (d: any) => {
      if (d.type === 'COMMUNITY') {
        const size = 20 + (d.value || 0) / 200
        return Math.min(32, Math.max(20, size))
      } else {
        const score = (d.participationScore || 0) + (d.activityScore || 0)
        const size = 10 + score * 0.08
        return Math.min(18, Math.max(10, size))
      }
    })
    .style("pointer-events", "none")

  // 5. Tick Function
  simulation.on("tick", () => {
    link
      .attr("x1", (d: any) => d.source.x)
      .attr("y1", (d: any) => d.source.y)
      .attr("x2", (d: any) => d.target.x)
      .attr("y2", (d: any) => d.target.y)

    node
      .attr("transform", (d: any) => `translate(${d.x},${d.y})`)
  })
}

const updateTooltipPosition = (event: MouseEvent) => {
  // Offset tooltip slightly
  tooltipX.value = event.offsetX + 15
  tooltipY.value = event.offsetY + 15
}

// Drag behavior
const drag = (simulation: any) => {
  function dragstarted(event: any) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }
  
  function dragged(event: any) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }
  
  function dragended(event: any) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }
  
  return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
}
</script>

