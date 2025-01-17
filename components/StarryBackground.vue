<template>
  <canvas ref="canvas" class="w-full h-full"></canvas>
</template>

<script setup>
const canvas = ref(null)
let ctx
let stars = []
let animationFrame

onMounted(() => {
  if (!canvas.value) return
  
  ctx = canvas.value.getContext('2d')
  initCanvas()
  createStars()
  animate()

  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
})

function initCanvas() {
  canvas.value.width = window.innerWidth
  canvas.value.height = window.innerHeight
}

function handleResize() {
  initCanvas()
  createStars()
}

function createStars() {
  stars = []
  const numStars = Math.floor((canvas.value.width * canvas.value.height) / 2000)
  
  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: Math.random() * canvas.value.width,
      y: Math.random() * canvas.value.height,
      size: Math.random() * 2,
      opacity: Math.random(),
      speed: 0.1 + Math.random() * 0.3
    })
  }
}

function animate() {
  ctx.fillStyle = '#0d0d0d'
  ctx.fillRect(0, 0, canvas.value.width, canvas.value.height)

  stars.forEach(star => {
    ctx.beginPath()
    ctx.fillStyle = 'rgba(255, 255, 255, ' + star.opacity + ')'
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
    ctx.fill()

    star.opacity = Math.sin(Date.now() * star.speed * 0.001) * 0.5 + 0.5
  })

  animationFrame = requestAnimationFrame(animate)
}
</script> 