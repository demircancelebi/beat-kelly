<template>
  <div class="home">
    <h1 class="text-3xl leading-9 font-extrabold text-gray-900 tracking-tight sm:text-4xl
     sm:leading-10 md:text-5xl md:leading-14">
     Can you beat Kelly <span @click.prevent="details = !details">?</span></h1>
    <div v-if="!gameStarted">
      <p>
        Interactive game at this website is designed to teach you optimal bet sizing.
      </p>
      <blockquote>In probability theory <strong>the Kelly criterion</strong>, a.k.a
        <strong>the scientific gambling method</strong>, is a formula for bet sizing
        that leads almost surely to <strong>higher wealth</strong>
        compared to any other strategy in the long run.
      </blockquote>

      <form action="" style="margin-top: 20px;">
        <label for="hints">
          <input id="hints" type="checkbox" v-model="showHints">
          Show last round's optimal action during the game
        </label>
        <br>
        <button @click.prevent="gameStarted = true" style="margin-top: 10px;">
          Start the game
        </button>
      </form>
    </div>

    <div v-if="gameStarted">
      <h5>Your current stack: <strong>{{ stack }}</strong> units</h5>
      <h5>Kelly stack: <strong>{{ kellyStack }}</strong> units</h5>
      <div v-if="gameOver">
        Game over.
      </div>
      <div v-if="showHints && round > 1" class="hints">
        <h6 style="margin: 0 0 10px;">Last Round: {{lastRound.pctChanceToWin }}% win probability,
        {{ lastRound.multiplier }}x multiplier, {{ lastRound.stack }} your stack,
        {{ lastRound.kellyStack }} kelly stack</h6>
        You risked <strong>{{ lastRound.riskedAmount }}</strong> <br>
        Kelly risked <strong>{{ lastRound.kellyRisked }}</strong>
      </div>
      <div v-if="!gameOver">
        <div class="round">
          <h3 style="margin: 0 0 10px;">Round #{{ round }}</h3>
          <div v-if="details">
            <h5>evRandom (0.05-0.95): <input type="text" v-model="evRandom"></h5>
            <h5>expectedValue: <input type="text" v-model="expectedValue"></h5>
            <h5>pctChanceToWin: <input type="text" v-model="pctChanceToWin"></h5>
            <h5>kellySize: <input type="text" v-model="kellySize"></h5>
            <h5>multiplier: {{ multiplier }}</h5>
            <h5>simpleMultiplier: {{ simpleMultiplier }}</h5>
            <h5>actualExpectedValue: {{ actualExpectedValue }}</h5>
          </div>
          <h5 style="margin-bottom: 0;">The deal:</h5>
          <h4 style="margin-top: 5px; font-weight: normal;">
            You have a <strong>{{ pctChanceToWin }}%</strong> probability to
            <strong>{{ simpleMultiplier }}x</strong> your bet --
            and a <strong>{{ 100 - pctChanceToWin }}%</strong> probability to lose it all.</h4>
          <h4 style="font-weight: normal; margin-bottom: 10px;">How much will you risk?
            <small>Anything from 0 to <strong>{{ stack }}</strong></small></h4>
          <form action="#" @submit.prevent="nextRound">
            <input type="number" @enter.prevent="nextRound" v-model="riskedAmount">
            <button>Submit!</button>
          </form>
        </div>
      </div>
      <pre><code>
        roundHistory: {{ roundHistory }}
      </code></pre>
    </div>
    <p style="margin-top: 200px;">Created by <a target="_blank" href="https://twitter.com/burakyngn/">@burakyngn</a> and <a target="_blank" href="https://twitter.com/demircancelebi/">@demircancelebi</a> <br><br>Inspired by the game at <a target="_blank" href="https://bestbet.data36.com/">data36.com</a></p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import gaussian from 'gaussian';

type RoundStats = {
  expectedValue: number;
  pctChanceToWin: number;
  multiplier: number;
  stack: number;
  kellyStack: number;
  riskedAmount: number;
  kellyRisked: number;
}

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
      const evDistribution = gaussian(0.95, 0.1);
      return evDistribution.ppf(this.evRandom);
    },
    actualExpectedValue(): number {
      return this.simpleMultiplier * (this.pctChanceToWin / 100);
    },
    kellySize(): number {
      if (this.actualExpectedValue < 1) {
        return 0;
      }
      const pct100 = this.pctChanceToWin / 100;
      return pct100 - (1 - pct100) / (this.simpleMultiplier - 1);
    },
    lastRound(): object {
      if (this.roundHistory.length === 0) {
        return {};
      }

      return this.roundHistory[this.roundHistory.length - 1];
    },
  },
  methods: {
    nextRound() {
      if (this.riskedAmount === '') {
        return;
      }

      const riskedAmount = Number.parseInt(this.riskedAmount, 10);
      if (riskedAmount > this.stack) {
        return;
      }

      if (this.round > 0) {
        const kellyRisked = Number.parseInt((this.kellySize * this.kellyStack).toFixed(), 10);

        this.roundHistory.push({
          expectedValue: this.actualExpectedValue,
          pctChanceToWin: this.pctChanceToWin,
          multiplier: this.simpleMultiplier,
          stack: this.stack,
          kellyStack: this.kellyStack,
          riskedAmount,
          kellyRisked,
        });

        if (Math.random() * 100 < this.pctChanceToWin) { // won
          this.stack = this.stack - riskedAmount + (riskedAmount * this.simpleMultiplier);
          this.stack = Number.parseInt(this.stack.toFixed(), 10);
          this.kellyStack = this.kellyStack - kellyRisked + (kellyRisked * this.simpleMultiplier);
          this.kellyStack = Number.parseInt(this.kellyStack.toFixed(), 10);
        } else {
          this.stack -= riskedAmount;
          this.kellyStack -= kellyRisked;
        }
        console.log(this.stack);
        console.log(this.kellyStack);
      }

      this.riskedAmount = '';
      this.evRandom = ((Math.random() * 80) + 20) / 100;
      this.pctChanceToWin = 5 + Math.floor(Math.random() * 90);
      this.round += 1;
      if (this.round > this.roundLimit) {
        this.gameOver = true;
      }
    },
  },
  data() {
    return {
      roundHistory: [] as Array<RoundStats>,
      showHints: true,
      gameStarted: false,
      details: false,
      riskedAmount: '0',
      evRandom: 0,
      gameOver: false,
      stack: 10000,
      kellyStack: 10000,
      round: 0,
      roundLimit: 5,
      pctChanceToWin: 0.5,
    };
  },
});
</script>

<style>
  .home {
    margin: 0 auto;
    max-width: 600px;
  }
  blockquote {
    background: #eee;
    padding: 15px;
    text-align: left;
    margin: 0
  }
  .hints {
    background: rgba(27, 96, 224, 0.9);
    color: #fff;
    padding: 10px
  }
  a {
    color: rgb(27, 96, 224);
  }
  .round {
    border: 1px solid rgba(27, 96, 224, 0.9);
    padding: 10px;
  }
</style>
