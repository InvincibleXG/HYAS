package com.xg.hyas;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@ServletComponentScan
@MapperScan("com.xg.hyas.mapper")
@EnableScheduling
public class HyasApplication
{

    public static void main(String[] args)
    {
        SpringApplication.run(HyasApplication.class, args);
    }

}

