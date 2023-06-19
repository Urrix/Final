import { Injectable } from '@angular/core';
import {
  Firestore,
  collectionData
} from '@angular/fire/firestore';
import {
  collection,
  addDoc,
  doc,
  deleteDoc
} from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';
import Reservacion from './reservacion.interface';

@Injectable({
  providedIn: 'root'
})
export class ReservacionesService {

  reservaciones: Reservacion[] = [];

  constructor(private firestore: Firestore) { }

  //Metodos de Firestore
  anadirReservacion(reservacion: Reservacion, casa: string) {
    const reservacionesRef = collection(this.firestore, casa);
    return addDoc(reservacionesRef, reservacion);
  }

  obtenerReservaciones(casa: string): Observable<Reservacion[]> {
    const reservacionesRef = collection(this.firestore, casa);
    return collectionData(reservacionesRef, { idField: 'id' }) as Observable<Reservacion[]>;
  }

  borrarReservacion(reservacion: Reservacion, casa: string) {
    const reservacionRef = doc(this.firestore, `${casa}/${reservacion.id}`);
    return deleteDoc(reservacionRef);
  }

  fechasOcupadas(casa: string): Date[] {
    let fechas: Date[] = [];
    this.obtenerReservaciones(casa).subscribe(resrvs => {
      console.log(resrvs);
      this.reservaciones = resrvs;
    })
    if (this.reservaciones != null) {
      for (let i of this.reservaciones) {
        let checkin = new Date(i.checkin);
        while (checkin <= i.checkout) {
          fechas.push(new Date(checkin));
          checkin.setDate(checkin.getDate() + 1);
        }
      }
    }
    return fechas;
  }

}
