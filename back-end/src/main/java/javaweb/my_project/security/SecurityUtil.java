package javaweb.my_project.security;

import javaweb.my_project.entities.Account;
import javaweb.my_project.entities.Farmer;
import javaweb.my_project.enums.Role;
import javaweb.my_project.exception.AppException;
import javaweb.my_project.repository.AccountRepository;
import javaweb.my_project.repository.FarmerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SecurityUtil {
    private final AccountRepository accountRepository;
    private final FarmerRepository farmerRepository;

    public String getAccountId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AppException(HttpStatus.UNAUTHORIZED, "User is not authenticated", "auth-e-00");
        }
        return authentication.getName();
    }
    public Account getAccount(){
        return accountRepository.findById(this.getAccountId()).orElseThrow(()->
                        new AppException(HttpStatus.NOT_FOUND,"Account not found", "auth-e-01")
                );
    }
    public String getFarmerId() {
        return this.getFarmer().getId();
    }
    public Farmer getFarmer() {
        Account account = this.getAccount();
         if (!account.getRoles().contains(Role.FARMER)) {
             throw new AppException(HttpStatus.FORBIDDEN, "Insufficient permissions", "auth-e-08");
         }
        return farmerRepository.findByAccount(account)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Farmer not found", "farmer-e-01"));
    }
}
