export default interface User{
    id?:string;
    nombre: string;
    apellido: string;
    correo: string;
    telefono: string;
    contrasena: string;
    nacimiento: Date;
}