package com.xg.hyas.service;

import com.github.pagehelper.PageInfo;
import com.xg.hyas.entity.User;

public interface UserService
{
    String login(User params);

    PageInfo<User> getUsersByParams(Integer page, Integer rows, User params);

    Integer add(User record);

    Integer update(User record);

    Integer delete(String guid);
}
