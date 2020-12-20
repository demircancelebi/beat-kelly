import { createStore } from 'vuex';

declare global {
  interface Window {
    firebase: any;
  }
}

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
// window.firebase.functions().useFunctionsEmulator('http://192.168.1.102:5001'); // Or whatever the port is for your local emulator

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
