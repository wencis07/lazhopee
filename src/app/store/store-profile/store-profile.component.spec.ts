import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreProfileComponent } from './store-profile.component';

describe('StoreProfileComponent', () => {
  let component: StoreProfileComponent;
  let fixture: ComponentFixture<StoreProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StoreProfileComponent]
    });
    fixture = TestBed.createComponent(StoreProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
