package javaweb.my_project.mapper;

import javaweb.my_project.dto.account.AccountRequest;
import javaweb.my_project.dto.account.AccountResponse;
import javaweb.my_project.dto.auth.AuthAccountInfoResponse;
import javaweb.my_project.dto.jwt.JWTPayloadDto;
import javaweb.my_project.entities.Account;
import javaweb.my_project.enums.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.mapstruct.BeanMapping;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;
import java.util.Set;

@Mapper(componentModel = "spring")
public interface AccountMapper {
    @Mapping(source = "roles", target = "scope", qualifiedByName = "rolesToScope")
    JWTPayloadDto toJWTPayloadDto(Account account);

    @Named("rolesToScope")
    static String rolesToScope(Set<Role> roles) {
        StringBuilder scopeBuilder = new StringBuilder();
        for (Role role : roles) {
            scopeBuilder.append(String.format("ROLE_%s ", role.name()));
        }
        return scopeBuilder.toString().trim();
    }

    AuthAccountInfoResponse toAccountInfo(Account account);

    AccountResponse toAccountResponse(Account account);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "email", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "farmer", ignore = true)
    @Mapping(target = "orders", ignore = true)
    @Mapping(target = "cartItems", ignore = true)
    @Mapping(target = "addresses", ignore = true)
    @Mapping(target = "refreshToken", ignore = true)
    void updateAccount(@MappingTarget Account account, AccountRequest request);

    List<AccountResponse> toListAccountResponse(List<Account> accounts);
}