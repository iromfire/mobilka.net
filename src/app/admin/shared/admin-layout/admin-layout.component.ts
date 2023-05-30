import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../user/shared/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
})
export class AdminLayoutComponent implements OnInit {
  constructor(private service: AuthService) {}

  ngOnInit(): void {}

  get isAuth(): boolean {
    return this.service.isAuthenticated();
  }

  logout(): void {
    this.service.logout();
  }
}
