<template>
  <div class="h-screen overflow-hidden bg-black/95 text-white font-mono flex flex-col">
    <nav class="fixed top-0 w-full bg-black/90 backdrop-blur-sm border border-green-500/20 z-[100]">
      <div class="max-w-4xl mx-auto px-2 md:px-4">
        <div class="flex items-center justify-center h-10 md:h-12">
          <div class="flex items-center space-x-2 md:space-x-6 overflow-x-auto no-scrollbar text-sm">
            <NuxtLink to="/" class="nav-link whitespace-nowrap">~/home</NuxtLink>
            <NuxtLink to="/portfolio" class="nav-link whitespace-nowrap">~/portfolio</NuxtLink>
            <NuxtLink to="/tools" class="nav-link whitespace-nowrap">~/tools</NuxtLink>
            <NuxtLink to="/fun" class="nav-link whitespace-nowrap">~/fun</NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <main class="flex-1 flex flex-col items-center justify-center px-2 md:px-4 mt-10 md:mt-12 relative z-[2] overflow-hidden">
      <div class="w-full max-w-4xl">
        <NuxtPage />
      </div>
    </main>

    <footer class="w-full py-1 md:py-2 text-center text-white/50 text-xs md:text-sm border border-green-500/20 relative z-[2]">
      <div class="max-w-4xl mx-auto px-2 md:px-4">
        <p>© {{ new Date().getFullYear() }} spitkov :3</p>
      </div>
    </footer>

    <GridBackground class="z-[1]" />
    <KeyboardNav />
  </div>
</template>

<script setup>
import KeyboardNav from '~/components/KeyboardNav.vue'
import GridBackground from '~/components/GridBackground.vue'
</script>

<style>
body {
  background: black;
  overflow: hidden;
}

:root {
  --cursor-color: #ffffff;
}

::selection {
  background: rgba(74, 222, 128, 0.2);
  color: #ffffff;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.nav-link {
  position: relative;
  transition: all 0.3s ease;
  padding: 0.25rem 0.5rem;
  opacity: 0.7;
}

@media (min-width: 768px) {
  .nav-link {
    padding: 0.5rem;
  }
}

.nav-link::before {
  content: '';
  position: absolute;
  width: 0;
  height: 1px;
  bottom: -2px;
  left: 50%;
  background-color: #4ade80;
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.nav-link:hover {
  opacity: 1;
  color: #4ade80;
  text-shadow: 0 0 8px rgba(74, 222, 128, 0.3);
}

.nav-link:hover::before {
  width: 100%;
}

.router-link-active {
  color: #4ade80;
  opacity: 1;
}

.router-link-active::after {
  content: '_';
  position: absolute;
  animation: blink 1s infinite;
  color: #4ade80;
}

/* Add global card styles */
[class*="border"] {
  border-color: rgba(255, 255, 255, 0.1) !important;
  border-width: 1px !important;
  background: rgba(0, 0, 0, 0.95) !important;
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;
  position: relative !important;
}

[class*="bg-black"] {
  background-color: rgba(0, 0, 0, 0.95) !important;
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;
  position: relative !important;
}

/* Ensure nav is always on top */
nav {
  position: fixed;
  top: 0;
  z-index: 100 !important;
  background: rgba(0, 0, 0, 0.95) !important;
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;
}

/* Ensure footer is above background but below content */
footer {
  position: relative;
  z-index: 2 !important;
  background: rgba(0, 0, 0, 0.95) !important;
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;
}

/* Background should always be at the bottom */
.fixed {
  z-index: 1 !important;
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 