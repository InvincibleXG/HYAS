package com.xg.hyas.service;

import com.github.pagehelper.PageInfo;
import com.xg.hyas.entity.Work;
import com.xg.hyas.vo.WorkView;

import java.util.List;
import java.util.Map;

public interface WorkService
{
    Integer add(Work record);

    PageInfo<WorkView> getWorkViewsByParams(Integer page, Integer rows, WorkView params);

    Integer cancel(Work record);

    void changeYesterdayStatus(String yesterdayDate);

    Map<WorkView, List<WorkView>> getMapByParams(WorkView params);
}
