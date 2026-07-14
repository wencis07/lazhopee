import { Component, OnInit } from '@angular/core';
import { StoreService } from '../store.service';

@Component({
  selector: 'app-store-settings',
  templateUrl: './store-settings.component.html',
  styleUrls: ['./store-settings.component.css']
})
export class StoreSettingsComponent implements OnInit {

  storeName = '';
  successMessage = '';
  errorMessage = '';

  constructor(private storeService: StoreService) {}

  ngOnInit(): void {
    this.loadStore();
  }

  loadStore() {
    this.storeService.getMyStore().subscribe({
      next: (store: any) => {
        this.storeName = store.name;
      }
    });
  }

  save(): void {

  console.log('Save button clicked');

  this.storeService.updateStore({
    name: this.storeName
  }).subscribe({

    next: (res) => {
      console.log('SUCCESS', res);

      this.successMessage = 'Store updated successfully!';
      this.errorMessage = '';
    },

    error: (err) => {
      console.error('ERROR', err);

      this.errorMessage = err.error.message || 'Update failed';
    }

  });

}
}