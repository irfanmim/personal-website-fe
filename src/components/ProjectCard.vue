<template>
  <div class="card" v-reveal>
    <div class="card-image">
      <img
        v-if="image"
        :src="image"
        :alt="title"
        class="card-img"
        @click="lightboxOpen = true"
      />
      <div v-else class="img-placeholder" />
    </div>
    <ImageLightbox v-if="image" v-model="lightboxOpen" :src="image" :alt="title" />
    <div class="card-body">
      <h4 class="card-title">{{ title }}</h4>
      <p class="card-desc">{{ description }}</p>
      <div class="card-footer">
        <div class="tags">
          <span class="tag" v-for="tag in tags" :key="tag">{{ tag }}</span>
        </div>
        <a
          v-if="demo"
          :href="demo"
          target="_blank"
          rel="noopener"
          class="demo-btn"
        >Live Demo →</a>
        <span v-else class="demo-soon">Live Demo Coming Soon</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ImageLightbox from './ImageLightbox.vue'

defineProps({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: { type: Array, default: () => [] },
  demo: { type: String, default: '' },
  image: { type: String, default: '' },
})

const lightboxOpen = ref(false)
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

.card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

[data-theme="dark"] .card:hover {
  box-shadow: 0 4px 20px rgba(255, 255, 255, 0.08);
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

.card-img {
  cursor: zoom-in;
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

.card-footer {
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-top: 4px;
  flex: 1;
  justify-content: flex-end;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
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

.demo-btn {
  align-self: center;
  margin-top: 16px;
  font-size: 0.78rem;
  font-weight: 500;
  color: #fff;
  text-decoration: none;
  background: var(--color-tag-text);
  border-radius: 8px;
  padding: 8px 20px;
  transition: opacity 0.15s;
}

.demo-btn:hover {
  opacity: 0.8;
}

.demo-soon {
  align-self: center;
  margin-top: 16px;
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--color-text-muted);
  background: var(--color-pill-bg);
  border-radius: 8px;
  padding: 8px 20px;
  border: 1px dashed var(--color-border);
  cursor: default;
}

@media (max-width: 540px) {
  .demo-btn,
  .demo-soon {
    align-self: stretch;
    text-align: center;
    padding: 10px 20px;
  }
}
</style>
