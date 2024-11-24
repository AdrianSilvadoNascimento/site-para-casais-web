import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { UserModel } from '../models/user.model';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { RegisterUserModel } from '../models/register-user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl: string = `${environment.apiUrl}/user`
  private readonly qrCodeApiUrl: string = `${environment.qrCodeApiUrl}${environment.domain}`

  private userData = new BehaviorSubject<UserModel>(new UserModel())
  $userData = this.userData.asObservable()

  readonly token: string | null = localStorage.getItem('token')
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${this.token}`
  })

  constructor(private http: HttpClient, private router: Router) { }

  updateUserData(userData: UserModel): void {
    this.userData.next(userData)
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('token') !== null;
  }

  loginUser(userData: UserModel): Observable<UserModel> {
    return this.http.post<UserModel>(`${this.apiUrl}/login-user`, userData).pipe(
      tap((res: any) => {
        this.setCache(res)
        this.updateUserData(res.userData)
      })
    )
  }

  registerUser(userData: RegisterUserModel): Observable<UserModel> {
    return this.http.post<UserModel>(`${this.apiUrl}/register-user`, userData).pipe(
      tap(() => {
        this.router.navigate(['/entrar'])
      })
    )
  }

  updateUser(userData: UserModel): Observable<UserModel> {
    const currentUserId = localStorage.getItem('user_id')?.toString()!!
    return this.http.put<UserModel>(`${this.apiUrl}/update-user/${currentUserId}`, userData, { headers: this.headers }).pipe(
      tap(res => {
        this.updateUserData(res)
        localStorage.setItem('currentUser', JSON.stringify(res))
      })
    )
  }

  getUser(userId: string): Observable<UserModel> {
    return this.http.get<any>(`${this.apiUrl}/get-user/${userId}`).pipe(
      tap(res => {
        localStorage.setItem('currentUser', JSON.stringify(res))
      })
    )
  }

  checkout(): void {
    localStorage.removeItem('token')
    localStorage.removeItem('expiresIn')
    localStorage.removeItem('user_id')
    localStorage.removeItem('currentUser')

    this.router.navigate(['/entrar'])
  }

  private setCache(data: any): void {
    localStorage.setItem('token', data.token)
    localStorage.setItem('expiresIn', data.expiresIn)
    localStorage.setItem('user_id', data.userData.id)
    localStorage.setItem('currentUser', JSON.stringify(data.userData))
  }
}
