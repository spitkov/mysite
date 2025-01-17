<template>
  <div>
    <div v-if="!data" class="text-white/50">
      Connecting to Discord...
    </div>

    <div v-else class="space-y-3">
      <!-- Activities -->
      <div v-for="activity in data.activities" :key="activity.name + activity.timestamps?.start" class="border border-white/10 rounded p-3">
        <div class="flex items-center space-x-3">
          <img 
            :src="getActivityIcon(activity)" 
            class="w-12 h-12 rounded bg-white/5"
            loading="lazy"
            alt="Activity icon"
          />
          <div class="text-sm text-white/70">
            <p>{{ activity.name }}</p>
            <p v-if="activity.details" class="text-white/50">{{ activity.details }}</p>
            <p v-if="activity.state" class="text-white/50">{{ activity.state }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const data = ref(null)
let previousData = null
const config = useRuntimeConfig()
const DISCORD_ID = config.public.discordId
let updateInterval

const statusColor = computed(() => {
  if (!data.value?.discord_status) return 'bg-white/20'
  switch (data.value.discord_status) {
    case 'online': return 'bg-[#43b581]'
    case 'idle': return 'bg-[#faa61a]'
    case 'dnd': return 'bg-[#f04747]'
    default: return 'bg-[#747f8d]'
  }
})

const getActivityIcon = (activity) => {
  if (activity.type === 2 && activity.id === 'spotify:1') {
    return activity.assets?.large_image?.startsWith('spotify:')
      ? 'https://i.scdn.co/image/' + activity.assets.large_image.slice(8)
      : activity.assets?.large_image
  }

  if (activity.assets?.large_image) {
    if (activity.assets.large_image.startsWith('mp:external')) {
      return activity.assets.large_image.replace(/mp:external\/.*\/https\//, 'https://')
    }
    return 'https://cdn.discordapp.com/app-assets/' + activity.application_id + '/' + activity.assets.large_image + '.png'
  }

  if (activity.assets?.small_image) {
    return 'https://cdn.discordapp.com/app-assets/' + activity.application_id + '/' + activity.assets.small_image + '.png'
  }

  return 'https://cdn.discordapp.com/app-icons/' + activity.application_id + '/favicon.png'
}

async function fetchDiscordStatus() {
  try {
    const response = await fetch('https://api.lanyard.rest/v1/users/' + DISCORD_ID)
    const result = await response.json()
    
    if (result.success && JSON.stringify(result.data) !== JSON.stringify(previousData)) {
      data.value = result.data
      previousData = result.data
    }
  } catch (error) {
    console.error('Error fetching Discord status:', error)
  }
}

onMounted(() => {
  fetchDiscordStatus()
  updateInterval = setInterval(fetchDiscordStatus, 5000) // Reduced from 1s to 5s
})

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval)
  }
})
</script> 