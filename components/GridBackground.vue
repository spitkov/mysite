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
const THROTTLE_MS = 1000 / 30 // Cap at 30fps
let resizeObserver = null

// Cache for performance
let currentWidth = 0
let currentHeight = 0
let numCols = 0
let numRows = 0
let offsetX = 0
let offsetY = 0

onMounted(() => {
  if (!canvas.value) return
  
  checkMobile()
  ctx = canvas.value.getContext('2d', { 
    alpha: true,
    desynchronized: true // Reduce latency
  })
  ctx.imageSmoothingEnabled = false
  
  initCanvas()
  updateGridDimensions()
  draw()
  
  // Create resize observer
  resizeObserver = new ResizeObserver(throttle(() => {
    handleResize()
  }, 100))
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

// Simple throttle function
function throttle(func, limit) {
  let inThrottle
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

function checkMobile() {
  isMobile.value = window.innerWidth < 768
}

function updateGridDimensions() {
  currentWidth = window.innerWidth
  currentHeight = window.innerHeight
  numCols = Math.floor(currentWidth / gridSize.value)
  numRows = Math.floor(currentHeight / gridSize.value)
  offsetX = (currentWidth - (numCols * gridSize.value)) / 2
  offsetY = (currentHeight - (numRows * gridSize.value)) / 2
}

function initCanvas() {
  if (!canvas.value) return
  
  const rect = canvas.value.getBoundingClientRect()
  const dpr = window.devicePixelRatio || 1
  
  canvas.value.width = rect.width * dpr
  canvas.value.height = rect.height * dpr
  
  canvas.value.style.width = `${rect.width}px`
  canvas.value.style.height = `${rect.height}px`
  
  ctx.scale(dpr, dpr)
}

const handleResize = throttle(() => {
  if (!canvas.value) return
  
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  
  checkMobile()
  initCanvas()
  updateGridDimensions()
  requestDraw()
}, 100)

const handleTouchMove = throttle((e) => {
  if (e.touches && e.touches[0]) {
    mouseX = e.touches[0].clientX
    mouseY = e.touches[0].clientY
    requestDraw()
  }
}, 50)

const handleMouseMove = throttle((e) => {
  mouseX = e.clientX
  mouseY = e.clientY
  requestDraw()
}, 16) // ~60fps

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
  
  ctx.clearRect(0, 0, currentWidth, currentHeight)
  
  const currentBaseDotSize = baseDotSize.value
  const currentMaxDotSize = maxDotSize.value
  const currentMaxDistance = maxDistance.value
  const sizeDiff = currentMaxDotSize - currentBaseDotSize
  
  for (let col = 0; col <= numCols; col++) {
    const x = Math.round(col * gridSize.value + offsetX)
    
    for (let row = 0; row <= numRows; row++) {
      const y = Math.round(row * gridSize.value + offsetY)
      
      const dx = x - mouseX
      const dy = y - mouseY
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance > currentMaxDistance) {
        // Draw static dot
        ctx.beginPath()
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'
        ctx.arc(x, y, currentBaseDotSize, 0, Math.PI * 2)
        ctx.fill()
        continue
      }
      
      // Draw interactive dot
      const scale = 1 - (distance / currentMaxDistance)
      const size = currentBaseDotSize + sizeDiff * scale
      const opacity = 0.15 + scale * 0.25
      
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