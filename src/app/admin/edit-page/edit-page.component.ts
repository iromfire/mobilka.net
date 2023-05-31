import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../shared/interfaces/interfaces';
import { ProductService } from '../../shared/services/product.service';
import { switchMap } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from '../../shared/services/notifier.service';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss'],
})
export class EditPageComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private productServ: ProductService,
    private notifierService: NotifierService
  ) {}

  formGroup!: FormGroup;
  product!: Product;
  photo!: string;

  submitted = false;
  photoUploaded = false;

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((params) => {
          return this.productServ.getById(params['id']);
        })
      )
      .subscribe((product) => {
        this.product = product;
        this.formGroup = new FormGroup({
          title: new FormControl(this.product.title, Validators.required),
          photo: new FormControl(this.product.photo),
          info: new FormControl(this.product.info, Validators.required),
          price: new FormControl(this.product.price, Validators.required),
        });
      });
  }

  processFile($event: any): void {
    const file: File = $event.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      this.photo = event.target.result;
      this.photoUploaded = true;
    });
    reader.readAsDataURL(file);
  }

  submit(): void {
    if (this.formGroup.invalid) {
      return;
    }
    this.submitted = true;
    this.productServ
      .update({
        ...this.product,
        title: this.formGroup.value.title,
        photo: this.photo,
        info: this.formGroup.value.info,
        price: this.formGroup.value.price,
        date: new Date(),
      })
      .subscribe(() => {
        this.submitted = false;
        this.notifierService.showNotification('Данные изменены', 'Ок');
      });
  }
}
