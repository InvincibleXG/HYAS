package com.xg.hyas.mapper;

import com.xg.hyas.vo.WorkView;

public interface WorkViewMapper {
    int insert(WorkView record);

    int insertSelective(WorkView record);
}