import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CommentInterface, CreateCommentInterface } from '../../app/services/interfaces/auth';
import { TokenService } from './auth/token.service'; 

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = `${environment.apiUrl}/posts`;
  private likeUrl = `${environment.apiUrl}/api/likes`;
  private commentUrl = `${environment.apiUrl}/api/comments`;

  constructor(private http: HttpClient,
    private tokenService: TokenService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Post CRUD Operations
  addPost(post: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, post, { 
      headers: this.getHeaders(),
      responseType: 'text' 
    });
  }

  getPostsByUser(username: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${username}`, { 
      headers: this.getHeaders() 
    });
  }

  getPosts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getPostById(postId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${postId}`);
  }

  deletePost(postId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${postId}`, { 
      headers: this.getHeaders(),
      responseType: 'text' 
    });
  }

  // Like Operations
  // toggleLike(postId: number, userId: number): Observable<any> {
  //   return this.http.post(`${this.likeUrl}`, { postId, userId }, {
  //     headers: this.getHeaders()
  //   });
  // }


// toggleLike(postId: number, username: string): Observable<any> {
//   const token = this.tokenService.getAccessToken();
//   return this.http.post(
//     `${environment.apiUrl}/likes`,
//     { postId, username },  // Send username instead of userId
//     {
//       headers: new HttpHeaders({
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       })
//     }
//   );
// }

  // post.service.ts
toggleLike(postId: number, username: string): Observable<any> {
  return this.http.post(
    `${this.likeUrl}`, // Now points to /api/likes
    { postId, username },
    { headers: this.getHeaders() }
  );
}
  
  getLikeCount(postId: number): Observable<number> {
    return this.http.get<number>(`${this.likeUrl}/count/${postId}`);
  }

  checkIfLiked(postId: number, username: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.likeUrl}/check/${postId}/${username}`, { 
      headers: this.getHeaders() 
    });
  }

  // Comment Operations
  getComments(postId: number): Observable<CommentInterface[]> {
    return this.http.get<CommentInterface[]>(
      `${environment.apiUrl}/api/comments/post/${postId}`
    );
  }

  addComment(commentData: CreateCommentInterface): Observable<CommentInterface> {
    return this.http.post<CommentInterface>(
      `${environment.apiUrl}/api/comments`,
      commentData,
      { headers: this.getHeaders() }
    );
  }
}