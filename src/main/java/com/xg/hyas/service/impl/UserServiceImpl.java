package com.xg.hyas.service.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.xg.hyas.config.GlobalConstant;
import com.xg.hyas.entity.User;
import com.xg.hyas.mapper.UserMapper;
import com.xg.hyas.service.UserService;
import com.xg.hyas.util.CheckUtil;
import com.xg.hyas.util.FormatUtil;
import com.xg.hyas.util.GUID;
import com.xg.hyas.util.RequestUtil;
import com.xg.hyas.util.UserUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;

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

    @Override
    public PageInfo<User> getUsersByParams(Integer page, Integer rows, User params)
    {
        PageHelper.startPage(page, rows);
        return new PageInfo<>(userMapper.selectByParams(params));
    }

    @Override
    public Integer add(User record)
    {
        User current=UserUtil.getCurrentUser();
        if (current==null || !GlobalConstant.checkAdmin(current.getRole())) return -1;
        String userId=record.getUserId();
        User anyOld=userMapper.selectByUserId(userId);
        if (anyOld!=null) return -2;
        record.setGuid(GUID.generateGUID());
        record.setRole("用户");
        record.setPassword(new BCryptPasswordEncoder().encode(record.getPassword()));
        record.setCreator(current.getGuid());
        record.setCreateTime(FormatUtil.formatTime(new Date()));
        return userMapper.insertSelective(record);
}

    @Override
    public Integer update(User record)
    {
        User current=UserUtil.getCurrentUser();
        if (current==null || !GlobalConstant.checkAdmin(current.getRole())) return -1;
        String guid=record.getGuid();
        User oldUser=userMapper.selectByPrimaryKey(guid);
        if (oldUser==null || !oldUser.getIsValid()) return 0;
        record.setUserId(oldUser.getUserId());
        String newPwd=record.getPassword();
        if (!CheckUtil.isNullString(newPwd)){
            record.setPassword(new BCryptPasswordEncoder().encode(newPwd));
        }else {
            record.setPassword(null);
        }
        record.setRole("用户");
        record.setUserId(null);
        return userMapper.updateByPrimaryKeySelective(record);
    }

    @Override
    public Integer delete(String guid)
    {
        User current=UserUtil.getCurrentUser();
        if (current==null || !GlobalConstant.checkAdmin(current.getRole())) return -1;
        return userMapper.discardByGuid(guid);
    }
}
