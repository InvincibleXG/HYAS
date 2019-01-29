package com.xg.hyas.config;

import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.server.ErrorPage;
import org.springframework.boot.web.servlet.server.ConfigurableServletWebServerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;

@Configuration
public class ServerConfiguration
{
    @Bean
    public ConfigurableServletWebServerFactory webServerFactory()
    {
        // 对TomcatServlet生效，出现指定HttpStatus重定向错误页面
        TomcatServletWebServerFactory factory = new TomcatServletWebServerFactory();
        factory.addErrorPages(new ErrorPage(HttpStatus.UNAUTHORIZED, "/wrong?status=401"));
        factory.addErrorPages(new ErrorPage(HttpStatus.FORBIDDEN, "/wrong?status=403"));
        factory.addErrorPages(new ErrorPage(HttpStatus.METHOD_NOT_ALLOWED, "/wrong?status=405"));
        return factory;
    }
}
