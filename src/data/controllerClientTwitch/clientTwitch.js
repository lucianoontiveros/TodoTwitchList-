import tmi from "tmi.js";

// Configuración básica
const KEEP_ALIVE_URL = typeof window !== 'undefined' && window.location ? 
  window.location.origin : 
  'http://localhost:5174';

class TwitchClient {
  constructor() {
    const username = import.meta.env.VITE_APP_USERNAME;
    const password = import.meta.env.VITE_APP_PASSWORD;
    const channels = import.meta.env.VITE_APP_CHANNELS;

    if (!username || !password || !channels) {
      console.error('Variables de entorno faltantes para el cliente Twitch');
      return;
    }

    this.client = new tmi.Client({
      options: { 
        debug: false,
        skipMembership: true,
        skipUpdatingEmotesets: true
      },
      connection: {
        secure: true,
        reconnect: true,
        timeout: 20000
      },
      identity: {
        username,
        password,
      },
      channels: [channels],
    });

    this.keepAliveInterval = null;
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.client.on('connected', (address, port) => {
      console.log(`Bot conectado a ${address}:${port}`);
      this.startKeepAlive();
    });

    this.client.on('disconnected', (reason) => {
      console.log('Bot desconectado:', reason);
    });

    this.client.on('error', (error) => {
      console.error('Error en el bot:', error);
    });
  }

  startKeepAlive() {
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
    }

    this.keepAliveInterval = setInterval(() => {
      fetch(KEEP_ALIVE_URL)
        .then(() => console.log('Keep-alive ping enviado'))
        .catch(err => console.error('Error en keep-alive:', err));
    }, 270000); // 4.5 minutos
  }

  checkConnection() {
    return this.client.readyState() === 'OPEN';
  }
}

let twitchClient;

try {
  twitchClient = new TwitchClient();
  if (!twitchClient.client) {
    throw new Error('Cliente Twitch no inicializado correctamente');
  }
} catch (error) {
  console.error('Error al inicializar el cliente Twitch:', error);
  twitchClient = {
    client: {
      connect: () => Promise.resolve(),
      on: () => {},
      off: () => {},
      readyState: () => 'CLOSED'
    }
  };
}

export default twitchClient.client;
