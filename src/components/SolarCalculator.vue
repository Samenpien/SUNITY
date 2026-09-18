<script setup>
import { computed, ref } from 'vue'
// Assumptions preserved from the published calculator; not a production forecast.
const panels = ref(12)
const watts = ref(550)
const tariff = 4.32
const power = computed(() => (panels.value * watts.value) / 1000)
const generation = computed(() => power.value * 8 * 365)
const savings = computed(() => generation.value * tariff)
const format = (value) => Math.round(value).toLocaleString('uk-UA')
</script>
<template>
  <section id="calculator" class="calculator">
    <div class="calculator-container">
      <h2>Калькулятор дохідності та окупності</h2>
      <p class="subtitle">Розрахуйте ефективність вашої майбутньої сонячної станції</p>
      <div class="calculator-grid">
        <div class="inputs-section">
          <div class="input-group">
            <div class="label-row">
              <label for="panel-count">Кількість панелей</label
              ><output for="panel-count" class="value-display">{{ panels }} шт</output>
            </div>
            <input
              id="panel-count"
              v-model.number="panels"
              type="range"
              min="1"
              max="50"
              class="range-slider"
            />
            <div class="range-labels"><span>1</span><span>50</span></div>
          </div>
          <div class="input-group">
            <div class="label-row">
              <label for="panel-watts">Потужність однієї панелі</label
              ><output for="panel-watts" class="value-display">{{ watts }} Вт</output>
            </div>
            <input
              id="panel-watts"
              v-model.number="watts"
              type="range"
              min="430"
              max="710"
              step="5"
              class="range-slider"
            />
            <div class="range-labels"><span>430 Вт</span><span>710 Вт</span></div>
          </div>
          <div class="system-summary">
            <p>
              Загальна потужність станції: <strong>{{ power.toFixed(2) }} кВт</strong>
            </p>
          </div>
        </div>
        <div class="results-section" aria-live="polite">
          <div class="result-card generation">
            <div class="icon-box"><i class="fas fa-sun" aria-hidden="true"></i></div>
            <div class="result-content">
              <h3>Річна генерація</h3>
              <p class="result-value">{{ format(generation) }} <span class="unit">кВт·год</span></p>
              <p class="result-desc">При 8 годинах світлового дня</p>
            </div>
          </div>
          <div class="result-card savings">
            <div class="icon-box"><i class="fas fa-wallet" aria-hidden="true"></i></div>
            <div class="result-content">
              <h3>Економія на рік</h3>
              <p class="result-value">{{ format(savings) }} <span class="unit">грн</span></p>
              <p class="result-desc">Еквівалент вартості енергії</p>
            </div>
          </div>
        </div>
      </div>
      <p class="estimate-note">
        Ілюстративний розрахунок: 8 годин на добу та умовна вартість 4,32 грн/кВт·год. Фактична
        генерація залежить від сезону, розташування та втрат системи.
      </p>
    </div>
  </section>
</template>
<style scoped>
.calculator {
  padding: 5rem 2rem;
  background: #fff;
  position: relative;
}
.calculator-container {
  max-width: 1000px;
  margin: 0 auto;
}
h2 {
  font-size: 2.5rem;
  color: #1f2937;
  margin-bottom: 1rem;
  text-align: center;
}
.subtitle {
  font-size: 1.1rem;
  color: #6b7280;
  margin-bottom: 3.5rem;
  text-align: center;
}
.calculator-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 3rem;
  align-items: center;
}
.inputs-section {
  padding: 2.5rem;
  background: #f8fafc;
  border-radius: 20px;
  box-shadow: 0 4px 20px #0000000d;
}
.input-group {
  margin-bottom: 2.5rem;
}
.label-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-weight: 600;
  color: #1f2937;
  font-size: 1.1rem;
}
.value-display {
  color: #eab308;
  font-weight: 700;
  background: #fffbeb;
  padding: 2px 10px;
  border-radius: 6px;
  border: 1px solid #fef3c7;
}
.range-slider {
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  outline: none;
  -webkit-appearance: none;
  cursor: pointer;
}
.range-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 28px;
  height: 28px;
  background: #facc15;
  border: 4px solid white;
  box-shadow: 0 2px 6px #0003;
  border-radius: 50%;
  cursor: pointer;
  transition:
    transform 0.1s ease-in-out,
    background 0.2s;
}
.range-slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  background: #eab308;
}
.range-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  color: #94a3b8;
  font-size: 0.85rem;
}
.system-summary {
  margin-top: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
  color: #4b5563;
  text-align: center;
}
.results-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.result-card {
  padding: 2rem;
  border-radius: 20px;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
}
.result-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px #00000026;
}
.result-card.generation {
  background: linear-gradient(135deg, #1f2937, #111827);
}
.result-card.savings {
  background: linear-gradient(135deg, #eab308, #ca8a04);
}
.icon-box {
  width: 60px;
  height: 60px;
  background: #fff3;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  flex-shrink: 0;
}
.result-content h3 {
  font-size: 1rem;
  margin: 0;
  opacity: 0.9;
  font-weight: 500;
  text-align: left;
  color: #fff;
}
.result-value {
  font-size: 2.2rem;
  font-weight: 800;
  margin: 0.2rem 0;
  line-height: 1.2;
}
.unit {
  font-size: 1rem;
  font-weight: 600;
  opacity: 0.9;
}
.result-desc {
  font-size: 0.85rem;
  margin: 0;
  opacity: 0.7;
}
@media (max-width: 900px) {
  .calculator-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  .result-card {
    padding: 1.5rem;
  }
}
.estimate-note {
  margin-top: 2rem;
  color: #64748b;
  font-size: 0.85rem;
  text-align: center;
}
@media (max-width: 480px) {
  .calculator {
    padding: 3rem 1rem;
  }
  h2 {
    font-size: 1.8rem;
  }
  .inputs-section {
    padding: 1.25rem;
  }
  .label-row {
    font-size: 0.9rem;
    gap: 0.5rem;
  }
  .result-card {
    padding: 1.25rem;
    gap: 1rem;
  }
  .result-value {
    font-size: 1.6rem;
  }
  .icon-box {
    width: 44px;
    height: 44px;
  }
}
</style>
