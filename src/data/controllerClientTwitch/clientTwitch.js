import tmi from "tmi.js";

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
        debug: false, // Cambiado a false para reducir logs
        skipMembership: true,
        skipUpdatingEmotesets: true
      },
      connection: {
        secure: true,
        reconnect: true,
        maxReconnectAttempts: Infinity,
        reconnectInterval: 1000,
        reconnectDecay: 1.5,
        maxReconnectInterval: 30000,
        timeout: 30000,
      },
      identity: {
        username,
        password,
      },
      channels: [channels],
    });

    this.isConnected = false;
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.client.on('connected', (address, port) => {
      console.log(`Bot conectado a ${address}:${port}`);
      this.isConnected = true;
    });

    this.client.on('disconnected', (reason) => {
      console.log('Bot desconectado:', reason);
      this.isConnected = false;
    });

    this.client.on('error', (error) => {
      console.error('Error en el bot:', error);
      this.isConnected = false;
    });
  }

  checkConnection() {
    return this.isConnected && this.client.readyState() === 'OPEN';
  }

  disconnect() {
    this.isConnected = false;
    if (this.client) {
      this.client.disconnect();
    }
  }
}

// Singleton pattern para evitar múltiples instancias
let twitchClientInstance = null;

export const getTwitchClient = () => {
  if (!twitchClientInstance) {
    try {
      twitchClientInstance = new TwitchClient();
      if (!twitchClientInstance.client) {
        throw new Error('Cliente Twitch no inicializado correctamente');
      }
    } catch (error) {
      console.error('Error al inicializar el cliente Twitch:', error);
      twitchClientInstance = {
        client: {
          connect: () => Promise.resolve(),
          on: () => {},
          removeListener: () => {},
          disconnect: () => {},
          readyState: () => 'CLOSED'
        },
        isConnected: false,
        disconnect: () => {}
      };
    }
  }
  return twitchClientInstance;
};

export default getTwitchClient().client;