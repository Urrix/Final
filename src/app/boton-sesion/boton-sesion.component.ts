import { Component, ElementRef, ViewChild } from "@angular/core";
import { UserService } from "../services/user.service";

@Component({
  selector: 'app-boton-sesion',
  templateUrl: './boton-sesion.component.html',
  styleUrls: ['./boton-sesion.component.css']
})

export class BotonSesionComponent {

  sesion: boolean = false;
  usuarios: Usuario[] = [];
  usuarioActual!: Usuario;
  sesionIniciada: boolean = false;
  error: boolean = false;
  exito: boolean = false;
  msj: string = "";
  continuar: boolean = false;
  txtBoton: string = "Bienvenido!";
  editarInfo: boolean = false;
  eliminar: boolean = false;
  txtModal: string = "";

  nombre: string = "";
  apellido: string = "";
  correo: string = "";
  telefono: string = "";
  contrasena: string = "";
  nacimiento: Date = new Date;

  constructor(private userService: UserService) {
    if (localStorage.getItem("usuarios") != null) {
      this.usuarios = JSON.parse(localStorage.getItem("usuarios") || "");
    }
    this.verificarSesion();
    console.log(userService.mostrarAuth());
  }

  verificarSesion(): void {
    if (localStorage.getItem("usuarioActual") != null) {
      this.usuarioActual = JSON.parse(localStorage.getItem("usuarioActual") || "");
      this.sesionIniciada = true;
      this.txtBoton = "Hola " + this.usuarioActual.nombre + "!";
    } else {
      this.sesionIniciada = false;
    }
  }

  registrarUsuario(): void {
    let aux: Usuario = {
      nombre: this.nombre,
      apellido: this.apellido,
      correo: this.correo,
      telefono: this.telefono,
      contrasena: this.contrasena,
      nacimiento: this.nacimiento,
    }
    this.userService.registrarUsuario(aux, false);
    setTimeout(() => {
      if (localStorage.getItem("usuarioActual") != null) {
        console.log("logrado");
        this.usuarioActual = aux;
        this.msj = "Has sido registrado!";
        this.txtBoton = "Hola " + this.usuarioActual.nombre + "!";
        this.exito = true;
        this.sesionIniciada = true;
        this.error = false;
        this.continuar = true;
      } else {
        console.log("errado");
        this.error = true;
        this.msj = "Error, verifique haber escrito correctamente su informacion.";
      }
    }, 5000);

  }

  limpiar(): void {
    this.nombre = "";
    this.apellido = "";
    this.correo = "";
    this.telefono = "";
    this.contrasena = "";
    this.nacimiento = new Date;
    this.error = false;
    this.exito = false;
    this.continuar = false;
    this.editarInfo = false;
    this.eliminar = false;
  }

  refrescar(): void { window.location.reload(); }

  iniciarSesion(): void {
    if (!this.userService.validarUsuario(this.correo)) {
      this.userService.iniciarSesion(this.correo, this.contrasena, false);
      setTimeout(() => {
        if (localStorage.getItem("usuarioActual") != null) {
          this.usuarioActual = JSON.parse(localStorage.getItem("usuarioActual") || "");
          this.msj = "Has iniciado sesion!";
          this.exito = true;
          this.error = false
          this.continuar = true;
          this.sesionIniciada = true;
          this.txtBoton = "Hola " + this.usuarioActual.nombre + "!";
        } else {
          this.error = true;
          this.exito = false
          this.msj = "Contrasena incorrecta.";
        }
      }, 3000)
    } else {
      this.error = true;
      this.exito = false;
      this.msj = "Nombre de usario no encontrado, intenta de nuevo.";
    }
  }

  cerrarSesion(): void {
    this.userService.cerrarSesion();
    this.usuarioActual.nombre = "";
    this.usuarioActual.apellido = "";
    this.usuarioActual.correo = "";
    this.usuarioActual.telefono = "";
    this.usuarioActual.contrasena = "";
    this.usuarioActual.nacimiento = new Date;
    this.sesionIniciada = false;
    this.limpiar();
    this.refrescar();
  }

  editarInformacion(): void {
    this.editarInfo = true;
    this.nombre = this.usuarioActual.nombre;
    this.apellido = this.usuarioActual.apellido;
    this.correo = this.usuarioActual.correo;
    this.telefono = this.usuarioActual.telefono;
    this.contrasena = this.usuarioActual.contrasena;
    this.nacimiento = this.usuarioActual.nacimiento;
  }

  guardarModificacion(): void {
    if (this.nombre == this.usuarioActual.nombre &&
      this.apellido == this.usuarioActual.apellido &&
      this.correo == this.usuarioActual.correo &&
      this.telefono == this.usuarioActual.telefono &&
      this.contrasena == this.usuarioActual.contrasena &&
      this.nacimiento == this.usuarioActual.nacimiento) {
      this.error = true;
      this.msj = "Aun no has modificado nada.";
    } else {
      let aux: Usuario = {
        nombre: this.nombre,
        apellido: this.apellido,
        correo: this.correo,
        telefono: this.telefono,
        contrasena: this.contrasena,
        nacimiento: this.nacimiento,
      }
      let aux2: Usuario[] = [];
      for (let i of this.usuarios) {
        if (i.correo != this.usuarioActual.correo) {
          aux2.push(i);
        }
      }
      this.usuarios = aux2;
      if (this.userService.validarUsuario(aux.correo)) {
        this.userService.borrarUsuario(this.usuarioActual);
        this.usuarioActual = aux;
        this.userService.registrarUsuario(this.usuarioActual, false);
        this.msj = "Registro actualizado!";
        this.txtBoton = "Hola " + this.usuarioActual.nombre + "!";
        this.exito = true;
        this.sesionIniciada = true;
        this.error = false;
        this.continuar = true;
      } else {
        this.error = true;
        this.msj = "Error, verifique haber escrito correctamente su informacion.";
      }
    }
  }

  eliminarUsuario(): void {
    if (this.contrasena == this.usuarioActual.contrasena) {
      this.userService.borrarUsuario(this.usuarioActual);
      this.exito = true;
      this.error = false;
      this.msj = "Tu cuenta ha sido eliminada correctamente!";
      this.continuar = true;
    } else {
      this.error = true;
      this.msj = "Contrasena incorrecta.";
    }
  }

}

interface Usuario {
  nombre: string,
  apellido: string,
  correo: string,
  telefono: string,
  contrasena: string,
  nacimiento: Date,
}


