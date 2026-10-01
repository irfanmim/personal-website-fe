<template>
  <div
    class="card"
    :class="{ 'card--clickable': image }"
    :role="image ? 'button' : undefined"
    :tabindex="image ? 0 : undefined"
    :aria-label="image ? `View ${title} image` : undefined"
    @click="openImage"
    @keydown.enter.self="openImage"
  >
    <div v-if="image" class="card-image">
      <img :src="image" :alt="title" class="card-img" />
    </div>
    <ImageLightbox v-if="image" v-model="lightboxOpen" :src="image" :alt="title" />
    <div class="card-body">
      <h3 class="card-title">{{ title }}</h3>
      <span v-if="role" class="card-role">{{ role }}</span>
      <p class="card-desc">{{ description }}</p>
      <ul v-if="highlights && highlights.length" class="card-highlights">
        <li v-for="(item, idx) in highlights" :key="idx">{{ item }}</li>
      </ul>
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
          @click.stop
        >View live demo</a>
        <span
          v-else
          class="demo-soon"
          :class="{ 'demo-soon--hidden': !show_demo_soon }"
          :aria-hidden="!show_demo_soon ? 'true' : undefined"
        >Live demo coming soon</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ImageLightbox from './ImageLightbox.vue'

const props = defineProps({
  title: { type: String, required: true },
  description: { type: String, required: true },
  role: { type: String, default: '' },
  tags: { type: Array, default: () => [] },
  highlights: { type: Array, default: () => [] },
  demo: { type: String, default: '' },
  show_demo_soon: { type: Boolean, default: false },
  image: { type: String, default: '' },
})

const lightboxOpen = ref(false)

function openImage() {
  if (props.image) lightboxOpen.value = true
}
</script>

<style scoped>
.card {
  border: 1px solid var(--color-border);
  border-radius: 16px;
  overflow: hidden;
  background: var(--color-card-bg);
  display: flex;
  flex-direction: column;
  transition: border-color 0.2s ease;
}

.card:hover {
  border-color: color-mix(in srgb, var(--color-accent) 45%, transparent);
}

.card-image {
  width: 100%;
  height: 140px;
  overflow: hidden;
  flex-shrink: 0;
  border-bottom: 1px solid var(--color-border);
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card--clickable {
  cursor: zoom-in;
}

.card-body {
  padding: 18px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.card-title {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: var(--text-h3);
  color: var(--color-text);
}

.card-role {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-text-muted);
}

.card-desc {
  font-size: var(--text-body);
  color: var(--color-text-muted);
  line-height: 1.55;
  margin-top: 4px;
}

.card-highlights {
  margin: 0;
  padding-left: 16px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.card-highlights li {
  font-size: var(--text-sm);
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
  gap: 6px;
}

.tag {
  font-size: var(--text-xs);
  color: var(--color-text-dim);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 2px 8px;
}

.demo-btn {
  align-self: center;
  margin-top: 16px;
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-accent-ink);
  background: var(--color-accent);
  text-decoration: none;
  border-radius: 10px;
  padding: 7px 14px;
  transition: background 0.15s ease;
}

.demo-btn:hover {
  background: var(--color-accent-strong);
}

.demo-soon {
  align-self: center;
  margin-top: 16px;
  font-size: var(--text-xs);
  color: var(--color-text-faint);
}

.demo-soon--hidden {
  visibility: hidden;
}
</style>
