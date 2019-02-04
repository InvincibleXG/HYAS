package com.xg.hyas.mapper;

import com.xg.hyas.vo.AttendanceView;

public interface AttendanceViewMapper {
    int insert(AttendanceView record);

    int insertSelective(AttendanceView record);
}