package javaweb.my_project.util;

import javaweb.my_project.exception.AppException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class CodeUtil<T> {

    // Lớp lưu trữ mã và thời gian hết hạn
    private  static class CodeEntry<T>{
        private T payload;
        private LocalDateTime expiresAt;

        public CodeEntry(T payload, LocalDateTime expiresAt){
            this.payload = payload;
            this.expiresAt = expiresAt;
        }

        public T getPayload(){
            return payload;
        }

        public LocalDateTime getExpiresAt(){return expiresAt;};
    }

    private final Map<String, CodeEntry<T>> verificationCodes = new ConcurrentHashMap<>();

    // Lưu mã với TTL (thời gian sống)
    public void save(String code, T payload, long ttlInMinutes){
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(ttlInMinutes);
        verificationCodes.put(code, new CodeEntry<>(payload, expiresAt));
    }

    // Lấy mã nếu còn hiệu lực
    public T get(String code){
        CodeEntry<T> entry = verificationCodes.get(code);
        if (entry == null || entry.getExpiresAt().isBefore(LocalDateTime.now())){
            // Nếu mã hết hạn hoặc không tồn tại, xóa mã và trả về null
            verificationCodes.remove(code);
            throw new AppException(HttpStatus.NOT_FOUND, "Code not found","code-e-01");
        }
        return entry.getPayload();
    }

    // Xóa mã
    public void remove(String code){verificationCodes.remove(code);}
}
