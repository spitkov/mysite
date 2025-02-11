<template>
  <div>
    <Teleport to="body" v-if="showNumbers">
      <div v-for="(element, index) in clickableElements" :key="index" 
           class="shortcut-number" 
           :style="{ left: `${element.rect.left}px`, top: `${element.rect.top}px` }">
        {{ index + 1 }}
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const showNumbers = ref(false)
const clickableElements = ref([])

const updateClickableElements = () => {
  const elements = document.querySelectorAll('a, button, [role="button"], input[type="submit"]')
  clickableElements.value = Array.from(elements).map((el, index) => ({
    element: el,
    rect: el.getBoundingClientRect(),
    index: index + 1
  })).slice(0, 9) // Limit to 9 elements for single digit numbers
}

const handleKeyDown = (e) => {
  if (e.altKey && !showNumbers.value) {
    showNumbers.value = true
    updateClickableElements()
  }
  
  if (showNumbers.value && e.altKey && /^[1-9]$/.test(e.key)) {
    const index = parseInt(e.key) - 1
    if (clickableElements.value[index]) {
      e.preventDefault()
      clickableElements.value[index].element.click()
    }
  }
}

const handleKeyUp = (e) => {
  if (!e.altKey) {
    showNumbers.value = false
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)
})

onUnmounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)
})
</script>

<style scoped>
.shortcut-number {
  position: fixed;
  background: rgba(74, 222, 128, 0.9);
  color: black;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  pointer-events: none;
  z-index: 1000;
  transform: translate(-24px, -24px);
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translate(-24px, -24px) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translate(-24px, -24px) scale(1);
  }
}
</style> 