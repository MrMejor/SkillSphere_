/**
 * Author: jashanjeetsingh
 * Created on 12/3/25 at 23:06
 * What we did in this class :-
 * // The changes are:
 */
package com.tienda.app.services;

import com.tienda.app.models.Post;
import com.tienda.app.dtos.auth.AddPostRequest;
import com.tienda.app.dtos.auth.GetPostRequest;
import com.tienda.app.models.User;
import com.tienda.app.repositories.PostRepository;
import com.tienda.app.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostService
{

  private final PostRepository postRepository;
  private final UserRepository userRepository;

  public PostService( PostRepository postRepository , UserRepository userRepository )
  {
    this.postRepository = postRepository;
    this.userRepository = userRepository;
  }

  // Fetch products by user (seller)
//  public List< Product > getProductsByUser( String username )
//  {
//    return productRepository.findBySellerUsername( username );
//  }

  // Fetch products by user (seller) and return as DTOs
  public List<GetPostRequest> getPostsByUser(String username) {
//    List< Post > posts = postRepository.findBySellerUsername(username); // Fetch products by seller username
    List< Post > posts = postRepository.findBySellerUsernameOrderByCreatedAtDesc(username); // Fetch products by seller username
    return posts.stream()
        .map(this::mapToGetPostRequest) // Map each Product to GetProductRequest
        .collect( Collectors.toList()); // Collect into a List<GetProductRequest>
  }

  public void savePost( AddPostRequest request) {

    User user = this.userRepository.findByUsername(request.getUsername()).orElseThrow( () -> new IllegalArgumentException( "User Not Found" ) );

    Post post = new Post();
    post.setName(request.getName());
    post.setDescription(request.getDescription());
    post.setImage(request.getImage());
//    post.setTax(request.getTax());
//    post.setPrice(request.getPrice());
//    post.setCurrency(request.getCurrency());


    if (request.getPrice() != null) {
      if (request.getCurrency() == null) {
        throw new IllegalArgumentException("Currency is required when price is specified");
      }
      post.setPrice(request.getPrice());
      post.setCurrency(request.getCurrency());
    } else {
      post.setPrice(null);
      post.setCurrency(null);
    }
    post.setSeller( user );
    postRepository.save(post); // Save product in DB
  }

  // Map Product entity to GetProductRequest DTO
  public GetPostRequest mapToGetPostRequest(Post post) {
    GetPostRequest dto = new GetPostRequest();
    dto.setId(post.getId());
    dto.setName(post.getName());
    dto.setDescription(post.getDescription());
    dto.setPrice(post.getPrice());
    dto.setSellerUsername(post.getSeller().getUsername()); // Add seller's username
    dto.setImage(post.getImage());
    dto.setCurrency(post.getCurrency());
    return dto;
  }

  // ProductService.java
  public List<GetPostRequest> getAllPosts() {
    List<Post> posts = postRepository.findAllByOrderByCreatedAtDesc(); // Fetch all products from the database
    return posts.stream()
        .map(this::mapToGetPostRequest) // Map each Product to GetProductRequest
        .collect(Collectors.toList()); // Collect into a List<GetProductRequest>
  }

  public GetPostRequest getPostById(Long productId) {
    Post post = postRepository.findById(productId)
        .orElseThrow(() -> new IllegalArgumentException("Product not found")); // Handle case where product is not found
    return mapToGetPostRequest(post); // Map the product to GetProductRequest DTO
  }

  // Delete Product
  public void deletePostById(Long id) {
    // Perform the deletion logic here
    // For example, if you're using a repository:
    postRepository.deleteById(id);
  }
}


