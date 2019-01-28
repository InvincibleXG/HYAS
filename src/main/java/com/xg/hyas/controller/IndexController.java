package com.xg.hyas.controller;

import com.xg.hyas.entity.User;
import com.xg.hyas.util.UserUtil;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/")
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
    @GetMapping("/index")
    public String index()
    {
        return "index.html";
    }

}
