package com.xg.hyas.util;

import java.util.Date;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import lombok.extern.slf4j.Slf4j;

/**
 * @author  XG
 * @version 1.0.0
 * @description 用于通用字符串检查的工具类
 */
@Slf4j
public class CheckUtil
{
    public final static String INTEGER_PATTERN="^(-)?\\d+$";
    public final static String NUMERIC_PATTERN="^(-)?\\d+([.]\\d+)?$";
    public final static String PHONE_PATTERN="^((13[0-9])|(14[5|7])|(15([0-9]))|(16([0-9]))|(17([0-9]))|(18[0-9])|(19[0-9]))\\d{8}$";
    public final static String EMAIL_PATTERN="^[.a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+$";

    public static Boolean isInteger(String str)
    {
        if (str==null) return false;
        return str.matches(INTEGER_PATTERN);
    }

    public static Boolean isNumeric(String str)
    {
        if (str==null) return false;
        return str.matches(NUMERIC_PATTERN);
    }

    public static Boolean isNullString(String str)
    {
        if (str==null) return true;
        if (str.trim().length()<1) return true;
        return false;
    }

    public static Boolean isPhone(String str)
    {
        if (str==null) return false;
        Pattern p= Pattern.compile(PHONE_PATTERN);
        if(p.matcher(str).matches()){
            return true;
        }else{
            return false;
        }
    }

    public static Boolean isEmail(String str)
    {
        if (str==null) return false;
        Pattern pattern = Pattern.compile(EMAIL_PATTERN);
        Matcher mat = pattern.matcher(str);
        if(mat.matches()){
            return true;
        }else {
            return false;
        }
    }

    public static Boolean isTime(String str)
    {
        if (str==null) return false;
        try {
            Date date=FormatUtil.format2Date(str, FormatUtil.YYYY_MM_DD_HH_MM_SS);
            if (date!=null) return true;
        }catch (Exception e){
            log.error("日期转换错误", e);
        }
        return false;
    }

}

