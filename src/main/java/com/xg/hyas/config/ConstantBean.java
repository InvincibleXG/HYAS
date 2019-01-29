package com.xg.hyas.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Data;

@Component
@ConfigurationProperties(prefix = "const")
@Data
public class ConstantBean
{
    private String uploadPath;

    private String defaultPassword;

//    private String emailAccount;
//
//    private String emailPassword;
//
//    private String appURL;
}
