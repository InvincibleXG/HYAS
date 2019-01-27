package com.xg.hyas.mapper;

import com.xg.hyas.entity.Attendance;

import org.springframework.stereotype.Repository;

@Repository
public interface AttendanceMapper
{
    int deleteByPrimaryKey(String guid);

    int insert(Attendance record);

    int insertSelective(Attendance record);

    Attendance selectByPrimaryKey(String guid);

    int updateByPrimaryKeySelective(Attendance record);

    int updateByPrimaryKey(Attendance record);
}