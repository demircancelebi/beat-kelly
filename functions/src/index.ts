// import * as functions from 'firebase-functions';
// import * as admin from 'firebase-admin';

// import * as express from 'express';
// import * as cors from 'cors';

// const app = express();

// // Automatically allow cross-origin requests
// app.use(cors());

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

// app.post('/', async (req, res) => {

// });

// admin.initializeApp(functions.config().firebase);

// export const addMessage = functions.https.onRequest(async (req, res) => {
//   // cors(req, res, async () => {
//   // Grab the text parameter.
//   const original = req.query.text;

//   await admin.database().ref('messages').set(original);

//   // Send back a message that we've successfully written the message
//   res.json({ result: original });
//   // });
// });

// export const corsEnabledFunction = functions.https.onRequest(async (req, res) => {
//   // Set CORS headers for preflight requests
//   // Allows GETs from any origin with the Content-Type header
//   // and caches preflight response for 3600s

//   console.log('functions.config()');
//   console.log(functions.config());
//   console.log('functions.config().firebase');
//   console.log(functions.config().firebase);

//   res.set('Access-Control-Allow-Origin', '*');

//   if (req.method === 'OPTIONS') {
//     // Send response to OPTIONS requests
//     res.set('Access-Control-Allow-Methods', 'GET');
//     res.set('Access-Control-Allow-Headers', 'Content-Type');
//     res.set('Access-Control-Max-Age', '3600');
//     res.status(204).send('');
//   } else {
//     console.log('req.body');
//     console.log(req.body);
//     console.log(JSON.parse(req.body));
//     await admin.database().ref('leaderboard').set(JSON.parse(req.body));
//     res.send({ text: 'Hello World!' });
//   }
// });

// export const helloWorld = functions.https.onRequest((request, response) => {
//   response.send('Hello from Firebase!');
// });

// export const helloWorldCall = functions.https.onCall((data, ctx) => {
//   console.log('data');
//   console.log(data);
//   return {
//     data,
//     ctx,
//   };
// });
