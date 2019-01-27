package com.xg.hyas.mapper;

import com.xg.hyas.entity.User;

import org.springframework.stereotype.Repository;

@Repository
public interface UserMapper
{
    int deleteByPrimaryKey(String guid);

    int insert(User record);

    int insertSelective(User record);

    User selectByPrimaryKey(String guid);

    int updateByPrimaryKeySelective(User record);

    int updateByPrimaryKey(User record);
}