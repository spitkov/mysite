<template>
  <article class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <NuxtLink to="/blog" 
                class="inline-flex items-center text-white/60 hover:text-primary transition-colors mb-4">
        <svg class="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M14.78 14.78a.75.75 0 01-1.06 0L6.5 7.56v5.69a.75.75 0 01-1.5 0v-7.5A.75.75 0 015.75 5h7.5a.75.75 0 010 1.5H7.56l7.22 7.22a.75.75 0 010 1.06z" clip-rule="evenodd" />
        </svg>
        Back to Blog
      </NuxtLink>

      <h1 class="text-4xl font-bold mb-4">{{ post?.title || 'Loading...' }}</h1>
      
      <div v-if="post" class="flex items-center space-x-4 text-white/60 text-sm">
        <time :datetime="post.date">{{ formatDate(post.date) }}</time>
        <div class="flex items-center space-x-2">
          <span>•</span>
          <span>{{ post.readingTime }} min read</span>
        </div>
      </div>
    </div>

    <div class="prose prose-invert prose-lg max-w-none">
      <ContentDoc v-if="post" />
      <div v-else class="text-white/60">Loading...</div>
    </div>
  </article>
</template>

<script setup>
const route = useRoute()
const { data: post } = await useAsyncData('post', () => 
  queryContent('/blog')
    .where({ _path: route.path })
    .findOne()
)

function formatDate(date) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

if (!post.value) {
  throw createError({ statusCode: 404, message: 'Post not found' })
}
</script>

<style>
.prose {
  --tw-prose-body: theme('colors.white / 0.8');
  --tw-prose-headings: theme('colors.white');
  --tw-prose-links: theme('colors.primary');
  --tw-prose-bold: theme('colors.white');
  --tw-prose-counters: theme('colors.white / 0.6');
  --tw-prose-bullets: theme('colors.white / 0.6');
  --tw-prose-hr: theme('colors.white / 0.2');
  --tw-prose-quotes: theme('colors.white / 0.8');
  --tw-prose-quote-borders: theme('colors.primary / 0.2');
  --tw-prose-captions: theme('colors.white / 0.6');
  --tw-prose-code: theme('colors.white');
  --tw-prose-pre-code: theme('colors.white');
  --tw-prose-pre-bg: theme('colors.dark');
  --tw-prose-th-borders: theme('colors.white / 0.2');
  --tw-prose-td-borders: theme('colors.white / 0.2');
}
</style> 