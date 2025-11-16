package javaweb.my_project.service;

import javaweb.my_project.dto.account.AccountRequest;
import javaweb.my_project.dto.account.AccountResponse;
import javaweb.my_project.dto.account.DeleteAccountRequest;
import javaweb.my_project.dto.account.UpgradeToFarmerRequest;
import javaweb.my_project.dto.farmer.UpgradeToFarmerResponse;
import javaweb.my_project.entities.Account;
import javaweb.my_project.entities.Farmer;
import javaweb.my_project.enums.Role;
import javaweb.my_project.exception.AppException;
import javaweb.my_project.mapper.AccountMapper;
import javaweb.my_project.mapper.FarmerMapper;
import javaweb.my_project.repository.AccountRepository;
import javaweb.my_project.repository.FarmerRepository;
import javaweb.my_project.security.SecurityUtil;
import javaweb.my_project.util.jwt.AccessTokenUtil;
import javaweb.my_project.util.jwt.RefreshTokenUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final SecurityUtil securityUtil;
    private final AccountMapper accountMapper;
    private final FarmerRepository farmerRepository;
    private final FarmerMapper farmerMapper;
    private final AccessTokenUtil accessTokenUtil;
    private final RefreshTokenUtil refreshTokenUtil;

    public AccountResponse getAccount() {
        Account account = securityUtil.getAccount();
        return accountMapper.toAccountResponse(account);
    }

    @Transactional
    public AccountResponse updateAccount(AccountRequest request) {
        Account account = securityUtil.getAccount();
        accountMapper.updateAccount(account, request);
        accountRepository.save(account);
        return accountMapper.toAccountResponse(account);
    }

    @Transactional
    public AccountResponse patchAccount(AccountRequest request) {
        Account account = securityUtil.getAccount();

        // Only update fields that are not null
        if (request.getDisplayName() != null) {
            account.setDisplayName(request.getDisplayName());
        }
        if (request.getPhone() != null) {
            account.setPhone(request.getPhone());
        }
        if (request.getAvatar() != null) {
            account.setAvatar(request.getAvatar());
        }
        if (request.getDob() != null) {
            account.setDob(request.getDob());
        }

        accountRepository.save(account);
        return accountMapper.toAccountResponse(account);
    }

    @Transactional
    public UpgradeToFarmerResponse upgradeToFarmer(UpgradeToFarmerRequest request) {
        Account account = securityUtil.getAccount();
        if (account.getRoles().contains(Role.FARMER)) {
            throw new AppException(HttpStatus.CONFLICT, "Account already has role FARMER", "role-e-01");
        }
        account.getRoles().add(Role.FARMER);
        accountRepository.save(account);
        Farmer farmer = Farmer.builder()
                .name(request.getName())
                .description(request.getDescription())
                .account(account)
                .build();
        farmerRepository.save(farmer);
        UpgradeToFarmerResponse response = new UpgradeToFarmerResponse();
        response.setFarmerResponse(farmerMapper.toFarmerResponse(farmer));
        response.setAccessToken(accessTokenUtil.generateToken(accountMapper.toJWTPayloadDto(account)));
        response.setRefreshToken(refreshTokenUtil.generateToken(accountMapper.toJWTPayloadDto(account), account));
        return response;
    }

    @Transactional
    public void delete(String accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Account not found", "account-e-01"));

        try {
            // Step 1: Clear and delete all related entities to satisfy foreign key
            // constraints

            // Clear refresh token first
            account.setRefreshToken(null);

            // Clear cart items first (this was the missing piece)
            account.getCartItems().clear();

            // Clear other collections
            account.getForumComments().clear();
            account.getForums().clear();
            account.getOrders().clear();
            account.getAddresses().clear();

            // Handle farmer relationship
            if (account.getFarmer() != null) {
                Farmer farmer = account.getFarmer();
                farmer.getProducts().clear();
                farmer.getOrders().clear();
                account.setFarmer(null);
                farmer.setAccount(null);
                farmerRepository.delete(farmer);
            }

            // Step 2: Save account to persist relationship changes
            accountRepository.save(account);

            // Step 3: Finally delete the account
            accountRepository.delete(account);

        } catch (Exception e) {
            throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error deleting account: " + e.getMessage(), "account-e-02");
        }
    }

    public List<AccountResponse> getAllAccount() {
        List<Account> accounts = accountRepository.findAll();
        return accountMapper.toListAccountResponse(accounts);
    }

    public AccountResponse getAccountById(String accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Account not found", "account-e-01"));
        return accountMapper.toAccountResponse(account);
    }
}
