<template>
  <div class="space-y-6">
    <GridBackground />
    <div class="border border-white/10 rounded-lg p-4 md:p-6 bg-black relative z-10">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg md:text-xl">DOOM</h2>
        <NuxtLink to="/fun" class="text-white/60 hover:text-white transition-colors">← back</NuxtLink>
      </div>
      
      <div class="mockup-window bg-base-300 relative">
        <div class="flex justify-center px-4 py-16 bg-base-100 relative h-aspect">
          <div class="jsdos wh-full jsdos-rso" data-bg="https://dos.zone/images/containers/assets/backgrounds/doom_1.jpg/fe8f7f08ddbeced41a847eca0dcd5bbf.webp" data-url="https://cdn.dos.zone/custom/dos/doom.jsdos">
            <iframe 
              src="https://dos.zone/doom-dec-1993/"
              class="w-full h-full rounded-lg"
              style="aspect-ratio: 4/3;"
              frameborder="0"
              allowfullscreen
            ></iframe>
          </div>
        </div>
      </div>

      <div class="mt-4 text-sm text-white/50">
        <p>Controls:</p>
        <ul class="list-disc list-inside mt-2">
          <li>Arrow keys to move</li>
          <li>Ctrl to shoot</li>
          <li>Space to open doors</li>
          <li>Click the game window to enable controls</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.h-aspect {
  aspect-ratio: 4/3;
}
</style> 