package com.xg.hyas.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.pagehelper.PageInfo;
import com.xg.hyas.config.GlobalConstant;
import com.xg.hyas.entity.User;
import com.xg.hyas.entity.Work;
import com.xg.hyas.service.WorkService;
import com.xg.hyas.util.CheckUtil;
import com.xg.hyas.util.FormatUtil;
import com.xg.hyas.util.GUID;
import com.xg.hyas.util.UserUtil;
import com.xg.hyas.vo.WorkView;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Calendar;
import java.util.Date;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/work")
@Slf4j
public class WorkController
{
    private static String yesterdayDate=null; //存储昨天的日期 每次查询时检查是否改变 改变就更新昨天的记录状态
    @Autowired
    private WorkService workService;

    @RequestMapping("/record")
    public String workRecord(@RequestParam("start")String startTime, @RequestParam("end")String endTime)
    {
        try{
            User current=UserUtil.getCurrentUser();
            if (current==null) return "-1";
            if (CheckUtil.isTime(startTime) && CheckUtil.isTime(endTime)) {
                Work work = new Work();
                work.setStartTime(startTime);
                work.setEndTime(endTime);
                return String.valueOf(workService.add(work));
            }else return "-2";

        }catch (Exception e){
            log.error(e.toString(), e);
        }
        return GlobalConstant.ERROR_RETURN;
    }

    @RequestMapping("/list")
    public String list(@RequestParam("page")Integer page, @RequestParam("rows")Integer rows, WorkView params)
    {
        try{
            User current=UserUtil.getCurrentUser();
            if (current==null) return GlobalConstant.NULL_PAGE_RETURN;
            Calendar calendar=Calendar.getInstance();
            calendar.set(Calendar.HOUR_OF_DAY, 0);
            calendar.set(Calendar.MINUTE, 0);
            calendar.set(Calendar.SECOND, 0);
            calendar.set(Calendar.MILLISECOND, 0);
            Calendar yesterday= (Calendar) calendar.clone();
            yesterday.add(Calendar.DATE, -1);
            String yesterdayDateTemp=FormatUtil.formatDate(yesterday.getTime());
            if (yesterdayDate==null || !yesterdayDate.equals(yesterdayDateTemp)){
                yesterdayDate=yesterdayDateTemp;
                workService.changeYesterdayStatus(yesterdayDate); // 将昨天的接单状态全部置为已完成
            }
            params.setStartTime(FormatUtil.formatTime(calendar.getTime()));
            params.setUserId(current.getUserId()); //只能看自己的哦
            StringBuilder sb=new StringBuilder( "{\"total\":");
            ObjectMapper jsonMapper=new ObjectMapper();
            PageInfo<WorkView> pageInfo=workService.getWorkViewsByParams(page, rows, params);
            sb.append(pageInfo.getTotal()).append(",\"rows\":")
                    .append(jsonMapper.writeValueAsString(pageInfo.getList())).append("}");
            return sb.toString();
        }catch (Exception e){
            log.error(e.toString(), e);
        }
        return GlobalConstant.NULL_PAGE_RETURN;
    }

    @RequestMapping("/cancel")
    public String cancel(Work work)
    {
        try{
            User current=UserUtil.getCurrentUser();
            if (current==null) return "-1";
            if (GUID.isGUID(work.getGuid())){
                return String.valueOf(workService.cancel(work));
            }else return "-2";
        }catch (Exception e){
            log.error(e.toString(), e);
        }
        return GlobalConstant.ERROR_RETURN;
    }
}
