package com.xg.hyas.controller;

import com.xg.hyas.entity.Attendance;
import com.xg.hyas.entity.User;
import com.xg.hyas.service.AttendanceService;
import com.xg.hyas.util.CheckUtil;
import com.xg.hyas.util.RequestUtil;
import com.xg.hyas.util.UserUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("/")
@Slf4j
public class IndexController
{
    @Autowired
    private AttendanceService attendanceService;

    @GetMapping("/")
    public String root()
    {
        User user=UserUtil.getCurrentUser();
        if (user==null) return "redirect:login";
        else return "redirect:index";
    }
    @GetMapping("/login")
    public String login()
    {
        return "login.html";
    }
    @GetMapping("/logout")
    public String logout()
    {
        User user=UserUtil.getCurrentUser();
        if (user==null) return "logout.html";
        RequestUtil.getRequest().getSession().invalidate();
        log.info("{} 已注销", user.getUserId());
        return "logout.html";
    }
    @GetMapping("/index")
    public ModelAndView index(@RequestParam(value = "target", defaultValue = "home")String url)
    {
        ModelAndView mav=new ModelAndView("index.html");
        User user=UserUtil.getCurrentUser();
        if (user==null) mav.setViewName("redirect:login");
        mav.addObject("user", user);
        mav.addObject("url", url);
        switch (url)
        {
            case "home":
                Attendance attendance=attendanceService.checkToday();
                if (attendance!=null){
                    String attendTime=attendance.getLoginTime();
                    if (!CheckUtil.isNullString(attendTime)) mav.addObject("hasAttended", true);
                }
        }
        return mav;
    }

}
