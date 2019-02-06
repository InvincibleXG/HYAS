package com.xg.hyas.service;

import com.github.pagehelper.PageInfo;
import com.xg.hyas.entity.Attendance;
import com.xg.hyas.vo.AttendanceView;

import java.util.List;
import java.util.Map;

public interface AttendanceService
{
    Integer attend();

    Attendance checkToday();

    Integer rest();

    PageInfo<AttendanceView> getViewsByParams(Integer page, Integer rows, AttendanceView params);

    Map<AttendanceView, List<AttendanceView>> getMapByParams(AttendanceView params);
}
