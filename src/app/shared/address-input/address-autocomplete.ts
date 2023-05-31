import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-address-autocomplete',
  template: `
    <input [(ngModel)]="selectedAddress" [typeahead]="addressSearch" [typeaheadMinLength]="3" [typeaheadWaitMs]="300" class="form-control">
  `
})
export class AddressAutocompleteComponent {
  selectedAddress!: string;
  addressSearch: any = (text$: Observable<string>) =>
    text$.pipe(
      map(term => term === '' ? []
        : this.http.get(`https://nominatim.openstreetmap.org/search?q=${term}&format=json&addressdetails=1&limit=10`)
          .pipe(
            map((response: any) => response.map((result: any) => result.display_name))
          ))
    );

  constructor(private http: HttpClient) {}
}
