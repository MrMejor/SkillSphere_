package com.tienda.app.repositories;

import com.tienda.app.models.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserInfoRepository extends JpaRepository< UserInfo, Long> {

    Optional<UserInfo> findByUserId(Long userId);

}
