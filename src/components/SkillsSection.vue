<template>
  <section class="skills">
    <h3 class="section-title">Skills</h3>
    <div class="groups">
      <div class="group" v-for="group in groups" :key="group.label">
        <span class="group-label">{{ group.label }}</span>
        <div class="pills">
          <span class="pill" v-for="skill in group.skills" :key="skill">{{ skill }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  groups: {
    type: Array,
    required: true,
  },
})
</script>

<style scoped>
.skills {
  padding-bottom: 48px;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 400;
  margin-bottom: 20px;
}

.groups {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.group-label {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-faint);
}

.pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.pill {
  background: var(--color-pill-bg);
  color: var(--color-pill-text);
  font-size: 0.875rem;
  padding: 5px 14px;
  border-radius: 999px;
  border: 1px solid var(--color-pill-border);
}

@media (min-width: 640px) {
  .groups {
    gap: 24px;
  }

  .group {
    flex-direction: row;
    align-items: flex-start;
    gap: 20px;
  }

  .group-label {
    min-width: 100px;
    padding-top: 6px;
  }
}

@media (min-width: 1024px) {
  .skills {
    padding-bottom: 60px;
  }

  .section-title {
    font-size: 1.3rem;
    margin-bottom: 28px;
  }
}
</style>
