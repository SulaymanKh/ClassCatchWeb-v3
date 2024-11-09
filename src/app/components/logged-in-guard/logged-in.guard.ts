import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard  {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const authToken = localStorage.getItem('authToken');
    
    // If authToken exists, allow access to the route
    if (authToken) {
      return true;
    }
    
    // If not logged in, redirect to the login page
    this.router.navigate(['/signin']);
    return false;
  }
  
}
