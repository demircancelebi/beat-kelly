<template>
  <div class="home">
    <h1>
     <a href="/" class="text-decoration-none hover-blue-border">
      Can you beat Kelly<span @click.prevent="details = !details">?</span>
    </a>
   </h1>
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
        <!-- <label for="hints">
          <input id="hints" type="checkbox" v-model="showHints">
          Show last round's optimal action during the game
        </label>
        <br> -->
        <h5 style="margin-bottom: 0;">Example question</h5>
        <img src="../assets/ss.png" alt="Screenshot" style="max-width: 550px;">
        <h5 style="margin-bottom: 0;">Rules</h5>
        <ul>
          <li>You start with 10000 units in your stack and will be asked 50 questions.</li>
          <li>You (and Kelly) can only choose how much you can risk at each round.</li>
          <li>The outcomes of the events are the same for you and Kelly.</li>
          <li>Try to have more units in your stack than Kelly at the end of 50 rounds.</li>
        </ul>
        <br>
        <button @click.prevent="gameStarted = true" style="margin-top: 10px;">
          Start the game
        </button>
      </form>
    </div>

    <div v-if="gameStarted">
      <div v-if="lastRound && lastRound.stack">
        <h4 style="margin: 0" class="text-success"
          v-if="stack >= lastRound.stack">Yay, you won!</h4>
        <h4 style="margin: 0" class="text-danger"
          v-if="stack < lastRound.stack">No, you lost!</h4>
        <h4 style="margin: 5px 0" class="ins-4">
          Last round stack: <strong>{{ lastRound.stack }}</strong> units</h4>
      </div>
      <h2 style="margin: 10px 0">
        Your current stack: <strong class="text-success">{{ stack }}</strong> units</h2>
      <div v-if="showHints && round > 1" class="hints">
        <h6 style="margin: 0 0 10px;">Last Round: {{lastRound.pctChanceToWin }}% win probability,
        {{ lastRound.multiplier }}x multiplier, {{ lastRound.stack }} your stack,
        {{ lastRound.kellyStack }} kelly stack</h6>
        You risked <strong>{{ lastRound.riskedAmount }}</strong> <br>
        Kelly risked <strong>{{ lastRound.kellyRisked }}</strong>
      </div>
      <div v-if="!gameOver">
        <div class="round">
          <h3 style="margin: 0 0 10px;" class="ins-4">Round #{{ round }} of {{ roundLimit }}</h3>
          <div v-if="details">
            <h5>evRandom (0.05-0.95): <input type="text" v-model="evRandom"></h5>
            <h5>expectedValue: <input type="text" v-model="expectedValue"></h5>
            <h5>pctChanceToWin: <input type="text" v-model="pctChanceToWin"></h5>
            <h5>kellySize: <input type="text" v-model="kellySize"></h5>
            <h5>multiplier: {{ multiplier }}</h5>
            <h5>simpleMultiplier: {{ simpleMultiplier }}</h5>
            <h5>actualExpectedValue: {{ actualExpectedValue }}</h5>
          </div>
          <h4 style="margin-bottom: 0;">The deal:</h4>
          <h2 style="margin-top: 5px; font-weight: normal;">
            You have a <strong>{{ pctChanceToWin }}%</strong> probability to
            <strong>{{ simpleMultiplier }}x</strong> your bet <br><small class="ins">--
            and a <strong>{{ 100 - pctChanceToWin }}%</strong> probability to lose it all.
          </small></h2>
          <h2 style="font-weight: normal; margin-bottom: 10px;">How much will you risk?
            <small>(Anything from <strong>0 to {{ stack }}</strong>)</small></h2>
          <form style="margin-top: 20px; font-size: 22px" action="#" @submit.prevent="nextRound">
            <input style="font-size: 22px" type="number" @enter.prevent="nextRound"
            v-model="riskedAmount">
            <button style="font-size: 22px" @click.prevent="nextRound">Submit!</button>
          </form>
        </div>
      </div>
      <div id="results"></div>
      <div v-if="gameOver">
        <table class="table">
          <thead>
            <tr>
              <th>Round #</th>
              <th>Expected Value</th>
              <th style="min-width: 50px">Win % probability</th>
              <th>Multiplier</th>
              <th>Your stack</th>
              <th>You risked</th>
              <th>Kelly stack</th>
              <th>Kelly risked</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(round, i) in roundHistory" v-bind:key="i">
              <td>{{ i + 1 }}</td>
              <td>{{ round.expectedValue.toFixed(3) }}</td>
              <td>{{ round.pctChanceToWin }}%</td>
              <td>{{ round.multiplier }}x</td>
              <td>{{ round.stack }}</td>
              <td>{{ round.riskedAmount }}</td>
              <td>{{ round.kellyStack }}</td>
              <td>{{ round.kellyRisked }}</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td></td>
              <td><strong>Final stacks</strong></td>
              <td></td>
              <td></td>
              <td>{{ stack }}</td>
              <td></td>
              <td>{{ kellyStack }}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <p style="margin-top: 100px;">Created by <a target="_blank" href="https://twitter.com/burakyngn/">@burakyngn</a> and <a target="_blank" href="https://twitter.com/demircancelebi/">@demircancelebi</a> <br><br>Inspired by the game at <a target="_blank" href="https://bestbet.data36.com/">data36.com</a></p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import gaussian from 'gaussian';

