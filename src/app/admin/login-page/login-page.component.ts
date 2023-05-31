import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { NotifierService } from '../../shared/services/notifier.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {
  form!: FormGroup;
  errorExist = false;
  submitted = false;
  checkShown = true;

  constructor(
    public auth: AuthService,
    private router: Router,
    private notifierService: NotifierService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
  }

  showNotification(): void {
    if (this.checkShown) {
      this.notifierService.showNotification(
        'Ошибка при авторизации, неправильный логин или пароль',
        'OK'
      );
    }
    this.checkShown = false;
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    this.submitted = true;

    const user = {
      email: this.form.value.email,
      password: this.form.value.password,
      returnSecureToken: true,
    };

    this.auth.login(user).subscribe(
      () => {
        this.form.reset();
        this.router.navigate(['/admin', 'orders']).then();
        this.submitted = false;
      },
      (error) => {
        if (error) {
          this.errorExist = true;
          this.submitted = false;
          this.checkShown = true;
        }
      }
    );
  }
}
