import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, tap, switchMap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = 'https://localhost:5002/api/ClassCatch/Account';
  currentUser: any;

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<boolean> {
    return this.http.post<any>(`${this.authUrl}/signin`, { username, password }).pipe(
      switchMap(response => {
        if (!response.isError) {
          localStorage.setItem('authToken', response.data);
          return this.fetchUserInfo().pipe(
            map(user => !!user)
          );
        } else {
          throw new Error(response.information);
        }
      }),
      catchError(error => {
        console.error('Login error', error);
        return of(false);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.currentUser = null;
    this.router.navigate(['/signin']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  isTokenExpired(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      const expirationTime = decoded.exp * 1000;
      return Date.now() > expirationTime;
    } catch (error) {
      console.error('Error decoding token', error);
      return true;
    }
  }

  fetchUserInfo(): Observable<any> {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      return of(null);  
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    });

    return this.http.get<any>(`${this.authUrl}/user-information`, { headers }).pipe(
      tap(response => {
        if (!response.isError) {
          this.currentUser = response.data;
        }
      }),
      catchError(error => {
        console.error('Error fetching user information', error);
        return of(null);
      })
    );
  }

  getCurrentUser(): any {
    return this.currentUser;
  }

  getToken(): any {
    const authToken = localStorage.getItem('authToken');
    return authToken;
  }

  getUserRole(): string {
    return this.currentUser?.role;
  }

  isStudent(): boolean {
    return this.currentUser?.role.toLowerCase() === 'student';
  }

  isTutor(): boolean {
    return this.currentUser?.role.toLowerCase() === 'tutor';
  }
}
