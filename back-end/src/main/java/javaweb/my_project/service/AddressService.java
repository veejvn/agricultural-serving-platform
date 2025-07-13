package javaweb.my_project.service;

import javaweb.my_project.dto.address.AddressRequest;
import javaweb.my_project.dto.address.AddressResponse;
import javaweb.my_project.entities.Account;
import javaweb.my_project.entities.Address;
import javaweb.my_project.exception.AppException;
import javaweb.my_project.mapper.AddressMapper;
import javaweb.my_project.repository.AddressRepository;
import javaweb.my_project.security.SecurityUtil;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AddressService {
    AddressRepository addressRepository;
    SecurityUtil securityUtil;
    AddressMapper addressMapper;

    public AddressResponse create(AddressRequest request){
        Account account = securityUtil.getAccount();
        //Nếu địa chỉ được tạo lần đầu tiên, đặt nó là mặc định
        if(!addressRepository.existsByAccountId(account.getId())){
            request.setIsDefault(true);
        }else if(request.getIsDefault()){
            setDefaultAddressIsFalse(account.getId());
        }
        Address address = addressMapper.toAddress(request);
        address.setAccount(account);
        addressRepository.save(address);
        return addressMapper.toAddressResponse(address);
    }

    public AddressResponse get(String id){

        if(isAddressCreator(id, securityUtil.getAccountId())){
            throw new AppException(HttpStatus.FORBIDDEN, "You are not the creator of this address", "address-e-04");
        }

        Address address = addressRepository.findById(id)
                .orElseThrow(
                        () -> new AppException(HttpStatus.NOT_FOUND,"Address not found", "address-e-01")
                );

        return addressMapper.toAddressResponse(address);
    }

    public List<AddressResponse> getAll(){

         List<Address> addresses = addressRepository.findAllByAccount(securityUtil.getAccount());
        return addressMapper.toListAddressResponse(addresses);
    }

    public AddressResponse update(String id, AddressRequest request){

        if(isAddressCreator(id, securityUtil.getAccountId())){
            throw new AppException(HttpStatus.FORBIDDEN, "You are not the creator of this address", "address-e-04");
        }

        if(request.getIsDefault())
            setDefaultAddressIsFalse(securityUtil.getAccountId());

        Address address = addressRepository.findById(id)
                .orElseThrow(
                        () -> new AppException(HttpStatus.NOT_FOUND,"Update address not found.", "address-e-02")
                );
        addressMapper.updateAddress(address, request);
        addressRepository.save(address);

        return addressMapper.toAddressResponse(address);
    }

    public AddressResponse updateIsDefault(String id){

        if(isAddressCreator(id, securityUtil.getAccountId())){
            throw new AppException(HttpStatus.FORBIDDEN, "You are not the creator of this address", "address-e-04");
        }

        setDefaultAddressIsFalse(securityUtil.getAccountId());

        Address addressUpdateDefault = addressRepository.findById(id)
                .orElseThrow(
                        () -> new AppException(HttpStatus.NOT_FOUND,"Default update address not found", "address-e-03")
                );
        addressUpdateDefault.setIsDefault(true);
        addressRepository.save(addressUpdateDefault);

        return addressMapper.toAddressResponse(addressUpdateDefault);
    }

    public void delete(String id){

        if(isAddressCreator(id, securityUtil.getAccountId())){
            throw new AppException(HttpStatus.FORBIDDEN, "You are not the creator of this address", "address-e-04");
        }

        addressRepository.deleteById(id);
    }

    public void setDefaultAddressIsFalse(String id){

        Optional<Address> optionalDefaultAddress = addressRepository.findByAccountIdAndIsDefaultTrue(id);

        if(optionalDefaultAddress.isPresent()){
            Address addressDefault = optionalDefaultAddress.get();
            addressDefault.setIsDefault(false);
            addressRepository.save(addressDefault);
        }
    }

    public boolean isAddressCreator(String addressId, String accountId) {
        // Kiểm tra xem địa chỉ có thuộc về account này không
        return addressRepository.findByIdAndAccountId(addressId, accountId).isEmpty();
    }

}
