package com.example.commerza.user.passwordreset.util;


import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.util.concurrent.ThreadLocalRandom;

@Component
public class OtpUtil {

    private final SecureRandom random = new SecureRandom();

    public String generateOtp(){
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }
}
