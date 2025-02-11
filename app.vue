<template>
  <div>
    <NuxtLoadingIndicator color="#ffffff" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
useHead({
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com', crossorigin: '' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'preload', as: 'style', href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap', media: 'print', onload: "this.media='all'" }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})
</script>

<style>
html {
  scroll-behavior: smooth;
}

body {
  background: #000;
  color: #fff;
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  font-size: 16px;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

@media (max-width: 768px) {
  body {
    font-size: 14px;
  }
}

::selection {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

/* Optimize animations */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.15s ease-out, transform 0.15s ease-out;
  will-change: opacity, transform;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Reduce paint operations */
* {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transform-style: preserve-3d;
}

/* Optimize scrolling */
* {
  -webkit-overflow-scrolling: touch;
}

/* Reduce repaints */
.fixed, .absolute {
  transform: translateZ(0);
}
</style>
