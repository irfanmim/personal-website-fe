<template>
  <div class="card">
    <h4 class="card-title">{{ title }}</h4>
    <p class="card-desc">{{ description }}</p>
    <div class="tags">
      <span class="tag" v-for="tag in tags" :key="tag">{{ tag }}</span>
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
  flex: 1;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  background: #dbeafe;
  color: #3b82f6;
  font-size: 0.8rem;
  padding: 4px 12px;
  border-radius: 999px;
}
</style>
