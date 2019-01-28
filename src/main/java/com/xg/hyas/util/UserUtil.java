package com.xg.hyas.util;

import com.xg.hyas.entity.User;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class UserUtil
{
    public static User getCurrentUser()
    {
        Object o=RequestUtil.getRequest().getSession().getAttribute("user");
        if (o==null) log.warn(RequestUtil.getRequestHost()+"当前无有效用户，可能导致异常");
        return (User)o;
    }

}