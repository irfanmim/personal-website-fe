<template>
  <div
    class="card"
    v-reveal
    @click="demo && openDemo(demo)"
    :class="{ 'card--clickable': demo }"
  >
    <div class="card-image">
      <img v-if="image" :src="image" :alt="title" />
      <div v-else class="img-placeholder" />
    </div>
    <div class="card-body">
      <h4 class="card-title">{{ title }}</h4>
      <p class="card-desc">{{ description }}</p>
      <div class="tags">
        <span class="tag" v-for="tag in tags" :key="tag">{{ tag }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: { type: Array, default: () => [] },
  demo: { type: String, default: '' },
  image: { type: String, default: '' },
})

function openDemo(url) {
  window.open(url, '_blank', 'noopener')
}
</script>

<style scoped>
.card {
  border: 1px solid var(--color-border);
  border-radius: 12px;
  overflow: hidden;
  background: var(--color-card-bg);
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.2s, transform 0.2s, background 0.2s, border-color 0.2s;
}

.card--clickable {
  cursor: pointer;
}

.card--clickable:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.card-image {
  width: 100%;
  height: 140px;
  overflow: hidden;
  flex-shrink: 0;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.img-placeholder {
  width: 100%;
  height: 100%;
  background: var(--color-pill-bg);
}

.card-body {
  padding: 16px 18px 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.card-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text);
}

.card-desc {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  line-height: 1.5;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 4px;
}

.tag {
  display: inline-flex;
  align-items: center;
  background: var(--color-tag-bg);
  color: var(--color-tag-text);
  font-size: 0.72rem;
  font-weight: 500;
  padding: 3px 10px;
  border-radius: 999px;
  white-space: nowrap;
}
</style>
