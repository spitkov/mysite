<template>
  <div>
    <div v-if="!data" class="text-white/50">
      Connecting to Discord...
    </div>

    <div v-else class="space-y-3">
      <!-- Status Indicator -->
      <div class="flex items-center space-x-2">
        <div class="relative">
          <div class="w-3 h-3 rounded-full" :class="statusColor"></div>
          <div class="absolute inset-0 w-3 h-3 rounded-full animate-ping opacity-75" :class="statusColor"></div>
        </div>
        <span class="text-sm text-white/70">{{ getStatusText }}</span>
      </div>

      <!-- Activities -->
      <div v-if="data.activities && data.activities.length > 0">
        <div v-for="activity in data.activities" :key="activity.name + activity.timestamps?.start" class="border border-white/10 rounded p-3 mt-2">
          <div class="flex items-center space-x-3">
            <img 
              :src="getActivityIcon(activity)" 
              class="w-12 h-12 rounded bg-white/5"
              loading="lazy"
              :alt="activity.name + ' icon'"
            />
            <div class="text-sm text-white/70">
              <p class="font-medium">{{ activity.name }}</p>
              <p v-if="activity.details" class="text-white/50">{{ activity.details }}</p>
              <p v-if="activity.state" class="text-white/50">{{ activity.state }}</p>
              <p v-if="activity.timestamps?.start" class="text-white/30 text-xs mt-1">
                {{ getElapsedTime(activity.timestamps.start) }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-white/50 text-sm italic">
        I'm currently not doing anything...
      </div>
    </div>
  </div>
</template>

<script setup>
const data = ref(null)
let previousData = null
const config = useRuntimeConfig()
const DISCORD_ID = 1092100801478004816
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

const getStatusText = computed(() => {
  if (!data.value?.discord_status) return 'Offline'
  switch (data.value.discord_status) {
    case 'online': return 'Online'
    case 'idle': return 'Idle'
    case 'dnd': return 'Do Not Disturb'
    default: return 'Offline'
  }
})

const getElapsedTime = (timestamp) => {
  const start = new Date(timestamp)
  const now = new Date()
  const elapsed = Math.floor((now - start) / 1000) // seconds

  if (elapsed < 60) return 'just now'
  if (elapsed < 3600) return `${Math.floor(elapsed / 60)}m elapsed`
  if (elapsed < 86400) return `${Math.floor(elapsed / 3600)}h ${Math.floor((elapsed % 3600) / 60)}m elapsed`
  return `${Math.floor(elapsed / 86400)}d ${Math.floor((elapsed % 86400) / 3600)}h elapsed`
}

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
