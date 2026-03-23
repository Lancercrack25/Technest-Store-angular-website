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

//esto es solo para lo del usuario y su perfil 