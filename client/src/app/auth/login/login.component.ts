import { Component } from '@angular/core';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { AuthService } from "../auth.service";
import { catchError, Subject, takeUntil } from "rxjs";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  userNameFormControl = new FormControl('', [Validators.required]);
  passwordFormControl = new FormControl('', [Validators.required]);
  matcher = new MyErrorStateMatcher();

  hidePassword = true;
  private unsubscribe$ = new Subject();

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(0);
    this.unsubscribe$.complete();
  }

  login(): void {
    const username: string = <string>this.userNameFormControl.value;
    const password: string = <string>this.passwordFormControl.value;

    this.authService.login(username, password).pipe(
      catchError(err => {
        this.userNameFormControl.reset('');
        this.passwordFormControl.reset('');
        this.toastr.error('Login failed, try again', 'Error');
        return err;
      }),
      takeUntil(this.unsubscribe$)
    ).subscribe(res => {
      if (typeof res === 'object' && res !== null && 'userId' in res) {
        localStorage.setItem('loginUser', JSON.stringify(res));
        this.router.navigate(['/dashboard']);
      }
    })
  }
}
