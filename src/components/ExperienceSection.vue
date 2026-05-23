<template>
  <section class="experience">
    <h3 class="section-title">Experience</h3>
    <div class="entries">
      <div class="entry" v-for="exp in experiences" :key="exp.role" v-reveal>
        <div class="role-label">{{ exp.role }}</div>
        <div class="company-list">
          <div class="company-item" v-for="c in exp.companies" :key="c.company + c.period">
            <div class="company-meta">
              <span class="company-name">{{ c.company }}</span>
              <span class="company-period">{{ c.period }}</span>
            </div>
            <p class="company-summary">{{ c.summary }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  experiences: {
    type: Array,
    required: true,
  },
})
</script>

<style scoped>
.experience {
  padding-bottom: 64px;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 500;
  margin-bottom: 32px;
}

.entries {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.entry {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.role-label {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--color-text);
}

.company-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-left: 24px;
  border-left: 2px solid var(--color-rail);
  margin-left: 4px;
}

.company-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.company-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
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

@media (min-width: 1024px) {
  .experience {
    padding-bottom: 80px;
  }

  .section-title {
    font-size: 1.4rem;
    margin-bottom: 40px;
  }
}
</style>