declare global {
  interface Window {
    Plotly: any;
  }
}

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
      const evDistribution = gaussian(1.05, 0.1);
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
      }

      this.riskedAmount = '';
      this.evRandom = ((Math.random() * 80) + 20) / 100;
      this.pctChanceToWin = 5 + Math.floor(Math.random() * 90);
      this.round += 1;
      if (this.round > this.roundLimit) {
        this.onGameOver();
      }
    },
    onGameOver() {
      this.gameOver = true;
      const stack = {
        x: [...this.roundHistory.map((r, i) => (i + 1)), this.roundLimit + 1],
        y: [...this.roundHistory.map(((r) => r.stack)), this.stack],
        type: 'scatter',
        name: 'Your performance',
      };

      const kellyStack = {
        x: [...this.roundHistory.map((r, i) => (i + 1)), this.roundLimit + 1],
        y: [...this.roundHistory.map(((r) => r.kellyStack)), this.kellyStack],
        type: 'scatter',
        name: 'Kelly performance',
      };

      const data = [stack, kellyStack];
      const layout = {
        title: 'Your performance against Kelly',
      };

      if (window.Plotly) {
        window.Plotly.newPlot('results', data, layout);
      }
    },
  },
  data() {
    return {
      roundHistory: [] as Array<RoundStats>,
      showHints: false,
      gameStarted: false,
      details: false,
      riskedAmount: '0',
      evRandom: 0,
      gameOver: false,
      stack: 10000,
      kellyStack: 10000,
      round: 0,
      roundLimit: 50,
      pctChanceToWin: 0.5,
    };
  },
});
</script>

<style>
  .home {
    margin: 0 auto;
    max-width: 700px;
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
  .table {
    text-align: left;
  }
  table {
    border-collapse: collapse;
  }

  tr {
    margin: 0;
    padding: 0;
  }
  th, td {
    border: 1px solid rgba(0, 0, 0, 0.2);
    padding: 10px;
    margin: 0;
  }
  .text-success {
    color: rgb(0, 177, 62);
  }
  .text-danger {
    color: rgb(177, 0, 62);
  }
  .text-decoration-none {
    text-decoration: none;
  }
  .hover-blue-border:hover {
    text-decoration: underline;
    text-decoration-skip-ink: auto;
  }
  .ins-3 {
    opacity: .3;
  }
  .ins-4 {
    opacity: .4;
  }
</style>
