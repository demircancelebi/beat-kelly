import { createStore } from 'vuex';

const firebaseConfig = {
  apiKey: 'AIzaSyB86PePJJKrO7fBNvQe8mIibs2_zBF14yo',
  authDomain: 'beat-kelly.firebaseapp.com',
  projectId: 'beat-kelly',
  storageBucket: 'beat-kelly.appspot.com',
  messagingSenderId: '773010828043',
  appId: '1:773010828043:web:f67776a1bdd305f5a3100e',
  measurementId: 'G-9ESK7NLBG8',
};

// Initialize Firebase
window.firebase.initializeApp(firebaseConfig);
window.firebase.analytics();

export default createStore({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  },
});
