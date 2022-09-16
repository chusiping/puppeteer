-- 参考地址 https://www.jianshu.com/p/fbd4b6d1fbcf

--业务逻辑 
-- 1. 建立流程分类 flow_type
-- 2. 建立流程名称 flow_flow
-- 3. 建立节点名称 flow_node
-- 4. 建立流程线   flow_link
-- 5. 建立流程实例 flow_instance
-- 6. 建立审批意见 flow_log


-- 流程类别
CREATE TABLE `flow_type` (
    `ID` int(10) unsigned NOT NULL auto_increment, 
    `name` varchar(200) default NULL,
    `createTime` DATETIME NOT null,
    PRIMARY KEY  (`ID`)
) ENGINE=MyISAM  DEFAULT CHARSET=%charset%;
-- 数据: 1合同管理  2行政综合
-- UNSIGNED属性就是将数字类型无符号化

-- 流程定义表
CREATE TABLE `flow_flow` (
    `ID` int(10) unsigned NOT NULL auto_increment, 
    `pid` int(10) unsigned NOT NULL,
    `key` varchar(30) NOT NULL,
    `name` varchar(200) default NULL,
    `nodeCnt` int(10) unsigned NOT NULL,
    `createTime` DATETIME NOT null,
    `updateTime` DATETIME NOT null,
    PRIMARY KEY  (`ID`)
) ENGINE=MyISAM  DEFAULT CHARSET=%charset%;
-- 数据: 1请假申请  2出差审批

-- 流程节点名称表
CREATE TABLE `flow_node` (
    `ID` int(10) unsigned NOT NULL auto_increment, 
    `key` varchar(30) NOT NULL,
    `name` varchar(200) default NULL,
    `createTime` DATETIME NOT null,
    `updateTime` DATETIME NOT null,
    PRIMARY KEY  (`ID`)
) ENGINE=MyISAM  DEFAULT CHARSET=%charset%;
-- 程节点名称表作用是每个业务流程节点的中文名称，节点名称可供多个流程节点复用
-- 数据: 1发文部门审核  2发文部门领导审核  3分管领导审核  4总经理审批   


-- 流程模板表(任务定义表)
CREATE TABLE `flow_Template` (
    `ID` int(10) unsigned NOT NULL auto_increment, 
    `name` varchar(200) default NULL,
    `flow_ID` int(10) unsigned NOT NULL,        --流程名称
    `flow_name` int(10) unsigned NOT NULL,      --类别id
    `owner` varchar(1000) default NULL,         --处理人({"1001":"张三",{"1001":"李四"})格式
    `` tinyint(10)  NOT NULL,   
    `createTime` DATETIME NOT null,
    PRIMARY KEY  (`ID`)
) ENGINE=MyISAM  DEFAULT CHARSET=%charset%;







