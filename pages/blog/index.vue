<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-4xl font-bold mb-8">✍️ Blog</h1>

    <div v-if="posts" class="space-y-6">
      <article v-for="post in posts" :key="post._path" 
               class="bg-dark/50 backdrop-blur-sm rounded-lg p-6 hover:bg-dark/60 transition-colors">
        <NuxtLink :to="post._path" class="block">
          <h2 class="text-2xl font-bold mb-2 hover:text-primary transition-colors">
            {{ post.title }}
          </h2>
          <div class="flex items-center space-x-4 text-white/60 text-sm mb-4">
            <time :datetime="post.date">{{ formatDate(post.date) }}</time>
            <div v-if="post.readingTime" class="flex items-center space-x-2">
              <span>•</span>
              <span>{{ post.readingTime }} min read</span>
            </div>
          </div>
          <p class="text-white/80">{{ post.description }}</p>
        </NuxtLink>
      </article>

      <div v-if="posts.length === 0" class="text-center text-white/60 py-8">
        No blog posts yet. Check back soon!
      </div>
    </div>

    <div v-else class="text-center text-white/60 py-8">
      Loading posts...
    </div>
  </div>
</template>

<script setup>
const { data: posts } = await useAsyncData('posts', () => 
  queryContent('/blog')
    .sort({ date: -1 })
    .find()
)

function formatDate(date) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script> 