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
import com.xg.hyas.vo.AttendanceView;
import com.xg.hyas.vo.WorkView;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
        String createTime=FormatUtil.formatTime(new Date());
        record.setCreateTime(createTime);
        if (createTime.compareTo(record.getStartTime())<0) record.setStatus(1);
        else if (createTime.compareTo(record.getEndTime())>0) record.setStatus(3);
        else record.setStatus(2);
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

    @Override
    public void changeYesterdayStatus(String yesterdayDate)
    {
        String startTime=yesterdayDate+" 00:00:00";
        String endTime=yesterdayDate+" 23:59:59";
        int res=workMapper.changeStatusYesterday(startTime, endTime);
        if (res>0) log.info("将{}条记录设置为已完成", res);
    }

    @Override
    public Map<WorkView, List<WorkView>> getMapByParams(WorkView params)
    {
        params.setUserId(null);
        params.setUserName(null);
        List<WorkView> workViews=workViewMapper.selectByParams(params);
        Map<WorkView, List<WorkView>> map=new HashMap<>();
        String userId=null;
        WorkView keyBack=null;
        for (WorkView workView:workViews){
            if (userId==null){ //首次进入循环
                userId=workView.getUserId();
                WorkView key=new WorkView();
                key.setUserId(userId);
                key.setUserName(workView.getUserName());
                List<WorkView> value=new ArrayList<>();
                value.add(workView);
                map.put(key, value);
                keyBack=key;
            }else{  //真·循环体
                String tempId=workView.getUserId();
                if (userId.equals(tempId)){ //还是同一用户的记录
                    map.get(keyBack).add(workView);
                }else{ //不是同一用户 变更当前的key 新增进map
                    WorkView key=new WorkView();
                    key.setUserId(tempId);
                    key.setUserName(workView.getUserName());
                    List<WorkView> value=new ArrayList<>();
                    value.add(workView);
                    map.put(key, value);
                    keyBack=key;
                }
            }
        }
        return map;
    }


}
