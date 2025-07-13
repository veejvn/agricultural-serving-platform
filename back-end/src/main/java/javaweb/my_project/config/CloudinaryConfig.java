package javaweb.my_project.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

@Component
public class CloudinaryConfig {
    @Value("${app.cloudinary.cloud.name}")
    private String CLOUDINARY_NAME;

    @Value("${app.cloudinary.api.key}")
    private String CLOUDINARY_API_KEY;

    @Value("${app.cloudinary.api.secret}")
    private String CLOUDINARY_API_SECRET;

    @Bean
    public Cloudinary cloudinary(){
        return new Cloudinary(ObjectUtils.asMap(
           "cloud_name", CLOUDINARY_NAME,
                "api_key",CLOUDINARY_API_KEY,
                "api_secret", CLOUDINARY_API_SECRET
        ));
    }
}
