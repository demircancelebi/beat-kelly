<template>
  <div class="home">
    <h1>Can you beat Kelly?</h1>
    <h5>Your current stack: <strong>{{ stack }}</strong> units</h5>
    <h4>Round #{{ round + 1 }}</h4>
    <h6>The deal:</h6>
    <h5>You have a {{ prob }}% probability to 7.5x your bet --
    and a {{ 100 - prob }}% probability to lose it all.</h5>
    <h5>How much of your play money are you willing to risk?
    (It can be anything between 0 to {{ stack }}.)</h5>
    <input type="text">
    <button>Submit!</button>
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src

export default defineComponent({
  name: 'Home',
  // components: {
  //   HelloWorld,
  // },
  created() {
    this.initiate();
  },
  methods: {
    initiate() {
      console.log('init');
    },
  },
  data() {
    return {
      stack: 10000,
      round: 0,
      prob: 0,
    };
  },
});
</script>
