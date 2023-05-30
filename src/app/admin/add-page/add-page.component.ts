import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../user/shared/services/product.service';
import { NotifierService } from '../../user/shared/services/notifier.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-page',
  templateUrl: './add-page.component.html',
  styleUrls: ['./add-page.component.scss'],
})
export class AddPageComponent implements OnInit {
  form!: FormGroup;
  photo!: string;

  submitted = false;
  photoLoaded = false;

  constructor(
    private productServ: ProductService,
    private notifierService: NotifierService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, Validators.required),
      photo: new FormControl(),
      info: new FormControl(null, Validators.required),
      price: new FormControl(null, Validators.required),
    });
  }

  processFile($event: any): void {
    const file: File = $event.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      this.photo = event.target.result;
      this.photoLoaded = true;
    });
    reader.readAsDataURL(file);
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    this.submitted = true;
    const product = {
      title: this.form.value.title,
      photo: this.photo,
      info: this.form.value.info,
      price: this.form.value.price,
      date: new Date(),
    };
    this.productServ.create(product).subscribe(() => {
      this.notifierService.showNotification('Товар успешно добавлен', 'Ок');
      this.router.navigate(['admin/dashboard']);
    });
  }
}
