package javaweb.my_project.util;

import java.security.SecureRandom;

public class CommonUtil {
    public static String generateVerificationCode(){
        SecureRandom random = new SecureRandom();
        int code = random.nextInt(900000) + 100000;
        return String.valueOf(code);
    }

    public static String getForgotPasswordKey(String code){
        return "forgot-password/" + code;
    }
}
