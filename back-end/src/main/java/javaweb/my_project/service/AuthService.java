package javaweb.my_project.service;

import javaweb.my_project.dto.auth.*;
import javaweb.my_project.dto.jwt.JWTPayloadDto;
import javaweb.my_project.entities.Account;
import javaweb.my_project.entities.RefreshToken;
import javaweb.my_project.enums.Role;
import javaweb.my_project.exception.AppException;
import javaweb.my_project.mapper.AccountMapper;
import javaweb.my_project.repository.AccountRepository;
import javaweb.my_project.repository.RefreshTokenRepository;
import javaweb.my_project.util.PasswordUtil;
import javaweb.my_project.util.jwt.AccessTokenUtil;
import javaweb.my_project.util.jwt.RefreshTokenUtil;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthService {
    PasswordUtil passwordUtil;
    AccountRepository accountRepository;
    AccessTokenUtil accessTokenUtil;
    RefreshTokenUtil refreshTokenUtil;
    AccountMapper accountMapper;
    RefreshTokenRepository refreshTokenRepository;

    public void register(AuthRegisterRequest request) {
        boolean existedAccount = accountRepository.existsByEmail(request.getEmail());
        if (existedAccount) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Email has existed", "auth-e-01");
        }
    }

    public AuthResponse verifyRegister(AuthRegisterRequest request) {
        register(request);

        String hashedPassword = passwordUtil.encodePassword(request.getPassword());
        request.setPassword(hashedPassword);

        Set<Role> roles = new HashSet<>();
        roles.add((Role.CONSUMER));

        Account account = Account.builder()
                .email(request.getEmail())
                .password(request.getPassword())
                .build();
        account.setRoles(roles);
        accountRepository.save(account);

        String accessTokenString = accessTokenUtil.generateToken(accountMapper.toJWTPayloadDto(account));
        String refreshTokenString = refreshTokenUtil.generateToken(accountMapper.toJWTPayloadDto(account), account);
        return AuthResponse.builder()
                .accessToken(accessTokenString)
                .refreshToken(refreshTokenString)
                .build();
    }

    public AuthResponse login(AuthLoginRequest request) {
        Account account = accountRepository.findByEmail(request.getEmail())
                .orElseThrow(
                        () -> new AppException(HttpStatus.NOT_FOUND, "Email account not found", "auth-e-02"));
        if (!account.getRoles().contains(request.getRole())) {
            throw new AppException(HttpStatus.FORBIDDEN, "Insufficient permissions", "auth-e-03");
        }
        boolean isMatchPassword = passwordUtil.checkPassword(request.getPassword(), account.getPassword());
        if (!isMatchPassword) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Wrong password", "auth-e-04");
        }
        String accessTokenString = accessTokenUtil.generateToken(accountMapper.toJWTPayloadDto(account));
        String refreshTokenString = refreshTokenUtil.generateToken(accountMapper.toJWTPayloadDto(account), account);
        return AuthResponse.builder()
                .accessToken(accessTokenString)
                .refreshToken(refreshTokenString)
                .build();
    }

    public AuthResponse refreshToken(AuthRefreshTokenRequest request) {
        String refreshTokenString = request.getRefreshToken();
        JWTPayloadDto payload = refreshTokenUtil.verifyToken(refreshTokenString);
        String accessTokenString = accessTokenUtil.generateToken(payload);
        return AuthResponse.builder()
                .accessToken(accessTokenString)
                .build();
    }

    public void logout(AuthLogOutRequest request) {
        JWTPayloadDto payload = refreshTokenUtil.verifyToken(request.getRefreshToken());
        RefreshToken refreshToken = refreshTokenRepository
                .findByAccountId(payload.getId())
                .orElseThrow(
                        () -> new AppException(HttpStatus.NOT_FOUND, "Refresh token not found", "auth-e-05"));
        refreshToken.setToken(null);
        refreshTokenRepository.save(refreshToken);
    }

    public void changePassword(String accountId, AuthChangePasswordRequest request) {
        Account account = accountRepository.findById(accountId).orElseThrow(
                () -> new AppException(HttpStatus.NOT_FOUND, "Account not found", "auth-e-06"));
        boolean isMatchPassword = passwordUtil.checkPassword(request.getCurrentPassword(), account.getPassword());
        if (!isMatchPassword) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Wrong current password", "auth-e-07");
        }
        String hashedNewPassword = passwordUtil.encodePassword(request.getNewPassword());
        account.setPassword(hashedNewPassword);
        accountRepository.save(account);
    }

    public void forgotPassword(AuthForgotPasswordRequest request) {
        accountRepository.findByEmail(request.getEmail()).orElseThrow(
                () -> new AppException(HttpStatus.NOT_FOUND, "Email account not found", "auth-e-02"));
    }

    public AuthResponse verifyForgotPassword(String email, AuthVerifyForgotPasswordRequest request) {
        Account account = accountRepository.findByEmail(email).orElseThrow(
                () -> new AppException(HttpStatus.NOT_FOUND, "Email account not found", "auth-e-02"));
        String hashedPassword = passwordUtil.encodePassword(request.getNewPassword());
        account.setPassword(hashedPassword);
        accountRepository.save(account);
        String accessTokenString = accessTokenUtil.generateToken(accountMapper.toJWTPayloadDto(account));
        String refreshTokenString = refreshTokenUtil.generateToken(accountMapper.toJWTPayloadDto(account), account);
        return AuthResponse.builder()
                .accessToken(accessTokenString)
                .refreshToken(refreshTokenString)
                .build();
    }

    public AuthAccountInfoResponse getAccountInfo(String accountId) {
        Account Account = accountRepository
                .findById(accountId)
                .orElseThrow(
                        () -> new AppException(HttpStatus.NOT_FOUND, "Account not found", "auth-e-06"));
        return accountMapper.toAccountInfo(Account);
    }
}
