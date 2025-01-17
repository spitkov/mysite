<template>
  <div class="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
    <div class="space-y-4 text-center">
      <div class="text-lg">loading {{ progress }}%<span class="loading-dots">...</span></div>
    </div>
  </div>
</template>

<script setup>
const progress = ref(0)

onMounted(() => {
  const progressInterval = setInterval(() => {
    if (progress.value < 100) {
      progress.value += Math.floor(Math.random() * 15 + 5)
      if (progress.value > 100) progress.value = 100
    }
  }, 200)

  setTimeout(() => {
    clearInterval(progressInterval)
  }, 2000)
})
</script>

<style scoped>
.loading-dots {
  display: inline-block;
  animation: dots 1.4s infinite;
}

@keyframes dots {
  0%, 20% { content: ''; }
  40% { content: '.'; }
  60% { content: '..'; }
  80%, 100% { content: '...'; }
}
</style> 