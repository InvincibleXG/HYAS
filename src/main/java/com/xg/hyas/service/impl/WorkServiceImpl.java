package com.xg.hyas.service.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.xg.hyas.entity.User;
import com.xg.hyas.entity.Work;
import com.xg.hyas.mapper.WorkMapper;
import com.xg.hyas.mapper.WorkViewMapper;
import com.xg.hyas.service.WorkService;
import com.xg.hyas.util.FormatUtil;
import com.xg.hyas.util.GUID;
import com.xg.hyas.util.UserUtil;
import com.xg.hyas.vo.WorkView;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class WorkServiceImpl implements WorkService
{
    @Autowired
    private WorkMapper workMapper;
    @Autowired
    private WorkViewMapper workViewMapper;
    @Override
    public Integer add(Work record)
    {
        User current=UserUtil.getCurrentUser();
        if (current==null) return -1;
        record.setGuid(GUID.generateGUID());
        record.setCreator(current.getGuid());
        record.setCreateTime(FormatUtil.formatTime(new Date()));
        return workMapper.insertSelective(record);
    }

    @Override
    public PageInfo<WorkView> getWorkViewsByParams(Integer page, Integer rows, WorkView params)
    {
        PageHelper.startPage(page, rows);
        return new PageInfo<>(workViewMapper.selectByParams(params));
    }

    @Override
    public Integer cancel(Work record)
    {
        return workMapper.cancelByGuid(record);
    }
}