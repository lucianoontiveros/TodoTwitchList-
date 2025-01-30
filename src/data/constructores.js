class Viewer {
  constructor(name) {
    this.name = name;
    this._id = null;
    this.status = null;
    this.tasks = [];
    this.exams = [];
    this.lastTime = "";
    this.personaldata = [];
  }

  // Getter para mensaje
  get mensaje() {
    return this._mensaje || "No hay mensaje disponible";
  }

  get id() {
    return `${this.name} tiene el ID: ${this._id}`;
  }

  // Setter para mensaje
  mensaje() {
    return (this._mensaje = value);
  }

  registerID() {
    const timestamp = Date.now().toString(36);
    const randomSegment = Math.floor(Math.random() * 10000).toString(36);
    this._id = `${timestamp}-${randomSegment}`;
  }

  // Registrar la última interacción del usuario
  registerUser() {
    const date = new Date();
    const formattedDate = date.toLocaleDateString("es-ES");
    const formattedTime = date.toLocaleTimeString("es-ES");
    const lastConection = `${this.name} interactuó por última vez: ${formattedDate} ${formattedTime}.`;
    this.lastTime = date;
    this.mensaje = lastConection; // Asignamos mensaje usando el setter
  }
}

export { Viewer };
