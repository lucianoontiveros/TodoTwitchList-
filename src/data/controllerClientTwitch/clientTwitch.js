import tmi from "tmi.js";
const client = new tmi.Client({
  options: { debug: false },
  identity: {
    username: import.meta.env.VITE_APP_USERNAME,
    password: import.meta.env.VITE_APP_PASSWORD,
  },
  channels: [import.meta.env.VITE_APP_CHANNELS],
});



export default client;
