/**
 * Author: jashanjeetsingh
 * Created on 12/3/25 at 23:05
 * What we did in this class :-
 * // The changes are:
 */
package com.tienda.app.controllers;

import com.tienda.app.dtos.auth.AddPostRequest;
import com.tienda.app.dtos.auth.GetPostRequest;
import com.tienda.app.enums.Currency;
import com.tienda.app.services.PostService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
//@RequestMapping("/products")
@RequestMapping("/posts")
@CrossOrigin("*")
//@CrossOrigin(origins = "http://localhost:4200", allowedHeaders = "*", allowCredentials = "true")
public class ProductController {

  private final PostService postService;

  public ProductController(PostService postService) {
    this.postService = postService;
  }

  // Add a new product
  @PostMapping("/create")
  public ResponseEntity<String> addProduct(@RequestBody AddPostRequest request) {
    if (request.getImage() == null || request.getImage().isEmpty()) {
      request.setImage(null);
    }
    if (request.getPrice() == null) {
      request.setPrice( BigDecimal.ZERO);
    }
//    if (request.getTax() == null) {
//      request.setTax(0.0);
//    }
    if (request.getCurrency() == null) {
      request.setCurrency( Currency.EUR);
    }
    postService.savePost(request);
    return ResponseEntity.ok("Producto agregado exitosamente");
  }

  // Fetch products by user (seller)
  @GetMapping("/users/{username}")
  public ResponseEntity<List< GetPostRequest >> getProductsByUser(@PathVariable String username) {
    List<GetPostRequest> productDTOs = postService.getPostsByUser(username); // Call the service method
    return ResponseEntity.ok(productDTOs); // Return the list of DTOs
  }

  // ProductController.java
  @GetMapping
  public ResponseEntity<List<GetPostRequest>> getAllPosts() {
    List<GetPostRequest> postDTOs = postService.getAllPosts(); // Call the service method
    return ResponseEntity.ok(postDTOs); // Return the list of DTOs
  }
  // ProductController.java
  @GetMapping("/{id}")
  public ResponseEntity<GetPostRequest> getProductById(@PathVariable Long id) {
    GetPostRequest productDTO = postService.getPostById(id); // Fetch the product by ID
    return ResponseEntity.ok(productDTO); // Return the product DTO
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<String> deleteProductById(@PathVariable Long id) {
    try {
      postService.deletePostById(id); // Call the service to delete the product
      return ResponseEntity.ok("Product deleted successfully"); // Return a success message
    } catch (Exception e) {
      return ResponseEntity.status( HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete product: " + e.getMessage());
    }
  }
}


