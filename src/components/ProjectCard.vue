<template>
  <div class="card">
    <h4 class="card-title">{{ title }}</h4>
    <p class="card-desc">{{ description }}</p>
    <div class="tags">
      <span class="tag" v-for="tag in tags" :key="tag">{{ tag }}</span>
    </div>
    <div v-if="demo" class="card-links">
      <a :href="demo" target="_blank" rel="noopener" class="card-link">Live Demo</a>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tags: {
    type: Array,
    default: () => [],
  },
  demo: {
    type: String,
    default: '',
  },
})
</script>

<style scoped>
.card {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 28px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: #fff;
}

.card-title {
  font-size: 1.15rem;
  font-weight: 600;
}

.card-desc {
  font-size: 0.95rem;
  color: #444;
  line-height: 1.5;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-top: auto;
  padding-top: 4px;
}

.tag {
  display: inline-flex;
  align-items: center;
  background: #dbeafe;
  color: #3b82f6;
  font-size: 0.78rem;
  font-weight: 500;
  line-height: 1;
  padding: 5px 12px;
  border-radius: 999px;
  white-space: nowrap;
}

.card-links {
  display: flex;
  gap: 12px;
  margin-top: 4px;
}

.card-link {
  font-size: 0.85rem;
  color: #1a1a1a;
  text-decoration: none;
  border-bottom: 1px solid #1a1a1a;
  padding-bottom: 1px;
  transition: opacity 0.15s;
}

.card-link:hover {
  opacity: 0.5;
}
</style>
