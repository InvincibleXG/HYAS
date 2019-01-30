package com.xg.hyas.mapper;

import com.xg.hyas.entity.User;

import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserMapper
{
    int deleteByPrimaryKey(String guid);

    int insert(User record);

    int insertSelective(User record);

    User selectByPrimaryKey(String guid);

    int updateByPrimaryKeySelective(User record);

    int updateByPrimaryKey(User record);

    User selectByUserId(String userId);

    List<User> selectByParams(User params);
}