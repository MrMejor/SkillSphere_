package com.tienda.app.repositories;

import com.tienda.app.models.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface PostRepository extends JpaRepository< Post, Long> {
  // Fetch products by seller's username
//  List< Post > findBySellerUsername(String username);
  List< Post > findBySellerUsernameOrderByCreatedAtDesc(String username);
  List<Post> findAllByOrderByCreatedAtDesc();
}
