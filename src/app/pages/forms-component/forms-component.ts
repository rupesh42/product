import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-forms-component',
  imports: [ReactiveFormsModule],
  templateUrl: './forms-component.html',
  styleUrl: './forms-component.scss',
})
export class FormsComponent {
  private fb = inject(FormBuilder);

  // Part 1: Initialize the Root Group
  productForm = this.fb.group({
    productName: ['', Validators.required],
    // Part 2: Initialize the Array
    specs: this.fb.array([]),
  });

  // Part 3: Create a Getter for the Template
  get specs() {
    return this.productForm.get('specs') as FormArray;
  }

  // Helper: Create a new Group for each row
  addSpec() {
    const specGroup = this.fb.group({
      name: ['', Validators.required],
      value: ['', Validators.required],
    });
    this.specs.push(specGroup);
  }

  removeSpec(index: number) {
    this.specs.removeAt(index);
  }

  onSubmit() {
    console.log(this.productForm.value); // This is what you send to API
  }
}
