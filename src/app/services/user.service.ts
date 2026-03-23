import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  setUser(user: any) {
    this.userSubject.next(user);
    localStorage.setItem('cliente', JSON.stringify(user));
  }

  getUser() {
    const data = localStorage.getItem('cliente');
    return data ? JSON.parse(data) : null;
  }

  clearUser() {
    this.userSubject.next(null);
    localStorage.clear();
  }
}
//servicio global de angular para manejar el estado del usuario en toda la aplicación, especialmente útil para el perfil del cliente
//no modifica nada en el backend, solo es para manejar el estado del usuario en el frontend y sincronizarlo con el backend cuando se cargue el perfil o se actualicen los datos