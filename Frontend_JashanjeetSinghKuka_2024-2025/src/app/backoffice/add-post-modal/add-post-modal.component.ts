import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PostService } from '../../services/post.service';
import { CommonModule } from '@angular/common';
import { UseStateService } from '../../services/auth/use-state.service';
import { PopupService } from '../../services/utils/popup.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-post-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './add-post-modal.component.html',
  styleUrls: ['./add-post-modal.component.scss']
})
export class AddPostModalComponent implements OnInit {
  postForm!: FormGroup;
  username: string | null = null;
  isFree: boolean = true; // Default to free post

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    public activeModal: NgbActiveModal,
    private useStateService: UseStateService,
    private popupService: PopupService
  ) {}

  ngOnInit(): void {
    this.username = this.useStateService.getUsername();
    if (!this.username) {
      console.error('Username not found in session storage.');
      return;
    }
    this.initializeForm();
  }

  initializeForm() {
    this.postForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      image: ['', Validators.required],
      price: [{value: null, disabled: true}],
      currency: [{value: null, disabled: true}],
      username: [this.username, Validators.required]
    });
  }

  togglePricing() {
    this.isFree = !this.isFree;
    if (this.isFree) {
      this.postForm.get('price')?.disable();
      this.postForm.get('currency')?.disable();
      this.postForm.patchValue({
        price: null,
        currency: null
      });
    } else {
      this.postForm.get('price')?.enable();
      this.postForm.get('currency')?.enable();
      this.postForm.get('price')?.setValidators([Validators.required, Validators.min(0)]);
      this.postForm.get('currency')?.setValidators([Validators.required]);
    }
    this.postForm.get('price')?.updateValueAndValidity();
    this.postForm.get('currency')?.updateValueAndValidity();
  }

  submit() {
    if (this.postForm.invalid) return;
    
    const postData = this.postForm.value;
    
    // Ensure price/currency are null for free posts
    if (this.isFree) {
      postData.price = null;
      postData.currency = null;
    }

    this.popupService.loader("Guardando producto...", "Espere un momento");
  
    this.postService.addPost(postData).subscribe({
      next: (response) => {
        this.popupService.close();
        this.popupService.showMessage('Éxito', 'Producto agregado exitosamente', 'success');
        setTimeout(() => this.activeModal.close(postData), 2000);
      },
      error: (error) => {
        this.popupService.close();
        let message = this.getErrorMessage(error.status);
        this.popupService.showMessage('Error', message, 'error');
      }
    });
  }

  private getErrorMessage(status: number): string {
    switch(status) {
      case 401: return "No autorizado. Por favor, inicie sesión nuevamente.";
      case 400: return "Datos inválidos. Revise los campos e inténtelo de nuevo.";
      default: return "Ocurrió un error inesperado. Inténtelo de nuevo más tarde.";
    }
  }

  dismiss() {
    this.activeModal.dismiss('Closed without saving');
  }
}