<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
html {
  scroll-behavior: smooth;
}

body {
  @apply bg-dark text-white font-sans;
}

::selection {
  @apply bg-primary/20 text-white;
}
</style>
