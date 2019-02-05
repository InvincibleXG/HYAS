package com.xg.hyas.util;

import java.text.DateFormat;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import lombok.extern.slf4j.Slf4j;

/**
 *  SimpleDateFormat并不是线程安全的，以后应当使用JDK8自带的DateTimeFormatter
 *  这里为了避免重构 加锁了
 */
@Slf4j
public class FormatUtil
{
    public final static String YYYY="yyyy";
    public final static String YYYY_MM_DD="yyyy-MM-dd";
    public final static String YYYY_MM_DD_HH_MM_SS="yyyy-MM-dd HH:mm:ss";
    public final static String DECIMAL="#,##0.00";
    public static DecimalFormat decimalFormat =new DecimalFormat(DECIMAL);

    public String formatYear(String date)
    {
        DateFormat dy=new SimpleDateFormat(YYYY);
        try{
            Date d=format2Date(date,YYYY);
            return dy.format(d);
        }catch (Exception e){
            log.error("日期格式化异常", e);
        }
        return null;
    }

    public static String formatYear(Date d)
    {
        DateFormat dy=new SimpleDateFormat(YYYY);
        try{
            return dy.format(d);
        }catch (Exception e){
            log.error("日期格式化异常", e);
        }
        return null;
    }

    public static String formatDate(Date d)
    {
        DateFormat dd=new SimpleDateFormat(YYYY_MM_DD);
        try{
            return dd.format(d);
        }catch (Exception e){
            log.error("日期格式化异常", e);
        }
        return null;
    }

    public static String formatTime(Date d)
    {
        DateFormat dt=new SimpleDateFormat(YYYY_MM_DD_HH_MM_SS);
        try{
            return dt.format(d);
        }catch (Exception e){
            log.error("时间格式化异常", e);
        }
        return null;
    }

    public static Date format2Date(String time, String format) throws ParseException
    {
        if (CheckUtil.isNullString(time)) return null;
        Date d=new Date();
        switch (format)
        {
            case YYYY:
                DateFormat dy=new SimpleDateFormat(YYYY);
                return dy.parse(time);
            case YYYY_MM_DD:
                DateFormat dd=new SimpleDateFormat(YYYY_MM_DD);
                return dd.parse(time);
            case YYYY_MM_DD_HH_MM_SS:
                DateFormat dt=new SimpleDateFormat(YYYY_MM_DD_HH_MM_SS);
                return dt.parse(time);
            default: return d;
        }
    }

    public String formatDecimal(Double numbers)
    {
        return decimalFormat.format(numbers);
    }

    public static String workStatus(Integer status)
    {
        if (status==null) return "";
        switch (status)
        {
            case 0: return "已取消";
            case 1: return "未开始";
            case 2: return "进行中";
            case 3: return "已完成";
            default:return "无状态";
        }
    }
}
