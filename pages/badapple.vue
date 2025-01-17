<template>
  <div class="space-y-6">
    <GridBackground />
    <div class="border border-white/10 rounded-lg p-4 md:p-6 bg-black relative z-10">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg md:text-xl">Bad Apple</h2>
        <NuxtLink to="/fun" class="text-white/60 hover:text-white transition-colors">← back</NuxtLink>
      </div>
      <div class="aspect-video w-full bg-black/50 rounded-lg border border-white/10">
        <video
          class="w-full h-full rounded-lg"
          controls
          autoplay
          loop
          src="https://t.3xx.pw/m/bad_apple.mp4"
        ></video>
      </div>
    </div>
  </div>
</template>

<script setup>
const videoContainer = ref(null)
const videoPlayer = ref(null)

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    videoPlayer.value.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}
</script> 