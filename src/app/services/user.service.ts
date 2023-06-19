import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  deleteUser
} from '@angular/fire/auth';
import { onAuthStateChanged } from '@angular/fire/auth';
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
import { Router } from '@angular/router';
import User from './user.interface';
import { FormControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  usuario!: User;
  usuarios!: User[];
  form!: FormGroup;

  constructor(
    private auth: Auth,
    private router: Router,
    private firestore: Firestore
  ) { }

  //Metodos para usar en componentes
  iniciarSesion(email: string, password: string, google: Boolean) {
    if (google) {

    } else {
      this.ingresoAuth({ email, password })
        .then(response => {
          if (response != null) {
            console.log(response);
            this.consultaUsuarioFs().subscribe(users => {
              this.usuarios = users;
            });
            for (let i of this.usuarios) {
              if (email == i.correo) {
                this.usuario = i;
              }
            }
            localStorage.removeItem("usuarioActual");
            localStorage.setItem("usuarioActual", JSON.stringify(this.usuario));
          }
        })
        .catch(error => console.log(error));
    }
  }

  registrarUsuario(usuario: User, google: Boolean) {
    if (google) {

    } else {
      let email = usuario.correo;
      let password = usuario.contrasena;
      this.registroAuth({ email, password })
        .then(response => {
          if (response != null) {
            console.log("lograo papi");
            this.form = new FormGroup({
              nombre: new FormControl(usuario.nombre),
              apellido: new FormControl(usuario.apellido),
              correo: new FormControl(usuario.correo),
              telefono: new FormControl(usuario.telefono),
              contrasena: new FormControl(usuario.contrasena),
              nacimiento: new FormControl(usuario.nacimiento)
            })
            this.usuario = usuario;
            console.log(response);
            const resp = this.nuevoUsuarioFs(this.form.value);
            console.log(resp);
            localStorage.removeItem("usuarioActual");
            localStorage.setItem("usuarioActual", JSON.stringify(this.usuario));
          }
        })
        .catch(error => {
          console.log(error)
          if (error != null) {
            console.log("hay error")
          }
        });
    }
  }

  cerrarSesion() {
    this.cerrarAuth();
    localStorage.removeItem("usuarioActual");
  }

  //no funciona
  borrarUsuario(usuario: User) {
    let email = usuario.correo;
    this.cerrarSesion();
    this.borrarAuth(email)
      .then(response => {
        console.log(response);
        this.borrarUsuarioFs(usuario);
      })
      .catch(error => {
        console.log(error);
      })
  }

  //Metodos de Firebase Authentication
  mostrarAuth(): string {
    return String(this.auth.currentUser?.email);
  }

  registroAuth({ email, password }: any) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  ingresoAuth({ email, password }: any) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  cerrarAuth() {
    return signOut(this.auth);
  }

  borrarAuth({ email }: any) {
    return deleteUser(email);
  }

  sesionAuth(user: UserService) {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.router.navigate(['/logout']);
      } else {

      }
    })
  }

  ingresoGoogleAuth() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  //Metodos de Firestore
  nuevoUsuarioFs(usuario: User) {
    const usarioRef = collection(this.firestore, 'usuarios');
    return addDoc(usarioRef, usuario);
  }

  consultaUsuarioFs(): Observable<User[]> {
    const usuarioRef = collection(this.firestore, 'usuarios');
    return collectionData(usuarioRef, { idField: 'id' }) as Observable<User[]>;
  }

  borrarUsuarioFs(usuario: User) {
    const usuarioRef = doc(this.firestore, `usuarios/${usuario.id}`);
    return deleteDoc(usuarioRef);

  }

  validarUsuario(correo: string): Boolean {

    this.consultaUsuarioFs().subscribe(users => {
      this.usuarios = users;
    })
    if (this.usuarios != null) {
      for (let i of this.usuarios) {
        if (i.correo == correo) {
          return false;
        }
      }
      return true;
    } else {
      return true
    }
  }

}
