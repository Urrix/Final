import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-airbnb2',
  templateUrl: './airbnb2.component.html',
  styleUrls: ['./airbnb2.component.css']
})
export class Airbnb2Component {
  botonReservar: boolean = false;
  nom: string = "airbnb2";
  id: string = "Milán, Lombardia, Italia";

  constructor(private router: Router) {
    if (localStorage.getItem("usuarioActual") != null) {
      this.botonReservar = true;
    }
  }
  reservar() {
    localStorage.removeItem("casaNombre");
    localStorage.removeItem("casaID");

    localStorage.setItem("casaID", JSON.stringify(this.nom));
    localStorage.setItem("casaNombre", JSON.stringify(this.id));
    this.router.navigate(['/hacerReservacion']);
  }
}
