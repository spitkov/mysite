<template>
  <div class="relative">
    <div class="flex items-center space-x-4 mb-2">
      <a href="https://github.com/spitkov" target="_blank" class="hover:text-green-400 transition-colors">
        <div class="flex items-center space-x-2">
          <IconGithub class="w-5 h-5" />
          <span>GitHub</span>
        </div>
      </a>
      <button @click="toggleStats" class="flex items-center space-x-1 text-white/70 hover:text-white transition-colors">
        <span class="text-sm">Stats</span>
        <IconChevron :class="['w-4 h-4 transition-transform', isExpanded ? 'rotate-180' : '']" />
      </button>
    </div>

    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform -translate-y-2 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-2 opacity-0"
    >
      <div v-if="isExpanded" class="stats-card">
        <div v-if="loading" class="flex justify-center py-4">
          <div class="animate-spin rounded-full h-6 w-6 border-2 border-green-500 border-t-transparent"></div>
        </div>
        
        <div v-else-if="error" class="text-red-400 text-sm py-2">
          {{ error }}
        </div>
        
        <div v-else class="grid grid-cols-2 gap-4 p-4">
          <div class="stat-item">
            <div class="text-white/70 text-sm">Repositories</div>
            <div class="text-xl font-bold">{{ stats.publicRepos }}</div>
          </div>
          <div class="stat-item">
            <div class="text-white/70 text-sm">Followers</div>
            <div class="text-xl font-bold">{{ stats.followers }}</div>
          </div>
          <div class="stat-item">
            <div class="text-white/70 text-sm">Following</div>
            <div class="text-xl font-bold">{{ stats.following }}</div>
          </div>
          <div class="stat-item">
            <div class="text-white/70 text-sm">Contributions</div>
            <div class="text-xl font-bold">{{ stats.contributions }}</div>
          </div>
          
          <div class="col-span-2">
            <div class="text-white/70 text-sm mb-2">Top Languages</div>
            <div class="grid grid-cols-2 gap-2">
              <div v-for="lang in stats.topLanguages" :key="lang.name" 
                   class="flex items-center space-x-2">
                <div class="w-2 h-2 rounded-full" :style="{ backgroundColor: lang.color }"></div>
                <span class="text-sm">{{ lang.name }}</span>
                <span class="text-xs text-white/50">{{ lang.percentage }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import IconGithub from './icons/IconGithub.vue'
import IconChevron from './icons/IconChevron.vue'

const isExpanded = ref(false)
const loading = ref(false)
const error = ref(null)
const stats = ref({
  publicRepos: 0,
  followers: 0,
  following: 0,
  contributions: 0,
  topLanguages: []
})

const toggleStats = async () => {
  isExpanded.value = !isExpanded.value
  if (isExpanded.value && !stats.value.publicRepos) {
    await fetchGithubStats()
  }
}

const fetchGithubStats = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await fetch('https://api.github.com/users/spitkov')
    const data = await response.json()
    
    if (response.ok) {
      stats.value = {
        publicRepos: data.public_repos,
        followers: data.followers,
        following: data.following,
        contributions: await fetchContributions(),
        topLanguages: await fetchTopLanguages()
      }
    } else {
      throw new Error(data.message)
    }
  } catch (err) {
    error.value = 'Failed to load GitHub stats'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const fetchContributions = async () => {
  // This would require a backend endpoint to fetch contributions
  // as GitHub's API doesn't provide this directly
  return 0 // Placeholder
}

const fetchTopLanguages = async () => {
  try {
    const response = await fetch('https://api.github.com/users/spitkov/repos')
    const repos = await response.json()
    
    const languages = {}
    await Promise.all(repos.map(async repo => {
      const langResponse = await fetch(repo.languages_url)
      const langData = await langResponse.json()
      
      Object.entries(langData).forEach(([lang, bytes]) => {
        languages[lang] = (languages[lang] || 0) + bytes
      })
    }))
    
    const total = Object.values(languages).reduce((a, b) => a + b, 0)
    return Object.entries(languages)
      .map(([name, bytes]) => ({
        name,
        percentage: Math.round((bytes / total) * 100),
        color: getLanguageColor(name)
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 4)
  } catch (err) {
    console.error(err)
    return []
  }
}

const getLanguageColor = (language) => {
  const colors = {
    JavaScript: '#f1e05a',
    TypeScript: '#2b7489',
    Python: '#3572A5',
    Vue: '#41b883',
    HTML: '#e34c26',
    CSS: '#563d7c',
    // Add more languages as needed
  }
  return colors[language] || '#8b949e'
}
</script>

<style scoped>
.stats-card {
  @apply bg-black/95 border border-green-500/20 rounded-lg overflow-hidden;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.stat-item {
  @apply flex flex-col space-y-1;
}
</style> 