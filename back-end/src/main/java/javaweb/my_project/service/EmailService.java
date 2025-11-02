package javaweb.my_project.service;

import jakarta.mail.MessagingException;
import javaweb.my_project.dto.email.SendEmailDto;
import javaweb.my_project.exception.AppException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmailService {
    @Value("${spring.mail.username}")
    @NonFinal
    private String systemEmail;

    JavaMailSender mailSender;

    public void sendEmail(SendEmailDto emailPayload){
        var message = mailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(emailPayload.getTo());
            helper.setSubject(emailPayload.getSubject());
            helper.setText(emailPayload.getText(), true);
            helper.setFrom(systemEmail);
            mailSender.send(message);
        }catch (MessagingException e){
            System.out.print(e.toString());
            throw new AppException(HttpStatus.BAD_REQUEST, "Failed to send email", "mail-e-01");
        }
    }

    public void sendEmailToVerifyRegister(String toEmail, String verificationCode){
        String verifyUrl = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/auth/register/verify/{verificationCode}")
                .buildAndExpand(verificationCode)
                .toUriString();
        String emailText = "Vui lòng nhấp vào liên kết bên dưới để xác minh email của bạn và hoàn thành quy trình đăng ký:\n" + verifyUrl;
        SendEmailDto emailPayload = SendEmailDto.builder()
                .to(toEmail)
                .subject("Xác minh email để đăng ký")
                .text(emailText)
                .build();
        sendEmail(emailPayload);

    }

    public void sendEmailToWelcome(String toEmail) {
        String emailText = "Chào mừng bạn đến với Nông nghiệp xanh";
        SendEmailDto emailPayload = SendEmailDto.builder()
                .to(toEmail)
                .subject("Nông nghiệp xanh chào mừng")
                .text(emailText)
                .build();
        sendEmail(emailPayload);
    }

    public void sendEmailToVerifyForgotPassword(String toEmail, String verificationCode){
        String emailText = "Mã xác minh quên mật khẩu:\n" + verificationCode;
        SendEmailDto emailPayload = SendEmailDto.builder()
                .to(toEmail)
                .subject("Xác minh để tạo mật khẩu mới")
                .text(emailText)
                .build();
        sendEmail(emailPayload);
    }
}
