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
const gridSize = computed(() => isMobile.value ? 40 : 50)
const maxDistance = computed(() => isMobile.value ? 80 : 150)
const baseDotSize = computed(() => isMobile.value ? 0.8 : 1.5)
const maxDotSize = computed(() => isMobile.value ? 1.5 : 3)
let animationFrameId = null
let isDrawing = false
let lastDrawTime = 0
const THROTTLE_MS = 1000 / 30 // Cap at 30fps on mobile
let resizeObserver = null

onMounted(() => {
  if (!canvas.value) return
  
  checkMobile()
  ctx = canvas.value.getContext('2d', { alpha: true })
  ctx.imageSmoothingEnabled = false
  
  initCanvas()
  draw()
  
  // Create resize observer
  resizeObserver = new ResizeObserver(() => {
    handleResize()
  })
  resizeObserver.observe(canvas.value)
  
  window.addEventListener('mousemove', handleMouseMove, { passive: true })
  window.addEventListener('touchmove', handleTouchMove, { passive: true })
  window.addEventListener('resize', handleResize, { passive: true })
  window.addEventListener('orientationchange', handleResize, { passive: true })
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('touchmove', handleTouchMove)
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('orientationchange', handleResize)
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})

function checkMobile() {
  isMobile.value = window.innerWidth < 768
}

function initCanvas() {
  if (!canvas.value) return
  
  const rect = canvas.value.getBoundingClientRect()
  const dpr = window.devicePixelRatio || 1
  
  // Set canvas size in pixels
  canvas.value.width = rect.width * dpr
  canvas.value.height = rect.height * dpr
  
  // Set display size
  canvas.value.style.width = `${window.innerWidth}px`
  canvas.value.style.height = `${window.innerHeight}px`
  
  // Scale context
  ctx.scale(dpr, dpr)
}

function handleResize() {
  if (!canvas.value) return
  
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
  if (!canvas.value || !ctx) return
  
  const width = window.innerWidth
  const height = window.innerHeight
  
  ctx.clearRect(0, 0, width, height)
  
  const numCols = Math.floor(width / gridSize.value)
  const numRows = Math.floor(height / gridSize.value)
  
  const offsetX = (width - (numCols * gridSize.value)) / 2
  const offsetY = (height - (numRows * gridSize.value)) / 2
  
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