<template>
  <div class="space-y-6">
    <GridBackground />
    <div class="border border-white/10 rounded-lg p-4 md:p-6 bg-black relative z-10">
      <h2 class="text-lg md:text-xl mb-4">Entertainment</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="border border-white/10 rounded-lg p-4 bg-black relative z-10">
          <NuxtLink to="/doom" class="block">
            <h3 class="text-base mb-2">DOOM</h3>
            <p class="text-sm text-white/50">Play the classic DOOM in your browser</p>
          </NuxtLink>
        </div>
        <div class="border border-white/10 rounded-lg p-4 bg-black relative z-10">
          <NuxtLink to="/badapple" class="block">
            <h3 class="text-base mb-2">Bad Apple</h3>
            <p class="text-sm text-white/50">Watch the iconic Bad Apple animation</p>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template> 