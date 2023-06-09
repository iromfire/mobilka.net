import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../shared/interfaces/interfaces';
import { ProductService } from '../../shared/services/product.service';
import { switchMap } from 'rxjs/operators';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NotifierService } from '../../shared/services/notifier.service';

import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss'],
})
export class EditPageComponent implements OnInit {
  public Editor = ClassicEditor;
  formGroup!: FormGroup;
  product!: Product;
  photo!: string;

  submitted = false;
  photoUploaded = false;

  sub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private productServ: ProductService,
    private notifierService: NotifierService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.formGroup = new FormGroup({
      title: new FormControl('', Validators.required),
      photo: new FormControl(''),
      info: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
      quantityStock: new FormControl('', [
        Validators.required,
        Validators.min(0),
      ]),
    });
  }

  ngOnInit(): void {
    this.sub = this.route.params
      .pipe(
        switchMap((params) => {
          return this.productServ.getById(params['id']);
        })
      )
      .subscribe((product: Product) => {
        this.product = product;
        this.formGroup.setValue({
          title: product.title,
          photo: product.photo,
          info: product.info,
          price: product.price,
          quantityStock: product.quantityStock,
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
        quantityStock: this.formGroup.value.quantityStock,
      })
      .subscribe(() => {
        this.submitted = false;
        this.notifierService.showNotification('Данные изменены', 'Ок');
        this.router
          .navigate(['admin/dashboard'])
          .then(() => this.sub.unsubscribe());
      });
  }
}
