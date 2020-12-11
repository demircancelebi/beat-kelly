<template>
  <div class="home">
    <h1>Can you beat Kelly <span @click.prevent="details = !details">?</span></h1>
    <h5>Your current stack: <strong>{{ stack }}</strong> units</h5>
    <div v-if="gameOver">
      Game over.
    </div>
    <div v-if="!gameOver">
      <h4>Round #{{ round }}</h4>
      <div v-if="details">
        <h5>evRandom (0.05-0.95): <input type="text" v-model="evRandom"></h5>
        <h5>expectedValue: <input type="text" v-model="expectedValue"></h5>
        <h5>pctChanceToWin: <input type="text" v-model="pctChanceToWin"></h5>
        <h5>multiplier: {{ multiplier }}</h5>
        <h5>simple_multiplier: {{ simpleMultiplier }}</h5>
      </div>
      <h5 style="margin-bottom: 0;">The deal:</h5>
      <h4 style="margin-top: 5px; font-weight: normal;">
        You have a <strong>{{ pctChanceToWin }}%</strong> probability to
        <strong>{{ simpleMultiplier }}x</strong> your bet --
        and a <strong>{{ 100 - pctChanceToWin }}%</strong> probability to lose it all.</h4>
      <h4 style="font-weight: normal;">How much will you risk?
        <small>Anything from 0 to <strong>{{ stack }}</strong></small></h4>
      <form action="#" @submit.prevent="nextRound">
        <input type="number" @enter.prevent="nextRound" v-model="riskedAmount">
        <button>Submit!</button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import gaussian from 'gaussian';

export default defineComponent({
  name: 'Home',
  created() {
    this.nextRound();
  },
  computed: {
    multiplier(): number {
      return this.expectedValue / (this.pctChanceToWin / 100);
    },
    simpleMultiplier(): number {
      return Math.max(1, Math.floor(this.expectedValue / (this.pctChanceToWin / 1000)) / 10);
    },
    expectedValue(): number {
      const evDistribution = gaussian(0.8, 0.1);
      return evDistribution.ppf(this.evRandom);
    },
  },
  methods: {
    nextRound() {
      const riskedAmount = Number.parseInt(this.riskedAmount, 10);
      if (riskedAmount > this.stack) {
        return;
      }

      if (this.round > 0) {
        if (Math.random() * 100 < this.pctChanceToWin) { // won
          this.stack = this.stack - riskedAmount + (riskedAmount * this.simpleMultiplier);
        } else {
          this.stack -= riskedAmount;
        }
      }

      this.riskedAmount = '';
      this.evRandom = ((Math.random() * 90) + 5) / 100;
      this.pctChanceToWin = 5 + Math.floor(Math.random() * 90);
      this.round += 1;
      if (this.round > this.roundLimit) {
        this.gameOver = true;
      }
    },
  },
  data() {
    return {
      details: false,
      riskedAmount: '',
      evRandom: 0,
      gameOver: false,
      stack: 10000,
      round: 0,
      roundLimit: 5,
      pctChanceToWin: 0.5,
    };
  },
});
</script>
