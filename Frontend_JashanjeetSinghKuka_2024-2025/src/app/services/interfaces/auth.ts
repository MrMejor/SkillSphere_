export interface UserInterface {

  username: string;
  password: string;
  // roleName: "ADMIN" | "CLIENT" | "SELLER";
  roleName: "ADMIN" | "STUDENT" | "TEACHER";
  firstName: string;
  lastName: string;
  address: string;

}


export type LoginInterface = Pick<UserInterface, "username" | "password">



// export type LoginInterface2 = Omit<UserInterface, "address" | "firstName" | "lastName" | "roleName">
//
// export interface LoginInterface3 extends UserInterface {
//   email: string;
// }

export interface CommentInterface {
  id?: number;          // Optional for new comments
  text: string;
  postId: number;
  userId: number;
  username?: string;    // Optional - might come from backend
  createdAt?: string;   // Optional - set by backend
}

// For creating new comments
export type CreateCommentInterface = Pick<CommentInterface, "text" | "postId" | "userId">;

// For API responses
export interface CommentResponseInterface extends CommentInterface {
  id: number;           // Now required
  createdAt: string;    // Now required
  username: string;     // Now required
}