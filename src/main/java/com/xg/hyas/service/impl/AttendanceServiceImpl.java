package com.xg.hyas.service.impl;

import com.xg.hyas.entity.User;
import com.xg.hyas.mapper.AttendanceMapper;
import com.xg.hyas.service.AttendanceService;
import com.xg.hyas.util.UserUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
        //实现签到

        return null;
    }
}
