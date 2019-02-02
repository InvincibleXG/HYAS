package com.xg.hyas.controller;

import com.xg.hyas.config.GlobalConstant;
import com.xg.hyas.entity.Attendance;
import com.xg.hyas.service.AttendanceService;
import com.xg.hyas.util.CheckUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
@RequestMapping("/attend")
public class AttendanceController
{
    @Autowired
    private AttendanceService attendanceService;

    @PostMapping("/go")
    public String attend()
    {
        try{
            Attendance attendance=attendanceService.checkToday();
            if (attendance!=null){
                String attendTime=attendance.getLoginTime();
                if (!CheckUtil.isNullString(attendTime)) return "您今天已经上班打卡了";
            }
            return String.valueOf(attendanceService.attend());
        }catch (Exception e){
            log.error(e.toString(), e);
        }
        return GlobalConstant.ERROR_RETURN;
    }

    @PostMapping("/rest")
    public String rest()
    {
        try{
            Attendance attendance=attendanceService.checkToday();
            if (attendance!=null){
                String attendTime=attendance.getLoginTime();
                String restTime=attendance.getLogoutTime();
                if (CheckUtil.isNullString(attendTime)) return "您今天还未上班打卡";
                if (!CheckUtil.isNullString(restTime)) return "您今天已经下班打卡了";
                return String.valueOf(attendanceService.rest());
            }else return "您今天还未上班打卡";

        }catch (Exception e){
            log.error(e.toString(), e);
        }
        return GlobalConstant.ERROR_RETURN;
    }
}
