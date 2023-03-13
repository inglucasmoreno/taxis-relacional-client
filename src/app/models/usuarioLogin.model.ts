// Modelo - Usuario Online
export class UsuarioOnline {
    constructor(
        public userId: number,
        public usuario: string,
        public nombre: string,
        public apellido: string,
        public role: string,
    ){}   
}