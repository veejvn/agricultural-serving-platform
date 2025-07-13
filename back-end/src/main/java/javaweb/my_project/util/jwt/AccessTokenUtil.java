package javaweb.my_project.util.jwt;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class AccessTokenUtil extends BaseJWTUtil {

    @Value("${app.jwt.access.secret}")
    private String accessSecret;

    @Value("${app.jwt.access.expiration}")
    private long accessExpiration;

    @Override
    protected String getSecret() {
        return accessSecret;
    }

    @Override
    protected long getExpiration() {
        return accessExpiration;
    }
}
