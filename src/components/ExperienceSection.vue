<template>
  <section class="experience">
    <h3 class="section-title">Experience</h3>
    <div class="entries">
      <div class="entry" v-for="exp in experiences" :key="exp.company + exp.role">
        <div class="entry-header">
          <div class="entry-left">
            <span class="entry-role">{{ exp.role }}</span>
            <span class="entry-company">{{ exp.company }}</span>
          </div>
          <span class="entry-period">{{ exp.period }}</span>
        </div>
        <p class="entry-summary">{{ exp.summary }}</p>
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
  
  margin-bottom: 24px;
}

.entries {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.entry {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.entry-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.entry-left {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.entry-role {
  font-size: 1rem;
  font-weight: 600;
}

.entry-company {
  font-size: 0.9rem;
  color: #555;
}

.entry-period {
  font-size: 0.85rem;
  color: #888;
}

.entry-summary {
  font-size: 0.95rem;
  color: #444;
  line-height: 1.6;
}

@media (min-width: 640px) {
  .entry-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }

  .entry-period {
    padding-top: 2px;
    white-space: nowrap;
  }
}

@media (min-width: 1024px) {
  .experience {
    padding-bottom: 80px;
  }

  .section-title {
    font-size: 1.4rem;
    margin-bottom: 32px;
  }
}
</style>
