import { Component, OnDestroy, OnInit } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { Subject, takeUntil } from "rxjs";
import { Router } from "@angular/router";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  userName = '';
  userId = '';

  private unsubscribe$ = new Subject();

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
    const user = JSON.parse(<string>localStorage.getItem('loginUser'));
    this.userName = user.userName;
    this.userId = user.userId;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(0);
    this.unsubscribe$.complete();
  }

  logout(): void {
    this.authService.logout().pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(res => {
      console.log('res', res)
      if (res.status === 'SUCCESS') {
        localStorage.removeItem('loginUser');
        this.router.navigate(['/login']);
      }
    });
  }
}
