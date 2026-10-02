<template>
  <section class="about-contact">
    <div id="about" class="block block--about">
      <h2 class="section-title">About</h2>
      <p class="bio">
        <span v-if="lead" class="lead">{{ lead }}</span>{{ rest }}
      </p>
    </div>

    <div id="contact" class="block block--contact">
      <div>
        <h3 v-if="heading" class="contact-title">{{ heading }}</h3>
        <p v-if="blurb" class="tagline">{{ blurb }}</p>
      </div>
      <div class="links">
        <a v-if="linkedin" :href="linkedin" target="_blank" rel="noopener" class="link">LinkedIn</a>
        <a v-if="github" :href="github" target="_blank" rel="noopener" class="link">GitHub</a>
        <a v-if="instagram" :href="instagram" target="_blank" rel="noopener" class="link">Instagram</a>
      </div>
    </div>

    <p class="footer-note">© {{ year }} {{ name }}</p>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  bio: { type: String, default: '' },
  heading: { type: String, default: '' },
  blurb: { type: String, default: '' },
  name: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  github: { type: String, default: '' },
  instagram: { type: String, default: '' },
})

const year = new Date().getFullYear()

// The first sentence is set larger as a statement; the rest stays body text.
const parts = computed(() => {
  const match = props.bio.trim().match(/^(.+?[.!?])(?:\s+(.*))?$/s)
  return match ? { lead: match[1], rest: match[2] ? ` ${match[2]}` : '' } : { lead: '', rest: props.bio }
})
const lead = computed(() => parts.value.lead)
const rest = computed(() => parts.value.rest)
</script>

<style scoped>
/* Same vertical rhythm as the other sections: --pad above and below the
   content, and the same space either side of the hairline between About and
   Get in touch as between two separate sections. */
.about-contact {
  --pad: 80px;
  padding: var(--pad) 0;
  border-top: 1px solid var(--color-border);
}

/* Title on the left, content on the right (stacks on phones). */
.block {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

.block--contact {
  margin-top: var(--pad);
  padding-top: var(--pad);
  border-top: 1px solid var(--color-border);
  align-items: center;
}

.section-title {
  font-family: var(--font-display);
  font-weight: 600;
  letter-spacing: -0.01em;
  font-size: var(--text-h2);
  line-height: 1.15;
  color: var(--color-text);
}

.bio {
  font-size: var(--text-lead);
  color: var(--color-text-muted);
  line-height: 1.8;
  max-width: 74ch;
}

.lead {
  display: block;
  max-width: 36ch;
  margin-bottom: 20px;
  font-family: var(--font-display);
  font-size: var(--text-statement);
  font-weight: 500;
  line-height: 1.35;
  letter-spacing: -0.01em;
  color: var(--color-text);
}

.contact-title {
  margin-bottom: 4px;
  font-family: var(--font-display);
  font-size: var(--text-h3);
  font-weight: 600;
  color: var(--color-text);
}

.tagline {
  font-size: var(--text-lead);
  color: var(--color-text-muted);
}

.links {
  display: flex;
  flex-wrap: wrap;
  gap: 20px 28px;
}

.link {
  font-size: var(--text-body);
  color: var(--color-text);
  text-decoration: none;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 2px;
  transition: border-color 0.15s ease, color 0.15s ease;
}

.link:hover {
  border-color: var(--color-accent);
  color: var(--color-accent-strong);
}

.footer-note {
  margin-top: 56px;
  font-size: var(--text-xs);
  color: var(--color-text-footer);
}

@media (min-width: 900px) {
  .block {
    grid-template-columns: 1fr 2fr;
    gap: 64px;
  }
}

@media (min-width: 1024px) {
  .about-contact {
    --pad: 120px;
  }
}
</style>
