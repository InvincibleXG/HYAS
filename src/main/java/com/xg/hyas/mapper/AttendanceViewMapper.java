package com.xg.hyas.mapper;

import com.xg.hyas.vo.AttendanceView;

import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttendanceViewMapper
{
    List<AttendanceView> selectByParams(AttendanceView params);
}