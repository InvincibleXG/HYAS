package com.xg.hyas.controller;

import com.xg.hyas.config.GlobalConstant;
import com.xg.hyas.entity.User;
import com.xg.hyas.entity.Work;
import com.xg.hyas.service.WorkService;
import com.xg.hyas.util.CheckUtil;
import com.xg.hyas.util.UserUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/work")
@Slf4j
public class WorkController
{
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
}
