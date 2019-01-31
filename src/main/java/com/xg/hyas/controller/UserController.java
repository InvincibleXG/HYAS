package com.xg.hyas.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.pagehelper.PageInfo;
import com.sun.org.apache.bcel.internal.generic.RETURN;
import com.xg.hyas.config.GlobalConstant;
import com.xg.hyas.entity.User;
import com.xg.hyas.service.UserService;
import com.xg.hyas.util.CheckUtil;
import com.xg.hyas.util.RequestUtil;
import com.xg.hyas.util.UserUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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

    @PostMapping("/list")
    public String list(@RequestParam("page")Integer page, @RequestParam("rows")Integer rows, User params)
    {
        try{
            StringBuilder sb=new StringBuilder( "{\"total\":");
            ObjectMapper jsonMapper=new ObjectMapper();
            PageInfo<User> pageInfo=userService.getUsersByParams(page, rows, params);
            sb.append(pageInfo.getTotal()).append(",\"rows\":")
                    .append(jsonMapper.writeValueAsString(pageInfo.getList())).append("}");
            return sb.toString();
        }catch (Exception e){
            log.error(e.toString(), e);
        }
        return GlobalConstant.NULL_PAGE_RETURN;
    }

    @PostMapping("/add")
    public String add(User user)
    {
        try{
            if (CheckUtil.isNullString(user.getUserId())){
                return "账号不能为空";
            }
            if (CheckUtil.isNullString(user.getPassword())){
                return "密码不能为空";
            }
            if (CheckUtil.isNullString(user.getUserName())){
                return "姓名不能为空";
            }
            return String.valueOf(userService.add(user));
        }catch (Exception e){
            log.error(e.toString(), e);
        }
        return GlobalConstant.ERROR_RETURN;
    }

    @PostMapping("/update")
    public String update(User user)
    {
        try{
            if (CheckUtil.isNullString(user.getGuid())){
                return "用户编号不存在";
            }
            if (CheckUtil.isNullString(user.getUserId())){
                return "账号不能为空";
            }
            // 密码为空不更新
            if (CheckUtil.isNullString(user.getUserName())){
                return "姓名不能为空";
            }
            return String.valueOf(userService.update(user));
        }catch (Exception e){
            log.error(e.toString(), e);
        }
        return GlobalConstant.ERROR_RETURN;
    }
    @PostMapping("/delete")
    public String delete(User user)
    {
        try{
            String guid=user.getGuid();
            if (CheckUtil.isNullString(guid)){
                return "用户编号不存在";
            }
            return String.valueOf(userService.delete(guid));
        }catch (Exception e){
            log.error(e.toString(), e);
        }
        return GlobalConstant.ERROR_RETURN;
    }

    @Deprecated
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
