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
const isMobile = ref(false)
const gridSize = computed(() => isMobile.value ? 75 : 50)
const maxDistance = computed(() => isMobile.value ? 100 : 150)
const baseDotSize = computed(() => isMobile.value ? 1 : 1.5)
const maxDotSize = computed(() => isMobile.value ? 2 : 3)
let animationFrameId = null
let isDrawing = false
let lastDrawTime = 0
const THROTTLE_MS = 1000 / 30 // Cap at 30fps on mobile

onMounted(() => {
  if (!canvas.value) return
  
  checkMobile()
  ctx = canvas.value.getContext('2d', { alpha: true })
  ctx.imageSmoothingEnabled = false
  
  initCanvas()
  draw()
  
  window.addEventListener('mousemove', handleMouseMove, { passive: true })
  window.addEventListener('touchmove', handleTouchMove, { passive: true })
  window.addEventListener('resize', handleResize, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('touchmove', handleTouchMove)
  window.removeEventListener('resize', handleResize)
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})

function checkMobile() {
  isMobile.value = window.innerWidth < 768
}

function initCanvas() {
  const dpr = isMobile.value ? 1 : (window.devicePixelRatio || 1)
  const rect = canvas.value.getBoundingClientRect()
  
  canvas.value.width = rect.width * dpr
  canvas.value.height = rect.height * dpr
  
  ctx.scale(dpr, dpr)
  canvas.value.style.width = rect.width + 'px'
  canvas.value.style.height = rect.height + 'px'
}

function handleResize() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  checkMobile()
  initCanvas()
  requestDraw()
}

function handleTouchMove(e) {
  if (e.touches && e.touches[0]) {
    mouseX = e.touches[0].clientX
    mouseY = e.touches[0].clientY
    requestDraw()
  }
}

function handleMouseMove(e) {
  mouseX = e.clientX
  mouseY = e.clientY
  requestDraw()
}

function requestDraw() {
  if (!isDrawing) {
    const now = Date.now()
    if (isMobile.value && now - lastDrawTime < THROTTLE_MS) {
      return
    }
    
    isDrawing = true
    animationFrameId = requestAnimationFrame(() => {
      draw()
      lastDrawTime = Date.now()
      isDrawing = false
    })
  }
}

function draw() {
  const width = canvas.value.width / (window.devicePixelRatio || 1)
  const height = canvas.value.height / (window.devicePixelRatio || 1)
  
  ctx.clearRect(0, 0, width, height)
  
  const numCols = Math.floor(width / gridSize.value)
  const numRows = Math.floor(height / gridSize.value)
  
  const offsetX = (width - (numCols * gridSize.value)) / 2
  const offsetY = (height - (numRows * gridSize.value)) / 2
  
  // Draw grid lines
  ctx.beginPath()
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)'
  ctx.lineWidth = 1
  
  // Only draw grid lines if not on mobile
  if (!isMobile.value) {
    for (let col = 0; col <= numCols; col++) {
      const x = Math.round(col * gridSize.value + offsetX) + 0.5
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
    }
    
    for (let row = 0; row <= numRows; row++) {
      const y = Math.round(row * gridSize.value + offsetY) + 0.5
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
    }
    
    ctx.stroke()
  }
  
  // Draw dots with optimized calculations
  const currentBaseDotSize = baseDotSize.value
  const currentMaxDotSize = maxDotSize.value
  const currentMaxDistance = maxDistance.value
  const sizeDiff = currentMaxDotSize - currentBaseDotSize
  
  for (let col = 0; col <= numCols; col++) {
    for (let row = 0; row <= numRows; row++) {
      const x = Math.round(col * gridSize.value + offsetX)
      const y = Math.round(row * gridSize.value + offsetY)
      
      const dx = x - mouseX
      const dy = y - mouseY
      const distance = Math.hypot(dx, dy)
      
      let size = currentBaseDotSize
      let opacity = 0.15
      
      if (distance < currentMaxDistance) {
        const scale = 1 - (distance / currentMaxDistance)
        size = currentBaseDotSize + sizeDiff * scale
        opacity = 0.15 + scale * 0.25
      }
      
      ctx.beginPath()
      ctx.fillStyle = 'rgba(255, 255, 255, ' + opacity + ')'
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