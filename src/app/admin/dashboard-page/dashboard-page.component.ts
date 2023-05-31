import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../shared/services/product.service';
import { DeleteDialogComponent } from '../../shared/dialogs/delete-dialog/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
})
export class DashboardPageComponent implements OnInit {
  products = this.productServ.products;
  productName!: string;
  constructor(private productServ: ProductService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.productServ.getAll();
  }

  remove(id: any): void {
    let dialog = this.dialog.open(DeleteDialogComponent);
    dialog.afterClosed().subscribe((result) => {
      if (result == 'Да') {
        this.productServ.remove(id);
      }
    });
  }
}
