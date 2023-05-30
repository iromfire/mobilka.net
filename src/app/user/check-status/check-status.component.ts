import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-check-status',
  templateUrl: './check-status.component.html',
  styleUrls: ['./check-status.component.scss'],
})
export class CheckStatusComponent implements OnInit {
  formGroup: FormGroup;
  checkSubmit: boolean = false;
  errorExist = false;
  id: string = '';
  status!: any;

  constructor() {
    this.formGroup = new FormGroup({
      orderNumber: new FormControl(''),
    });
  }

  ngOnInit(): void {}

  check(): void {
    // this.checkSubmit = true;
    // // const phone = this.formGroup.get('phone')!.value;
    // const phone = '9195065422';
    // this.db
    //   .list('orders', (ref: any) => ref.orderByChild('phone').equalTo(phone))
    //   .valueChanges()
    //   .subscribe((orders: any[]) => {
    //     if (orders.length > 0) {
    //       const orderId = Object.keys(orders[0])[6];
    //       this.status = orders[0][orderId];
    //       console.log(this.status);
    //     } else {
    //       this.errorExist = true;
    //     }
    //   });
  }
}
