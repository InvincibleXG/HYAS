package com.xg.hyas.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.pagehelper.PageInfo;
import com.xg.hyas.config.GlobalConstant;
import com.xg.hyas.entity.Attendance;
import com.xg.hyas.entity.User;
import com.xg.hyas.service.AttendanceService;
import com.xg.hyas.util.CheckUtil;
import com.xg.hyas.util.SummaryUtil;
import com.xg.hyas.util.UserUtil;
import com.xg.hyas.vo.AttendanceView;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.net.URLEncoder;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
@RequestMapping("/attend")
public class AttendanceController
{
    @Autowired
    private AttendanceService attendanceService;

    @PostMapping("/go")
    public String attend()
    {
        try{
            Attendance attendance=attendanceService.checkToday();
            if (attendance!=null){
                String attendTime=attendance.getLoginTime();
                if (!CheckUtil.isNullString(attendTime)) return "您今天已经上班打卡了";
            }
            return String.valueOf(attendanceService.attend());
        }catch (Exception e){
            log.error(e.toString(), e);
        }
        return GlobalConstant.ERROR_RETURN;
    }

    @PostMapping("/rest")
    public String rest()
    {
        try{
            Attendance attendance=attendanceService.checkToday();
            if (attendance!=null){
                String attendTime=attendance.getLoginTime();
                String restTime=attendance.getLogoutTime();
                if (CheckUtil.isNullString(attendTime)) return "您今天还未上班打卡";
                if (!CheckUtil.isNullString(restTime)) return "您今天已经下班打卡了";
                return String.valueOf(attendanceService.rest());
            }else return "您今天还未上班打卡";

        }catch (Exception e){
            log.error(e.toString(), e);
        }
        return GlobalConstant.ERROR_RETURN;
    }

    @PostMapping("/statistics")
    public String statistics(@RequestParam("page")Integer page, @RequestParam("rows")Integer rows, AttendanceView params)
    {
        try{
            StringBuilder sb=new StringBuilder( "{\"total\":");
            ObjectMapper jsonMapper=new ObjectMapper();
            PageInfo<AttendanceView> pageInfo=attendanceService.getViewsByParams(page, rows, params);
            sb.append(pageInfo.getTotal()).append(",\"rows\":")
                    .append(jsonMapper.writeValueAsString(pageInfo.getList())).append("}");
            return sb.toString();
        }catch (Exception e){
            log.error(e.toString(), e);
        }
        return GlobalConstant.NULL_PAGE_RETURN;
    }

    @GetMapping("/report")
    public void report(HttpServletRequest request, HttpServletResponse response, AttendanceView params) throws IOException
    {
        try {
            User current=UserUtil.getCurrentUser();
            if (current==null || !GlobalConstant.checkAdmin(current.getRole())) return;
            // 按用户Id - 日期 排序查询  然后按用户Id划分List到Map里
            Map<AttendanceView, List<AttendanceView>> map=attendanceService.getMapByParams(params);
            request.setCharacterEncoding("UTF-8");
            response.setCharacterEncoding("UTF-8");
            response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            String fileName="考勤统计表.xlsx";
            response.addHeader("Content-Disposition", "attachment;filename=" + URLEncoder.encode(fileName, "utf-8"));
            SummaryUtil.attendanceReport(response.getOutputStream(), map);
        }catch (Exception e){
            log.error(e.getMessage(), e);
        } finally {
            response.getOutputStream().close();
        }
    }
}
