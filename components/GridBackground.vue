<template>
  <div class="fixed inset-0 pointer-events-none" style="z-index: 0;">
    <canvas ref="canvas" class="w-full h-full"></canvas>
  </div>
</template>

<script setup>
const canvas = ref(null)
let ctx
let mouseX = 0
let mouseY = 0
const gridSize = 50
const maxDistance = 150
const baseDotSize = 2
const maxDotSize = 4

onMounted(() => {
  if (!canvas.value) return
  
  ctx = canvas.value.getContext('2d')
  initCanvas()
  draw()
  
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('resize', handleResize)
})

function initCanvas() {
  canvas.value.width = window.innerWidth
  canvas.value.height = window.innerHeight
}

function handleResize() {
  initCanvas()
  draw()
}

function handleMouseMove(e) {
  mouseX = e.clientX
  mouseY = e.clientY
  draw()
}

function draw() {
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
  
  // Calculate grid dimensions
  const numCols = Math.floor(canvas.value.width / gridSize)
  const numRows = Math.floor(canvas.value.height / gridSize)
  
  // Calculate offset to center the grid
  const offsetX = (canvas.value.width - (numCols * gridSize)) / 2
  const offsetY = (canvas.value.height - (numRows * gridSize)) / 2
  
  // First draw grid lines
  ctx.beginPath()
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
  ctx.lineWidth = 1
  
  // Draw vertical lines
  for (let col = 0; col <= numCols; col++) {
    const x = Math.round(col * gridSize + offsetX) + 0.5
    ctx.moveTo(x, 0)
    ctx.lineTo(x, canvas.value.height)
  }
  
  // Draw horizontal lines
  for (let row = 0; row <= numRows; row++) {
    const y = Math.round(row * gridSize + offsetY) + 0.5
    ctx.moveTo(0, y)
    ctx.lineTo(canvas.value.width, y)
  }
  
  ctx.stroke()
  
  // Then draw dots at intersections
  for (let col = 0; col <= numCols; col++) {
    for (let row = 0; row <= numRows; row++) {
      const x = Math.round(col * gridSize + offsetX)
      const y = Math.round(row * gridSize + offsetY)
      
      const distance = Math.sqrt(
        Math.pow(x - mouseX, 2) + Math.pow(y - mouseY, 2)
      )
      
      let size = baseDotSize
      let opacity = 0.3
      
      if (distance < maxDistance) {
        const scale = 1 - (distance / maxDistance)
        size = baseDotSize + (maxDotSize - baseDotSize) * scale
        opacity = 0.3 + scale * 0.4
      }
      
      ctx.beginPath()
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fill()
    }
  }
}
</script>

<style scoped>
.bg-grid {
  background-size: 50px 50px;
  background-image: 
    linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-position: 50% 50%;
  mix-blend-mode: overlay;
}
</style>