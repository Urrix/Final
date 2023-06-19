import { Component } from '@angular/core';
import Reservacion from '../services/reservacion.interface';
import { ReservacionesService } from '../services/reservaciones.service';
import User from '../services/user.interface';
import { Router } from '@angular/router';
import { InicioComponent } from '../inicio/inicio.component';

@Component({
  selector: 'app-hacer-reservacion',
  templateUrl: './hacer-reservacion.component.html',
  styleUrls: ['./hacer-reservacion.component.css']
})
export class HacerReservacionComponent {
  title = 'calendarioEjemplo';
  meses: string[] = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre"
  ];
  limiteCheckOut!: string;
  mesSeleccionado!: string;
  disponibles: Date[] = [];
  des: Date[] = [];
  dias: number[] = [];
  fechaCheckIn!: Date;
  fechaCheckOut!: Date;
  ano: number;
  mes: number;
  dia: number;
  casaID: string = "";
  casaNombre: string = "";
  seleccionarDia: boolean = false;
  seleccionarFechaCheckOut = false;
  mostrarFechas: Boolean = false;
  error: boolean = false;
  msj: string = "";
  fechaMinCheckOut!: string;
  usuario!: User;
  reservacionActual!: Reservacion;

  constructor(private reservacionesService: ReservacionesService,
    private router: Router) {
    this.fechaMinCheckOut = `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${(new Date().getDate()).toString().padStart(2, '0')}`;
    if (localStorage.getItem("casaNombre") != null) {
      this.casaNombre = JSON.parse(localStorage.getItem("casaNombre") || "");
    } else {
      this.casaNombre = "Casa 1";
    }
    if (localStorage.getItem("casaID") != null) {
      this.casaID = JSON.parse(localStorage.getItem("casaID") || "");
    } else {
      this.casaID = "airbnb1";
    }
    if (localStorage.getItem("usuarioActual") != null) {
      this.usuario = JSON.parse(localStorage.getItem("usuarioActual") || "");
    } else {
      this.usuario = {
        nombre: "",
        apellido: "",
        contrasena: "",
        correo: "",
        nacimiento: new Date(),
        telefono: ""
      }
    }
    this.des = reservacionesService.fechasOcupadas(this.casaID);
    console.log(this.des.values);
    this.ano = new Date().getFullYear();
    this.mes = new Date().getMonth();
    this.dia = new Date().getDate();
    this.mesSeleccionado = this.meses[this.mes];
    if (this.des != null) {
      this.des.sort(function (a, b) {
        return a.getTime() - b.getTime();
      });

    }
  }

  continuar() {
    this.mes = this.meses.indexOf(this.mesSeleccionado);
    if ((this.ano == (new Date().getFullYear()) && this.mes >= (new Date().getMonth()))
      || this.ano > (new Date().getFullYear())) {
      this.error = false;
      let ini = new Date(this.ano, this.mes, 1);
      let fin = new Date(this.ano, this.mes + 1, 1);
      this.seleccionarDia = true;
      while (ini < fin) {
        let band = true;
        if (this.des != null) {
          for (let i of this.des) {
            if ((ini.getDate() == i.getDate() &&
              ini.getMonth() == i.getMonth() &&
              ini.getFullYear() == i.getFullYear())) {
              band = false;
            }
          }
        }
        if (band) {
          this.dias.push(ini.getDate());
        }
        ini.setDate(ini.getDate() + 1);
      }

    } else {
      this.seleccionarDia = false;
      this.msj = "Verifica el ano y mes ingresados";
      this.error = true;
    }
    //console.log(this.dias)
  }

  continuar2() {
    if ((new Date(this.ano, this.mes, this.dia)) >= (new Date())) {
      this.error = false;
      this.seleccionarFechaCheckOut = true;
      this.fechaCheckIn = new Date(this.ano, this.mes, this.dia);
      this.fechaMinCheckOut = `${this.fechaCheckIn.getFullYear()}-${(this.fechaCheckIn.getMonth() + 1).toString().padStart(2, '0')}-${(this.fechaCheckIn.getDate()).toString().padStart(2, '0')}`;
      let min = this.minFechaCheckOut();
      //console.log(min);
      if (min == this.fechaCheckIn) {
        min.setFullYear(min.getFullYear() + 1);
      }
      this.limiteCheckOut = `${min.getFullYear()}-${(min.getMonth() + 1).toString().padStart(2, '0')}-${(min.getDate()).toString().padStart(2, '0')}`;
      //console.log(this.limiteCheckOut);
      this.fechaCheckIn.setFullYear(this.fechaCheckIn.getFullYear() - 1);

    } else {
      this.msj = "Verifica el dia ingresado";
      this.error = true;
    }
  }

  minFechaCheckOut(): Date {
    this.des.push(this.fechaCheckIn)
    //console.log(this.des);
    this.des.sort(function (a, b) {
      return a.getTime() - b.getTime();
    });
    //console.log(this.des);
    let indice = this.des.indexOf(this.fechaCheckIn);
    //console.log(indice + " " + this.des.length);
    if ((indice + 1) < this.des.length) {
      let min = this.des[indice + 1];
      return min;
    }
    return this.fechaCheckIn;
  }

  continuar3() {
    this.reservacionActual = {
      correo: this.usuario.correo,
      checkin: new Date(this.fechaCheckIn),
      checkout: new Date(this.fechaCheckOut)
    }
    const response = this.reservacionesService.anadirReservacion(this.reservacionActual, this.casaID);
    console.log(response);
    setTimeout(() => {
      this.fechaCheckOut = new Date(this.fechaCheckOut);
      this.mostrarFechas = true;
    }, 3000);
  }

  terminar() {
    localStorage.removeItem("casaNombre");
    localStorage.removeItem("casaID");
    this.router.navigate(['']);
  }


}
