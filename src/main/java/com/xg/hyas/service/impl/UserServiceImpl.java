package com.xg.hyas.service.impl;

import com.xg.hyas.config.GlobalConstant;
import com.xg.hyas.entity.User;
import com.xg.hyas.mapper.UserMapper;
import com.xg.hyas.service.UserService;
import com.xg.hyas.util.RequestUtil;
import com.xg.hyas.util.UserUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpSession;

@Service
public class UserServiceImpl implements UserService
{
    @Autowired
    private UserMapper userMapper;
    @Override
    public String login(User params)
    {
        User user=userMapper.selectByUserId(params.getUserId());
        if (user==null) return "账号不存在";
        BCryptPasswordEncoder encoder=new BCryptPasswordEncoder();
        String inputPassword=params.getPassword();
        String pwd=user.getPassword();
        if (GlobalConstant.checkDefault(user.getPassword())){
           pwd=encoder.encode(pwd);
        }
        if (UserUtil.checkLogin(inputPassword, pwd)){
            HttpSession session = RequestUtil.getRequest().getSession();
            session.setAttribute("user", user);
            return "1";
        }
        return "账号/密码 不匹配";
    }
}
