package com.xg.hyas.controller;

import com.xg.hyas.config.GlobalConstant;
import com.xg.hyas.service.AttendanceService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
public class AttendanceController
{
    @Autowired
    private AttendanceService attendanceService;

    @PostMapping("/attend")
    public String attend()
    {
        try{
            return String.valueOf(attendanceService.attend());
        }catch (Exception e){
            log.error(e.toString(), e);
        }
        return GlobalConstant.ERROR_RETURN;
    }

}
