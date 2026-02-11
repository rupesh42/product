import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindProduct } from './find-product';

describe('FindProduct', () => {
  let component: FindProduct;
  let fixture: ComponentFixture<FindProduct>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindProduct]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FindProduct);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
