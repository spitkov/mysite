<template>
  <div class="fixed inset-0 pointer-events-none -z-10">
    <div class="absolute inset-0 grid-pattern"></div>
  </div>
</template>

<style scoped>
.grid-pattern {
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    radial-gradient(circle at center, rgba(255, 255, 255, 0.15) 2px, transparent 2px);
  background-size: 40px 40px, 40px 40px, 40px 40px;
  background-position: center;
  mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.3) 100%);
  -webkit-mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.3) 100%);
}
</style> 