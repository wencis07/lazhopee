import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  activeTab: 'stores' | 'users' | 'categories' = 'stores';

  stores: any[] = [];
  users: any[] = [];
  categories: any[] = [];

  newCategoryName = '';

  // For assigning categories to a store
  editingStoreId: string | null = null;
  selectedCategories: string[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadStores();
    this.loadUsers();
    this.loadCategories();
  }

  switchTab(tab: 'stores' | 'users' | 'categories'): void {
    this.activeTab = tab;
  }

  loadStores(): void {
    this.adminService.getStores().subscribe(data => this.stores = data);
  }

  loadUsers(): void {
    this.adminService.getUsers().subscribe(data => this.users = data);
  }

  loadCategories(): void {
    this.adminService.getCategories().subscribe(data => this.categories = data);
  }

  approveStore(id: string): void {
    this.adminService.approveStore(id).subscribe(() => this.loadStores());
  }

  toggleStoreStatus(store: any): void {
    const action = store.isActive ? this.adminService.deactivateStore(store._id) : this.adminService.activateStore(store._id);
    action.subscribe(() => this.loadStores());
  }

  toggleUserStatus(user: any): void {
    const action = user.isActive ? this.adminService.deactivateUser(user._id) : this.adminService.activateUser(user._id);
    action.subscribe(() => this.loadUsers());
  }

  openCategoryAssign(store: any): void {
    this.editingStoreId = store._id;
    this.selectedCategories = [...(store.allowedCategories || [])];
  }

  toggleCategorySelection(catName: string): void {
    if (this.selectedCategories.includes(catName)) {
      this.selectedCategories = this.selectedCategories.filter(c => c !== catName);
    } else {
      this.selectedCategories.push(catName);
    }
  }

  saveCategoryAssignment(): void {
    if (!this.editingStoreId) return;
    this.adminService.assignCategories(this.editingStoreId, this.selectedCategories).subscribe(() => {
      this.editingStoreId = null;
      this.loadStores();
    });
  }

  cancelCategoryAssign(): void {
    this.editingStoreId = null;
  }

  addCategory(): void {
    if (!this.newCategoryName.trim()) return;
    this.adminService.addCategory(this.newCategoryName).subscribe(() => {
      this.newCategoryName = '';
      this.loadCategories();
    });
  }

  deleteCategory(id: string): void {
    if (confirm('Delete this category?')) {
      this.adminService.deleteCategory(id).subscribe(() => this.loadCategories());
    }
  }
}