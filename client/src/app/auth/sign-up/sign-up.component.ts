import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators
} from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import { AuthService } from "../auth.service";
import { AuthData } from "../auth.model";
import { Subject, takeUntil } from "rxjs";
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  matcher = new MyErrorStateMatcher();

  hidePassword = true;
  hideRepeatedPassword = true;
  private readonly defaultRole = 'user';
  private unsubscribe$ = new Subject();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      repeatPassword: ['', [Validators.required, Validators.minLength(8)]],
      email: ['', [Validators.required, Validators.email]],
      invitationCode: ['', []]
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(0);
    this.unsubscribe$.complete();
  }

  get mismatchPassword(): boolean {
    return !!this.form.get('repeatPassword')?.valid && !!this.form.get('password')?.valid
      && this.form.get('password')?.value !== this.form.get('repeatPassword')?.value;
  }

  signUp(): void {
    const username = this.form.get('userName')?.value;
    const password = this.form.get('password')?.value;
    const email = this.form.get('email')?.value;
    const invitationCode = this.form.get('invitationCode')?.value;
    const authData: AuthData = {
      username,
      password,
      email,
      role: this.defaultRole,
      invitationCode
    }

    console.log(authData);

    this.authService.signUp(authData).pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(res => {
      if (res?.username) {
        this.toastr.success('You have successfully signed up', 'Success');
        this.router.navigate(['login']);
      } else {
        this.toastr.error(' Sign up failed', 'Error');
      }
    });
  }
}
