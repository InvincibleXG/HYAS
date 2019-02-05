package com.xg.hyas.mapper;

import com.xg.hyas.entity.Work;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkMapper
{
    int deleteByPrimaryKey(String guid);

    int insert(Work record);

    int insertSelective(Work record);

    Work selectByPrimaryKey(String guid);

    int updateByPrimaryKeySelective(Work record);

    int updateByPrimaryKey(Work record);

    int cancelByGuid(Work record);

    int changeStatusYesterday(@Param("startTime")String start, @Param("endTime")String end);
}