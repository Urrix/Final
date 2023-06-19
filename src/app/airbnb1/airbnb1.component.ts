import { Component,OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-airbnb1',
  templateUrl: './airbnb1.component.html',
  styleUrls: ['./airbnb1.component.css'],
})
export class Airbnb1Component {
  botonReservar:boolean = false;
  nom:string = "airbnb1";
  id:string = "Milán, Lombardia, Italia";

  constructor(private router:Router){
    if(localStorage.getItem("usuarioActual")!=null){
      this.botonReservar = true;
    }
  }
  reservar(){
    localStorage.removeItem("casaNombre");
    localStorage.removeItem("casaID");

    localStorage.setItem("casaID",JSON.stringify(this.nom));
    localStorage.setItem("casaNombre",JSON.stringify(this.id));
    this.router.navigate(['/hacerReservacion']);
  }
}
