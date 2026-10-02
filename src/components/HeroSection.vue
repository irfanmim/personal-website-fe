<template>
  <section class="hero">
    <div class="hero-grid">
      <div class="hero-text">
        <p class="greeting">{{ greeting }}</p>
        <h1 class="headline">{{ name }}</h1>
        <p class="role-line">Product-Minded Builder | Full-Stack | 7+ Years Building Scalable Products</p>

        <div class="actions">
          <a href="#projects" class="cta-primary" @click="scrollTo($event, 'projects')">View work</a>
          <a href="#contact" class="cta-ghost" @click="scrollTo($event, 'contact')">Get in touch</a>
        </div>
      </div>

      <div class="hero-viz">
        <SkillProfile />
      </div>
    </div>

    <a
      href="#projects"
      class="scroll-cue"
      aria-label="Scroll to projects"
      @click="scrollTo($event, 'projects')"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M6 9l6 6 6-6" />
      </svg>
    </a>
  </section>
</template>

<script setup>
import SkillProfile from './skill-profile/SkillProfile.vue'

defineProps({
  tagline: {
    type: String,
    default: '',
  },
})

function scrollTo(e, id) {
  e.preventDefault()
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

const greeting = 'Hi! Welcome!'
const name = "I'm Irfan"
</script>

<style scoped>
.hero {
  position: relative;
  isolation: isolate;
  padding: 24px 0 80px;
}

/* Soft ambient glow behind the hero only. */
.hero::before {
  content: '';
  position: absolute;
  inset: -40px 0 0;
  z-index: -1;
  pointer-events: none;
  background:
    radial-gradient(600px 340px at 78% 30%, color-mix(in srgb, var(--chart-engineering) 10%, transparent), transparent 60%),
    radial-gradient(520px 300px at 22% 75%, color-mix(in srgb, var(--chart-product) 10%, transparent), transparent 62%);
}

.hero-grid {
  display: grid;
  gap: 48px;
  align-items: center;
}

.hero-text > * {
  animation: rise 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.hero-text > :nth-child(2) { animation-delay: 0.08s; }
.hero-text > :nth-child(3) { animation-delay: 0.16s; }
.hero-text > :nth-child(4) { animation-delay: 0.24s; }

.greeting {
  font-family: var(--font-body);
  font-size: 1.9rem;
  font-weight: 500;
  color: var(--color-text-faint);
  margin-bottom: 10px;
}

.headline {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 2.75rem;
  line-height: 0.98;
  letter-spacing: -0.02em;
  color: var(--color-text);
}

.role-line {
  margin-top: 28px;
  font-size: var(--text-lead);
  color: var(--color-text-faint);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 40px;
}

.cta-primary,
.cta-ghost {
  display: inline-flex;
  align-items: center;
  font-size: var(--text-sm);
  font-weight: 500;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 12px;
  transition: filter 0.15s ease, background 0.15s ease;
}

.cta-primary {
  background: var(--gradient-depth);
  color: var(--color-accent-ink);
}

.cta-primary:hover {
  filter: brightness(1.06);
}

.cta-ghost {
  border: 1px solid var(--color-border-strong);
  color: var(--color-text);
}

.cta-ghost:hover {
  background: var(--color-panel-2);
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.scroll-cue {
  position: absolute;
  bottom: 28px;
  left: 50%;
  margin-left: -18px;
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  border: 1px solid var(--color-border-strong);
  color: var(--color-text-faint);
  text-decoration: none;
  animation: bob 2s ease-in-out infinite;
  transition: color 0.15s ease, border-color 0.15s ease;
}

.scroll-cue:hover {
  color: var(--color-text);
  border-color: var(--color-accent);
}

@keyframes bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(6px); }
}

@media (prefers-reduced-motion: reduce) {
  .hero-text > * {
    animation: none;
  }

  .scroll-cue {
    animation: none;
  }
}

@media (min-width: 640px) {
  .hero {
    padding: 40px 0 104px;
  }

  .greeting {
    font-size: 2.1rem;
  }

  .headline {
    font-size: 4rem;
  }

  .role-line {
    font-size: var(--text-lead);
  }
}

@media (min-width: 1024px) {
  .hero {
    padding: 56px 0 136px;
  }

  .hero-grid {
    grid-template-columns: 5fr 6fr;
    gap: 48px;
  }

  .headline {
    font-size: 5rem;
  }
}
</style>
