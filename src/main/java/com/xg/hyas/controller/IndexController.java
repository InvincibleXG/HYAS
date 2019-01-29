package com.xg.hyas.controller;

import com.xg.hyas.entity.User;
import com.xg.hyas.util.RequestUtil;
import com.xg.hyas.util.UserUtil;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("/")
@Slf4j
public class IndexController
{
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
    public ModelAndView index()
    {
        ModelAndView mav=new ModelAndView("index.html");
        User user=UserUtil.getCurrentUser();
        if (user==null) mav.setViewName("redirect:login");
        mav.addObject("user", user);
        return mav;
    }

}
