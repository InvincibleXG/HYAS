package com.xg.hyas.util;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * @author zhangliangliang
 * @time 2017/12/20 15:52
 */
public class CookieUtil
{
    private final static Integer MAX_AGE = 60 * 60 * 1;
    /**
     * 设置cookie
     * @param response
     * @param name     cookie名字
     * @param value    cookie值
     */
    public static void addCookie(HttpServletResponse response, String name, String value)
    {
        Cookie cookie = new Cookie(name, value);
        cookie.setPath("/");
        cookie.setMaxAge(MAX_AGE);//单位 秒
        response.addCookie(cookie);
    }
    public static void deleteCookie(HttpServletResponse response, HttpServletRequest request, String name)
    {
        Cookie cookie = getCookieByName(request, name);
        cookie.setMaxAge(0);
        cookie.setValue(null);
        response.addCookie(cookie);
    }
    /**
     * 根据名字获取cookie
     * @param request
     * @param name    cookie名字
     * @return
     */
    public static Cookie getCookieByName(HttpServletRequest request, String name)
    {
        Map<String, Cookie> cookieMap = readCookieMap(request);
        return cookieMap.containsKey(name) ? cookieMap.get(name) : null;
    }
    public static void refreshCookie(HttpServletRequest request, String name, HttpServletResponse response)
    {
        Cookie cookie = getCookieByName(request, name);
        cookie.setMaxAge(MAX_AGE);
        response.addCookie(cookie);
    }
    public static void refreshCookie(HttpServletRequest request, String name, HttpServletResponse response, String value)
    {
        Cookie cookie = getCookieByName(request, name);
        cookie.setMaxAge(MAX_AGE);
        cookie.setValue(value);
        response.addCookie(cookie);
    }
    /**
     * 将cookie封装到Map里面
     * @param request
     * @return
     */
    private static Map<String, Cookie> readCookieMap(HttpServletRequest request)
    {
        Map<String, Cookie> cookieMap = new HashMap<String, Cookie>();
        Cookie[] cookies = request.getCookies();
        if (null != cookies) {
            for (Cookie cookie : cookies) {
                cookieMap.put(cookie.getName(), cookie);
            }
        }
        return cookieMap;
    }
}
