package com.xg.hyas.service.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.xg.hyas.entity.Attendance;
import com.xg.hyas.entity.User;
import com.xg.hyas.mapper.AttendanceMapper;
import com.xg.hyas.mapper.AttendanceViewMapper;
import com.xg.hyas.service.AttendanceService;
import com.xg.hyas.util.FormatUtil;
import com.xg.hyas.util.GUID;
import com.xg.hyas.util.UserUtil;
import com.xg.hyas.vo.AttendanceView;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class AttendanceServiceImpl implements AttendanceService
{
    @Autowired
    private AttendanceMapper attendanceMapper;
    @Autowired
    private AttendanceViewMapper attendanceViewMapper;

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

    @Override
    public Integer rest()
    {
        Attendance attendance=checkToday();
        if (attendance==null){
            log.warn("$严重: 当天没有签到记录却能够触发下班打卡 用户为{}", UserUtil.getCurrentUser());
        }
        attendance.setLogoutTime(FormatUtil.formatTime(new Date()));
        return attendanceMapper.updateByPrimaryKeySelective(attendance);
    }

    @Override
    public PageInfo<AttendanceView> getViewsByParams(Integer page, Integer rows, AttendanceView params)
    {
        PageHelper.startPage(page, rows);
        return new PageInfo<>(attendanceViewMapper.selectByParams(params));
    }

    @Override
    public Map<AttendanceView, List<AttendanceView>> getMapByParams(AttendanceView params)
    {
        params.setUserId(null);
        params.setUserName(null);
        List<AttendanceView> attendanceViews=attendanceViewMapper.selectByParams(params);
        Map<AttendanceView, List<AttendanceView>> map=new HashMap<>();
        String userId=null;
        AttendanceView keyBack=null;
        for (AttendanceView attendanceView:attendanceViews){
            if (userId==null){ //首次进入循环
                userId=attendanceView.getUserId();
                AttendanceView key=new AttendanceView();
                key.setUserId(userId);
                key.setUserName(attendanceView.getUserName());
                List<AttendanceView> value=new ArrayList<>();
                value.add(attendanceView);
                map.put(key, value);
                keyBack=key;
            }else{  //真·循环体
                String tempId=attendanceView.getUserId();
                if (userId.equals(tempId)){ //还是同一用户的记录
                    map.get(keyBack).add(attendanceView);
                }else{ //不是同一用户 变更当前的key 新增进map
                    AttendanceView key=new AttendanceView();
                    key.setUserId(tempId);
                    userId=tempId;
                    key.setUserName(attendanceView.getUserName());
                    List<AttendanceView> value=new ArrayList<>();
                    value.add(attendanceView);
                    map.put(key, value);
                    keyBack=key;
                }
            }
        }
        return map;
    }
}
