package javaweb.my_project.repository;

import javaweb.my_project.entities.Account;
import javaweb.my_project.entities.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddressRepository extends JpaRepository<Address, String> {

    List<Address>  findAllByAccount(Account account);

    // Method kiểm tra xem người dùng có bất kỳ địa chỉ nào không
    Boolean existsByAccountId(String AccountId);

    Optional<Address> findByIdAndAccountId(String id, String accountId);

    Optional<Address> findByAccountIdAndIsDefaultTrue(String Id);

}
