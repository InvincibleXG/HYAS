package com.xg.hyas.util;

import com.xg.hyas.vo.AttendanceView;
import com.xg.hyas.vo.WorkView;

import java.text.ParseException;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class SummaryUtil
{
    /**
     *  计算列表中所有的考勤总计小时数
     * @param attendanceViewList
     * @return
     */
    public static double totalAttendanceHours(List<AttendanceView> attendanceViewList)
    {
        double total=0;
        for (AttendanceView attendanceView:attendanceViewList){
            String loginTime=attendanceView.getLoginTime();
            String logoutTime=attendanceView.getLogoutTime();
            try {
                Date startDate=FormatUtil.format2Date(loginTime, FormatUtil.YYYY_MM_DD_HH_MM_SS);
                Date endDate=FormatUtil.format2Date(logoutTime, FormatUtil.YYYY_MM_DD_HH_MM_SS);
                if (endDate==null){
                    Calendar endCalendar=Calendar.getInstance();
                    endCalendar.setTime(startDate);
                    endCalendar.set(Calendar.HOUR_OF_DAY, 17);
                    endCalendar.set(Calendar.MINUTE, 0);
                    endCalendar.set(Calendar.SECOND, 0);
                    endCalendar.set(Calendar.MILLISECOND, 0);
                    endDate=endCalendar.getTime();
                }
                long time=endDate.getTime()-startDate.getTime();
                total+=((double)time/1000/3600);
            } catch (Exception e) {
                log.error("转化日期出错", e);
            }
        }
        return total;
    }

    /**
     * 计算列表中所有的接单总计小时数
     * @param workViewList
     * @return
     */
    public static double totalWorkHours(List<WorkView> workViewList)
    {
        double total=0;
        for (WorkView workView:workViewList){
            Integer status=workView.getStatus();
            if (status!=1) continue;
            String start=workView.getStartTime();
            String end=workView.getEndTime();
            try {
                Date startDate=FormatUtil.format2Date(start, FormatUtil.YYYY_MM_DD_HH_MM_SS);
                Date endDate=FormatUtil.format2Date(end, FormatUtil.YYYY_MM_DD_HH_MM_SS);
                long time=endDate.getTime()-startDate.getTime();
                total+=((double)time/1000/3600);
            } catch (Exception e) {
                log.error("转化日期出错", e);
            }
        }
        return total;
    }
}
