import tmi from "tmi.js";

// Configuración optimizada para Vercel
const PING_INTERVAL = 30000; // 30 segundos
const RECONNECT_INTERVAL = 5000; // 5 segundos
const MAX_RECONNECT_ATTEMPTS = 100;
const KEEP_ALIVE_URL = typeof window !== 'undefined' && window.location ? 
  window.location.origin : 
  'http://localhost:5174';

class TwitchClient {
  constructor() {
    // Verificar que las variables de entorno estén disponibles
    const username = import.meta.env.VITE_APP_USERNAME;
    const password = import.meta.env.VITE_APP_PASSWORD;
    const channels = import.meta.env.VITE_APP_CHANNELS;

    if (!username || !password || !channels) {
      console.error('Variables de entorno faltantes para el cliente Twitch');
      return;
    }

    this.client = new tmi.Client({
      options: { 
        debug: true,
        skipMembership: true,
        skipUpdatingEmotesets: true
      },
      connection: {
        secure: true,
        reconnect: true,
        maxReconnectAttempts: MAX_RECONNECT_ATTEMPTS,
        reconnectInterval: RECONNECT_INTERVAL,
        reconnectDecay: 1.2,
        timeout: 60000
      },
      identity: {
        username,
        password,
      },
      channels: [channels],
    });

    this.reconnectAttempts = 0;
    this.pingInterval = null;
    this.keepAliveInterval = null;
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.client.on('disconnected', this.handleDisconnect.bind(this));
    this.client.on('connected', this.handleConnect.bind(this));
    this.client.on('error', this.handleError.bind(this));
    
    // Manejar señales del sistema
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => this.cleanup());
      window.addEventListener('online', () => this.handleReconnect());
      window.addEventListener('focus', () => this.checkConnection());
    }
  }

  async handleConnect(address, port) {
    console.log(`Bot conectado a ${address}:${port}`);
    this.reconnectAttempts = 0;
    this.startPingInterval();
    this.startKeepAlive();
  }

  handleDisconnect(reason) {
    console.log('Bot desconectado:', reason);
    this.cleanup();
    this.handleReconnect();
  }

  handleError(error) {
    console.error('Error en el bot:', error);
    if (this.client.readyState() !== 'OPEN') {
      this.handleReconnect();
    }
  }

  async handleReconnect() {
    if (this.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.error('Máximo número de intentos de reconexión alcanzado');
      return;
    }

    if (this.client.readyState() === 'CLOSED') {
      this.reconnectAttempts++;
      console.log(`Intento de reconexión ${this.reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}`);
      
      try {
        await this.client.connect();
      } catch (err) {
        console.error('Error al reconectar:', err);
        setTimeout(() => this.handleReconnect(), 
          Math.min(1000 * Math.pow(1.2, this.reconnectAttempts), 30000));
      }
    }
  }

  startPingInterval() {
    this.cleanup();
    this.pingInterval = setInterval(() => {
      if (this.client.readyState() === 'OPEN') {
        this.client.ping().catch(console.error);
      } else {
        this.handleReconnect();
      }
    }, PING_INTERVAL);
  }

  startKeepAlive() {
    // Mantener la función activa
    this.keepAliveInterval = setInterval(() => {
      fetch(KEEP_ALIVE_URL)
        .then(() => console.log('Keep-alive ping enviado'))
        .catch(err => console.error('Error en keep-alive:', err));
    }, 270000); // 4.5 minutos
  }

  checkConnection() {
    if (this.client.readyState() !== 'OPEN') {
      this.handleReconnect();
    }
  }

  cleanup() {
    if (this.pingInterval) clearInterval(this.pingInterval);
    if (this.keepAliveInterval) clearInterval(this.keepAliveInterval);
  }

  connect() {
    return this.client.connect();
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
  // Proporcionar un cliente nulo que no cause errores
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

