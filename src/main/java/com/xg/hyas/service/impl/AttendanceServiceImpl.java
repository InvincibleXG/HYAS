package com.xg.hyas.service.impl;

import com.xg.hyas.entity.Attendance;
import com.xg.hyas.entity.User;
import com.xg.hyas.mapper.AttendanceMapper;
import com.xg.hyas.service.AttendanceService;
import com.xg.hyas.util.FormatUtil;
import com.xg.hyas.util.GUID;
import com.xg.hyas.util.UserUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class AttendanceServiceImpl implements AttendanceService
{
    @Autowired
    private AttendanceMapper attendanceMapper;
    @Override
    public Integer attend()
    {
        User current=UserUtil.getCurrentUser();
        if (current==null) return -1;
        Attendance attendance=new Attendance();
        attendance.setGuid(GUID.generateGUID());
        attendance.setUser(current.getUserId());
        attendance.setCreator(current.getGuid());
        Date now=new Date();
        attendance.setCreateDate(FormatUtil.formatDate(now));
        attendance.setLoginTime(FormatUtil.formatTime(now));
        return attendanceMapper.insertSelective(attendance);
    }

    @Override
    public Attendance checkToday()
    {
        User current=UserUtil.getCurrentUser();
        if (current==null) return null;
        Attendance attendance=new Attendance();
        attendance.setUser(current.getUserId());
        attendance.setCreateDate(FormatUtil.formatDate(new Date()));
        attendance=attendanceMapper.selectByUserDate(attendance);
        return attendance;
    }
}
