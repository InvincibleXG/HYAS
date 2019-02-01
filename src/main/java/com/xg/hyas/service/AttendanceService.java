package com.xg.hyas.service;

import com.xg.hyas.entity.Attendance;

public interface AttendanceService
{
    Integer attend();

    Attendance checkToday();
}
