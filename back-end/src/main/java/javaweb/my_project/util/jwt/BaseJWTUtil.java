package javaweb.my_project.util.jwt;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jose.util.Base64URL;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import javaweb.my_project.dto.jwt.JWTPayloadDto;
import javaweb.my_project.exception.AppException;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import java.text.ParseException;
import java.util.Date;

@Component
public abstract class BaseJWTUtil {
    protected abstract String getSecret();
    protected abstract long getExpiration();

    protected byte[] getSecretKey(){
        return Base64URL.encode(getSecret().getBytes()).decode();
    }

    public String generateToken(JWTPayloadDto payload){
        try{
            JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
            JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                    .subject(payload.getId())
                    .issuer("nongnghiepxanh.com")
                    .issueTime(new Date())
                    .expirationTime(new Date(System.currentTimeMillis() + getExpiration()))
                    .claim("id", payload.getId())
                    .claim("email", payload.getEmail())
                    .claim("scope", payload.getScope())
                    .build();
            Payload jwtPayload = new Payload(claimsSet.toJSONObject());
            JWSObject object = new JWSObject(header, jwtPayload);
            object.sign(new MACSigner(this.getSecretKey()));
            return object.serialize();
        }catch (JOSEException e){
            throw new AppException(HttpStatus.UNAUTHORIZED,"JWT error" ,"jwt-e-01");
        }
    }

    public JWTPayloadDto verifyToken(String token){
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            JWSVerifier verifier = new MACVerifier(this.getSecretKey());

            if (!signedJWT.verify(verifier)) {
                throw new AppException(HttpStatus.UNAUTHORIZED, "Invalid JWT signature", "jwt-e-02");
            }

            JWTClaimsSet claimsSet = signedJWT.getJWTClaimsSet();
            Date expirationTime = claimsSet.getExpirationTime();

            if (new Date().after(expirationTime)) {
                throw new AppException(HttpStatus.UNAUTHORIZED, "Token has expired", "jwt-e-03");
            }

            return JWTPayloadDto.builder()
                    .id(claimsSet.getStringClaim("id"))
                    .email(claimsSet.getStringClaim("email"))
                    .scope(claimsSet.getStringClaim("scope"))
                    .build();
        } catch (ParseException | JOSEException e) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Failed to verify JWT token", "jwt-e-04");
        }
    }

    public static JWTPayloadDto getPayload(SecurityContext context){
        Authentication authentication = context.getAuthentication();
        Jwt jwt = (Jwt) authentication.getPrincipal();
        return JWTPayloadDto.builder()
                .id(jwt.getClaim("id"))
                .email(jwt.getClaim("email"))
                .scope(jwt.getClaim("scope"))
                .build();
    }
}
