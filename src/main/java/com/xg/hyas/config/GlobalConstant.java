package com.xg.hyas.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;

@Component
public class GlobalConstant
{
    public final static String ERROR_RETURN="意外错误发生了, 请重试或联系管理员";
    public final static String NULL_PAGE_RETURN="{\"total\":0,\"rows\":[]}";
    @Autowired
    private ConstantBean constantBean;

    private static String ADMIN_ROLE="管理员";

    public static String UPLOAD_PATH;
    public static String DEFAULT_PASSWORD;
//    public static String EMAIL_ACCOUNT;
//    public static String EMAIL_PASSWORD;
//    public static String APP_URL;  //最后不要斜杠

    @PostConstruct
    public void init()
    {
        UPLOAD_PATH=constantBean.getUploadPath();  // 文件上传绝对路径
        if (!UPLOAD_PATH.endsWith("/")) UPLOAD_PATH+="/";

        DEFAULT_PASSWORD=constantBean.getDefaultPassword(); // 默认密码
//        EMAIL_ACCOUNT=constantBean.getEmailAccount();
//        EMAIL_PASSWORD=constantBean.getEmailPassword();
//        APP_URL=constantBean.getAppURL();
//        if (APP_URL.endsWith("/")) APP_URL=APP_URL.substring(0, APP_URL.length()-1);

    }

    /**
     *  检查当前用户角色是否为‘系统管理员’
     * @param role
     * @return
     */
    public static Boolean checkAdmin(String role)
    {
        return ADMIN_ROLE.equals(role);
    }

    public static Boolean checkDefault(String pwd)
    {
        return DEFAULT_PASSWORD.equals(pwd);
    }
}
