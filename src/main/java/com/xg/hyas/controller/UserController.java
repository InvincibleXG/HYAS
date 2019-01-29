package com.xg.hyas.controller;

import com.xg.hyas.config.GlobalConstant;
import com.xg.hyas.entity.User;
import com.xg.hyas.service.UserService;
import com.xg.hyas.util.CheckUtil;
import com.xg.hyas.util.RequestUtil;
import com.xg.hyas.util.UserUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.jws.soap.SOAPBinding;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/user")
@Slf4j
public class UserController
{
    @Autowired
    private UserService userService;

    @PostMapping("/sign")
    public String login(User params)
    {
        try{
            if (CheckUtil.isNullString(params.getUserId())){
                return "账号不能为空";
            }
            if (CheckUtil.isNullString(params.getPassword())){
                return "密码不能为空";
            }
            return userService.login(params);
        }catch (Exception e){
            log.error(e.toString(), e);
        }
        return GlobalConstant.ERROR_RETURN;
    }

    @PostMapping("/exit")
    public String logout()
    {
        try{
            User user=UserUtil.getCurrentUser();
            if (user==null) return "0";
            RequestUtil.getRequest().getSession().invalidate();
            log.info("{} 已注销", user.getUserId());
            return "1";
        }catch (Exception e){
            log.error(e.toString(), e);
        }
        return GlobalConstant.ERROR_RETURN;
    }
}
