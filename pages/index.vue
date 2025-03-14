<template>
  <div class="max-w-2xl mx-auto space-y-4 md:space-y-6 relative z-10">
    <div class="border border-white/5 rounded-lg p-4 md:p-6 bg-black/50 backdrop-blur-xl backdrop-saturate-150 relative">
      <div class="flex flex-col items-center text-center space-y-4 md:space-y-6">
        <div class="relative w-16 h-16 md:w-24 md:h-24">
          <img src="https://x.spitkov.hu/raw/aMSOMT.png" alt="Profile Picture" class="w-full h-full rounded-xl object-cover" />
        </div>
        
        <div class="space-y-4">
          <div class="font-bold text-xl">spitkov</div>
          <div class="space-y-2">
            <p class="text-white/90">full-stack dev - cybersec</p>
            <p class="text-white/90">Hungary</p>
            <div class="flex justify-center items-center space-x-4 text-white/70">
              <a href="mailto:hello@spitkov.hu" class="hover:text-white hover:underline transition-colors">email</a>
              <span>•</span>
              <div class="relative">
                <div class="flex items-center space-x-2">
                  <a href="https://github.com/spitkov" target="_blank" class="hover:text-white hover:underline transition-colors">github</a>
                  <button @click="toggleStats" ref="statsButton" class="flex items-center text-white/70 hover:text-white transition-colors">
                    <IconChevron :class="['w-4 h-4 transition-transform', isExpanded ? 'rotate-180' : '']" />
                  </button>
                </div>

                <Teleport to="body">
                  <div v-if="isExpanded" class="fixed inset-0" style="z-index: 999999998;" @click="isExpanded = false">
                    <div class="stats-card" :style="{ left: popupLeft + 'px', top: popupTop + 'px' }" style="z-index: 999999999;" @click.stop>
                      <div v-if="loading" class="flex justify-center py-4">
                        <div class="animate-spin rounded-full h-6 w-6 border-2 border-green-500 border-t-transparent"></div>
                      </div>
                      
                      <div v-else-if="error" class="text-red-400 text-sm py-2">
                        {{ error }}
                      </div>
                      
                      <div v-else class="grid grid-cols-2 gap-4 p-4">
                        <div class="stat-item">
                          <div class="text-white/70 text-sm">Repos</div>
                          <div class="text-lg font-bold">{{ stats.publicRepos }}</div>
                        </div>
                        <div class="stat-item">
                          <div class="text-white/70 text-sm">Followers</div>
                          <div class="text-lg font-bold">{{ stats.followers }}</div>
                        </div>
                        <div class="stat-item">
                          <div class="text-white/70 text-sm">Following</div>
                          <div class="text-lg font-bold">{{ stats.following }}</div>
                        </div>
                        <div class="stat-item">
                          <div class="text-white/70 text-sm">Contributions</div>
                          <div class="text-lg font-bold">{{ stats.contributions }}</div>
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
                  </div>
                </Teleport>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="border border-white/5 rounded-lg p-4 md:p-6 bg-black/50 backdrop-blur-xl backdrop-saturate-150 relative">
      <div class="font-bold text-xl mb-4">Discord Status</div>
      <DiscordStatus />
    </div>
  </div>
</template>

<script setup>
import IconChevron from '~/components/icons/IconChevron.vue'
import { ref, nextTick } from 'vue'
import { useRouter } from '#app'

const router = useRouter()
const isExpanded = ref(false)
const loading = ref(false)
const error = ref(null)
const statsButton = ref(null)
const popupLeft = ref(0)
const popupTop = ref(0)
const stats = ref({
  publicRepos: 0,
  followers: 0,
  following: 0,
  contributions: 0,
  topLanguages: []
})

const toggleStats = async () => {
  isExpanded.value = !isExpanded.value
  if (isExpanded.value) {
    if (!stats.value.publicRepos) {
      await fetchGithubStats()
    }
    // Calculate position after button click
    nextTick(() => {
      if (statsButton.value) {
        const rect = statsButton.value.getBoundingClientRect()
        popupLeft.value = rect.left - 150 // Center the 300px wide popup relative to button
        popupTop.value = rect.bottom + 8 // 8px gap below the button
      }
    })
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
        contributions: 0, // Removing contributions as it requires auth
        topLanguages: await fetchTopLanguages()
      }
    } else {
      if (data.message?.includes('API rate limit exceeded')) {
        throw new Error('GitHub API rate limit reached. Please try again later.')
      }
      throw new Error(data.message || 'Failed to fetch GitHub stats')
    }
  } catch (err) {
    error.value = err.message || 'Failed to load GitHub stats'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const fetchTopLanguages = async () => {
  try {
    const response = await fetch('https://api.github.com/users/spitkov/repos')
    const repos = await response.json()
    
    if (!response.ok) {
      if (repos.message?.includes('API rate limit exceeded')) {
        return []
      }
      throw new Error(repos.message)
    }
    
    const languages = {}
    await Promise.all(repos.map(async repo => {
      const langResponse = await fetch(repo.languages_url)
      const langData = await langResponse.json()
      
      if (!langResponse.ok) {
        if (langData.message?.includes('API rate limit exceeded')) {
          return
        }
        throw new Error(langData.message)
      }
      
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
    console.error('Failed to fetch languages:', err)
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
  }
  return colors[language] || '#8b949e'
}
</script>

<style scoped>
.stats-card {
  @apply fixed bg-black/95 border border-green-500/20 rounded-lg overflow-hidden w-[300px];
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.stat-item {
  @apply flex flex-col space-y-1;
}
</style> 
