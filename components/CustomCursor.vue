<template>
  <div>
    <div 
      ref="cursorDot"
      class="cursor-dot"
      :class="{ 'cursor-hover': isHovering }"
      :style="{ 
        transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`
      }"
    ></div>
    
    <div 
      ref="crosshair"
      class="crosshair-container"
      :class="{ 'cursor-hover': isHovering }"
      :style="{ 
        transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%) ${isHovering ? 'rotate(45deg)' : ''}`
      }"
    >
      <div class="crosshair-line top"></div>
      <div class="crosshair-line right"></div>
      <div class="crosshair-line bottom"></div>
      <div class="crosshair-line left"></div>
    </div>
  </div>
</template>

<script setup>
const position = ref({ x: 0, y: 0 })
const isHovering = ref(false)
let rafId = null

function updateCursor(e) {
  if (rafId) {
    cancelAnimationFrame(rafId)
  }
  
  rafId = requestAnimationFrame(() => {
    position.value = { 
      x: e.clientX,
      y: e.clientY
    }
  })
}

function checkHover(e) {
  const target = e.target
  isHovering.value = target.closest('a, button, .nav-link, [role="button"]') !== null
}

function setupEventListeners() {
  window.addEventListener('mousemove', updateCursor, { passive: true })
  document.addEventListener('mouseover', checkHover, { passive: true })
  document.addEventListener('mouseout', checkHover, { passive: true })
}

function removeEventListeners() {
  window.removeEventListener('mousemove', updateCursor)
  document.removeEventListener('mouseover', checkHover)
  document.removeEventListener('mouseout', checkHover)
}

// Watch for route changes
const route = useRoute()
watch(() => route.path, () => {
  // Remove and reattach event listeners
  removeEventListeners()
  nextTick(() => {
    setupEventListeners()
  })
})

onMounted(() => {
  setupEventListeners()
  document.body.classList.add('cursor-custom')
})

onUnmounted(() => {
  if (rafId) {
    cancelAnimationFrame(rafId)
  }
  removeEventListeners()
  document.body.classList.remove('cursor-custom')
})
</script>

<style scoped>
.cursor-dot {
  width: 4px;
  height: 4px;
  background-color: white;
  position: fixed;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  left: 0;
  top: 0;
  will-change: transform;
  transition: width 0.2s, height 0.2s, background-color 0.2s;
}

.cursor-dot.cursor-hover {
  width: 8px;
  height: 8px;
  background-color: #4ade80;
}

.crosshair-container {
  position: fixed;
  width: 24px;
  height: 24px;
  pointer-events: none;
  z-index: 9998;
  left: 0;
  top: 0;
  will-change: transform;
  transition: width 0.2s, height 0.2s;
}

.crosshair-container.cursor-hover {
  width: 32px;
  height: 32px;
}

.crosshair-line {
  position: absolute;
  background-color: white;
  transition: all 0.2s;
}

.crosshair-line.top,
.crosshair-line.bottom {
  width: 2px;
  height: 10px;
  left: 50%;
  transform: translateX(-50%);
}

.crosshair-line.left,
.crosshair-line.right {
  height: 2px;
  width: 10px;
  top: 50%;
  transform: translateY(-50%);
}

.cursor-hover .crosshair-line {
  background-color: #4ade80;
  box-shadow: 0 0 8px rgba(74, 222, 128, 0.5);
}

.cursor-hover .crosshair-line.top,
.cursor-hover .crosshair-line.bottom {
  height: 14px;
}

.cursor-hover .crosshair-line.left,
.cursor-hover .crosshair-line.right {
  width: 14px;
}

.crosshair-line.top {
  top: 0;
}

.crosshair-line.right {
  right: 0;
}

.crosshair-line.bottom {
  bottom: 0;
}

.crosshair-line.left {
  left: 0;
}
</style> 