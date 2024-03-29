package com.xg.hyas.util;

import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class RequestUtil
{
    public static HttpServletRequest getRequest()
    {
        ServletRequestAttributes requestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = requestAttributes.getRequest();
        if (request == null) {
            log.warn("无法获取HTTP请求对象");
        }
        return request;
    }

    public static StringBuilder getRequestHost()
    {
        HttpServletRequest request = getRequest();
        if (request == null) {
            return null;
        }
        StringBuilder sb = new StringBuilder(request.getRemoteHost());
        return sb;
    }
}
