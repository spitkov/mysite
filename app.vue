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
    { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
    { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }
  ]
})
</script>

<style>
html {
  scroll-behavior: smooth;
}

body {
  background: #000;
  color: #fff;
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
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
}

.page-enter-active,
.page-leave-active {
  transition: all 0.15s ease-out;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
