package org.backend.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    private Map<String, String> otpStorage = new HashMap<>();

    private String generateOTP() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000); // Generates 6-digit OTP
        return String.valueOf(otp);
    }

    public String sendOtpEmail(String to) {
        String otp = generateOTP();
        otpStorage.put(to, otp);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("jitpatel110105@gmail.com");
        message.setTo(to);
        message.setSubject("Your OTP for Email Verification");
        message.setText("Your OTP is: " + otp + ". It will expire in 5 minutes.");
        mailSender.send(message);

        System.out.println("OTP sent successfully to " + to);
        return otp;
    }

    public boolean verifyOtp(String email, String otp) {
        String storedOtp = otpStorage.get(email);
        if (storedOtp != null && storedOtp.equals(otp)) {
            otpStorage.remove(email);
            return true;
        }
        return false;
    }
}
