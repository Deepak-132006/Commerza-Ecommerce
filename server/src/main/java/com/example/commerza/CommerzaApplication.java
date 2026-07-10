package com.example.commerza;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication

public class CommerzaApplication {

	public static void main(String[] args) {
		SpringApplication.run(CommerzaApplication.class, args);
	}

}
