import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostService } from '../../services/post.service';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { UseStateService } from '../../services/auth/use-state.service';
import { PopupService } from '../../services/utils/popup.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tienda',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './tienda.component.html',
  styleUrl: './tienda.component.scss'
})
export class TiendaComponent implements OnInit {
  posts: any[] = [];
  isLoading: boolean = true;
  error: string | null = null;
  currencyMap: { [key: string]: string } = {
    "USD": '$',
    "EUR": '€'
  };
  currentUserId: number | null = null;

  constructor(
    private postService: PostService,
    private router: Router,
    private cartService: CartService,
    private userStateService: UseStateService,
    private popupService: PopupService
  ) {
    try {
      this.currentUserId = this.userStateService.getUserId();
    } catch (error) {
      console.error('Error getting user ID:', error);
      this.currentUserId = null;
    }
  }

  ngOnInit(): void {
    this.fetchPosts();
  }

  fetchPosts(): void {
    this.isLoading = true;
    this.error = null;

    this.postService.getPosts().subscribe({
      next: (data) => {
        this.posts = data.map(post => ({
          ...post,
          likes: post.likes || 0,
          isLiked: false,
          showComments: false,
          comments: post.comments || [],
          newComment: ''
        }));
        
        // Check like status for each post if user is logged in
        if (this.currentUserId) {
          this.posts.forEach(post => {
            this.postService.checkIfLiked(post.id, this.currentUserId!).subscribe({
              next: (isLiked) => {
                post.isLiked = isLiked;
              },
              error: (err) => console.error('Error checking like status:', err)
            });
          });
        }
        
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to fetch products. Please try again later.';
        this.isLoading = false;
        console.error('Error fetching products:', err);
      },
    });
  }

  // toggleLike(post: any): void {
  //   if (!this.currentUserId) {
  //     this.popupService.showMessage('Error', 'Please login to like posts', 'error');
  //     return;
  //   }

  //   this.postService.toggleLike(post.id, this.currentUserId).subscribe({
  //     next: () => {
  //       post.isLiked = !post.isLiked;
  //       post.likes += post.isLiked ? 1 : -1;
  //     },
  //     error: (err) => {
  //       console.error('Error toggling like:', err);
  //       this.popupService.showMessage('Error', 'Failed to update like', 'error');
  //     }
  //   });
  // }

// tienda.component.ts
toggleLike(post: any): void {
  const username = this.userStateService.getUsername();
  if (!username) {
    this.popupService.showMessage('Error', 'Please login to like posts', 'error');
    return;
  }

  this.postService.toggleLike(post.id, username).subscribe({
    next: () => {
      post.isLiked = !post.isLiked;
      post.likes += post.isLiked ? 1 : -1;
    },
    error: (err) => {
      console.error('Error toggling like:', err);
      this.popupService.showMessage('Error', 'Failed to update like', 'error');
    }
  });
}

  toggleComments(post: any): void {
    post.showComments = !post.showComments;
    if (post.showComments && post.comments.length === 0) {
      this.postService.getComments(post.id).subscribe({
        next: (comments) => {
          post.comments = comments;
        },
        error: (err) => {
          console.error('Error loading comments:', err);
          this.popupService.showMessage('Error', 'Failed to load comments', 'error');
        }
      });
    }
  }

  addComment(post: any, commentText: string): void {
    if (!this.currentUserId) {
      this.popupService.showMessage('Error', 'Please login to comment', 'error');
      return;
    }
  
    if (commentText.trim()) {
      const commentData = {
        text: commentText,
        postId: post.id,
        userId: this.currentUserId
      };
  
      this.postService.addComment(commentData).subscribe({
        next: (newComment) => {
          post.comments.unshift(newComment);
          post.newComment = '';
        },
        error: (err) => {
          console.error('Error adding comment:', err);
          this.popupService.showMessage('Error', 'Failed to add comment', 'error');
        }
      });
    }
  }

  viewPost(post: any): void {
    const userRole = this.userStateService.getRole();
    let routePrefix = '';
    
    switch(userRole) {
      case 'STUDENT': routePrefix = 'client'; break;
      case 'ADMIN': routePrefix = 'admin'; break;
      case 'TEACHER': routePrefix = 'seller'; break;
      default: 
        console.error('Invalid user role');
        this.popupService.showMessage('Error', 'Invalid user role', 'error');
        return;
    }
    
    this.router.navigate([`${routePrefix}/ver-productos`, post.id]);
  }

  addToCart(post: any): void {
    this.cartService.addToCart(post);
    this.popupService.showMessage('Added to Cart', `${post.name} added to your cart`, 'success');
  }
}