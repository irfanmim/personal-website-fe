<template>
  <section class="experience">
    <h3 class="section-title">Experience</h3>
    <div class="entries">
      <div class="entry" v-for="exp in experiences" :key="exp.role" v-reveal>
        <div class="role-label">{{ exp.role }}</div>
        <div class="company-list">
          <div class="company-item" v-for="c in exp.companies" :key="c.company + c.period">
            <div class="company-meta">
              <span class="company-name">{{ c.summary }}</span>
              <span class="company-period">{{ c.period }}</span>
            </div>
            <p class="company-summary">{{ c.company }}</p>
          </div>
        </div>
      </div>
    </div>
    <p v-if="viewMoreUrl" class="more-hint">and more...</p>
    <div v-if="viewMoreUrl" class="view-more-wrap">
      <a :href="viewMoreUrl" class="view-more">View More →</a>
    </div>
  </section>
</template>

<script setup>
defineProps({
  experiences: {
    type: Array,
    required: true,
  },
  viewMoreUrl: {
    type: String,
    default: '',
  },
})
</script>

<style scoped>
.experience {
  padding-bottom: 56px;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 500;
  margin-bottom: 12px;
}

.entries {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.entry {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.role-label {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--color-text);
}

.company-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-left: 16px;
  border-left: 2px solid var(--color-rail);
  margin-left: 4px;
}

.company-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.company-meta {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.company-name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
}

.company-period {
  font-size: 0.82rem;
  color: var(--color-text-dim);
  letter-spacing: 0.02em;
}

.company-summary {
  font-size: 0.92rem;
  color: var(--color-text-muted);
  line-height: 1.65;
  max-width: 65ch;
}

@media (min-width: 640px) {
  .company-meta {
    flex-direction: row;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
  }

  .company-period {
    white-space: nowrap;
    flex-shrink: 0;
  }
}

.more-hint {
  font-size: 0.82rem;
  color: var(--color-text-dim);
  font-style: italic;
  margin: 12px 0 4px;
}

.view-more-wrap {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

.view-more {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-tag-text);
  text-decoration: none;
  border: 1.5px solid var(--color-tag-text);
  border-radius: 8px;
  padding: 8px 24px;
  transition: opacity 0.15s;
}

.view-more:hover {
  opacity: 0.7;
}

@media (min-width: 1024px) {
  .experience {
    padding-bottom: 72px;
  }

  .section-title {
    font-size: 1.4rem;
    margin-bottom: 20px;
  }
}
</style>
