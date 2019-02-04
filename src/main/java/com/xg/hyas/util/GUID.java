package com.xg.hyas.util;

import java.util.UUID;

public class GUID
{
    public final static String GUID_PATTERN="^[a-f0-9]{32}$";
    /**
     * 生成GUID
     *
     * @return 去掉-的GUID
     */
    public static String generateGUID()
    {
        String uuid = UUID.randomUUID().toString();
        //去掉“-”符号
        return uuid.replaceAll("-", "");
    }

    public static Boolean isGUID(String str)
    {
        if (str==null) return false;
        return str.matches(GUID_PATTERN);
    }
}
