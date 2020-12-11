<template>
  <div class="home">
    <h1>Can you beat Kelly?</h1>
    <h5>Your current stack: <strong>{{ stack }}</strong> units</h5>
    <div v-if="gameOver">
      Game over.
    </div>
    <div v-if="!gameOver">
      <h4>Round #{{ round }}</h4>
      <h6>The deal:</h6>
      <h5>You have a {{ chanceToWin }}% probability to {{ multiplier2 }}x your bet --
      and a {{ 100 - chanceToWin }}% probability to lose it all.</h5>
      <h5>How much of your play money are you willing to risk?
      (It can be anything between 0 to {{ stack }}.)</h5>
      <form action="#" @submit.prevent="nextRound">
        <input type="number" @enter.prevent="nextRound" v-model="riskedAmount">
        <button>Submit!</button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Home',
  created() {
    this.nextRound();
  },
  methods: {
    nextRound() {
      const riskedAmount = Number.parseInt(this.riskedAmount, 10);
      if (riskedAmount > this.stack) {
        return;
      }

      if (this.round > 0) {
        if (Math.random() * 100 < this.chanceToWin) { // won
          this.stack = this.stack - riskedAmount + (riskedAmount * this.multiplier2);
        } else {
          this.stack -= riskedAmount;
        }
      }

      this.riskedAmount = '';
      this.expectedValue = 0.3 + Math.random();
      this.chanceToWin = Math.floor(Math.random() * 100);
      this.multiplier = 1 + (100 * this.expectedValue) / this.chanceToWin;
      this.multiplier2 = (10 + Math.floor((1000 * this.expectedValue) / this.chanceToWin)) / 10;
      this.round += 1;
      if (this.round > this.roundLimit) {
        this.gameOver = true;
      }
    },
  },
  data() {
    return {
      riskedAmount: '',
      multiplier: 1,
      multiplier2: 1,
      expectedValue: 1,
      gameOver: false,
      stack: 10000,
      round: 0,
      roundLimit: 5,
      chanceToWin: 1,
    };
  },
});
</script>
