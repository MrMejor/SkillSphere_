import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddPostModalComponent } from '../add-post-modal/add-post-modal.component';
import { PostService } from '../../services/post.service';
import { UseStateService } from '../../services/auth/use-state.service';
import { CommonModule } from '@angular/common';
import { PopupService } from '../../services/utils/popup.service';

@Component({
  selector: 'app-add-post',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.scss']
})
export class AddPostComponent {
  existingPosts: any[] = [];

    currencyMap: { [key: string]: string } = {
      USD: 'USD',
      EUR: 'EUR',
    };

  constructor(
    private modalService: NgbModal, 
    private postService: PostService,
    private useStateService: UseStateService,
    private popupService: PopupService
  ) {}

  openAddPostModal() {
    const modalRef = this.modalService.open(AddPostModalComponent, { size: 'lg', backdrop: 'static', keyboard: false });
  
    modalRef.result.then((post) => {
      if (post) {
        console.log('New product added:', post);
        this.fetchExistingPosts(); // Refresh product list
      }
    }).catch(() => {
      console.log('Modal closed without saving');
    });
  }
  
  ngOnInit(): void {
    this.fetchExistingPosts(); // Fetch existing posts when the component initializes
  }

  fetchExistingPosts() {
    const username = this.useStateService.getUsername();
    if (username) {
      this.postService.getPostsByUser(username).subscribe(
        (response) => {
          console.log('Posts fetched:', response); // Log the response
          this.existingPosts = response;
        },
        (error) => {
          console.error('Error fetching posts:', error);
        }
      );
    }
  }

  // add-producto.component.ts

deletePost(postId: string) {
  this.postService.deletePost(postId).subscribe(
    (response) => {
      console.log('Post deleted:', response);
      this.fetchExistingPosts(); // Refresh the product list after deletion
    },
    (error) => {
      console.error('Error deleting product:', error);
    }
  );
}
  
deletePostWithConfirmation(postId: string): void {
  this.popupService
    .showConfirmationWithActions(
      'Eliminar producto',
      '¿Estás seguro de que deseas eliminar este producto?'
    )
    .then((confirmed) => {
      if (confirmed) {
        // User clicked "Seguro"
        this.popupService.loader('Eliminando producto', 'Por favor espera...');

        // Call the product service to delete the product
        this.postService.deletePost(postId).subscribe(
          (response) => {
            console.log('Product deleted:', response);
            this.popupService.close();
            this.fetchExistingPosts();
          },
          (error) => {
            console.error('Error deleting post:', error);
            this.popupService.close();
            this.popupService.showMessage('Error', 'No se pudo eliminar el Post.'); // Show error message
          }
        );
      } else {
        // User clicked "Cancelar"
        console.log('Post deletion canceled.'); 
      }
    });
}
}
