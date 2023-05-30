import { Component, OnInit } from '@angular/core';
import { Order } from '../shared/interfaces/interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success-order',
  templateUrl: './success-order.component.html',
  styleUrls: ['./success-order.component.scss'],
})
export class SuccessOrderComponent implements OnInit {
  order!: Order;
  constructor(private router: Router) {
    this.order = router.getCurrentNavigation()!.extras.state as Order;
  }

  ngOnInit(): void {}
}
