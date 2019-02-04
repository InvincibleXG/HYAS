package com.xg.hyas.mapper;

import com.xg.hyas.vo.WorkView;

import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkViewMapper
{
    List<WorkView> selectByParams(WorkView params);

}