package javaweb.my_project.service;

import javaweb.my_project.dto.account.AccountRequest;
import javaweb.my_project.dto.account.AccountResponse;
import javaweb.my_project.dto.account.DeleteAccountRequest;
import javaweb.my_project.dto.account.UpgradeToFarmerRequest;
import javaweb.my_project.dto.farmer.FarmerResponse;
import javaweb.my_project.entities.Account;
import javaweb.my_project.entities.Farmer;
import javaweb.my_project.enums.Role;
import javaweb.my_project.exception.AppException;
import javaweb.my_project.mapper.AccountMapper;
import javaweb.my_project.mapper.FarmerMapper;
import javaweb.my_project.repository.AccountRepository;
import javaweb.my_project.repository.FarmerRepository;
import javaweb.my_project.security.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final SecurityUtil securityUtil;
    private final AccountMapper accountMapper;
    private final FarmerRepository farmerRepository;
    private final FarmerMapper farmerMapper;

    public AccountResponse getAccount(){
        Account account =  securityUtil.getAccount();
        return accountMapper.toAccountResponse(account);
    }

    public AccountResponse updateAccount(AccountRequest request){
        Account account = securityUtil.getAccount();
        accountMapper.updateAccount(account, request);
        accountRepository.save(account);
        return accountMapper.toAccountResponse(account);
    }

    public FarmerResponse upgradeToFarmer(UpgradeToFarmerRequest request){
        Account account = securityUtil.getAccount();
        if(account.getRoles().contains(Role.FARMER)){
            throw new AppException(HttpStatus.CONFLICT, "Account already has role FARMER", "user-e-01");
        }
        account.getRoles().add(Role.FARMER);
        accountRepository.save(account);
        Farmer farmer = Farmer.builder()
                .name(request.getName())
                .account(account)
                .build();
        farmerRepository.save(farmer);
        return farmerMapper.toFarmerResponse(farmer);
    }

    public void delete(DeleteAccountRequest request){
        accountRepository.deleteById(request.getId());
    }

    public List<AccountResponse> getAllAccount(){
        List<Account> accounts = accountRepository.findAll();
        return accountMapper.toListAccountResponse(accounts);
    }
}
