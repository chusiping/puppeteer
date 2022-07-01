#!/bin/bash
# 执行命令： /root/NodeJsApp/kong网关api管理/kong_addService.sh


# Example 3  curl http://redis.qy:8000/form/formake.html
    # 服务入口：name服务名,url服务体
        cmd=`
        curl -s -X POST \
        --url http://127.0.0.1:8001/services/ \
        --data 'name=FormMake' \
        --data 'url=http://121.4.43.207'`
        echo $cmd 
    # 路由入口：name路由名,hosts访问域名，paths访问路径
       
        # 创建
        cmd=`
        curl -s -X POST \
        --url http://127.0.0.1:8001/services/FormMake/routes \
        --data 'paths=/form' \
        --data 'strip_path=false' \
        --data 'name=FormMake_rt1' `
        echo $cmd 

        # curl http://redis.qy:8000/top

# Example 3 身份验证 (测试通过)

        # 添加 插件
        cmd=`
        curl -s -XPOST --data "name=basic-auth" \
        http://localhost:8001/services/FormMake/plugins  `
        echo $cmd 

        # 添加 consumer
        cmd=`
        curl -s -XPOST --data "username=Jason" \
        http://localhost:8001/consumers/  `
        echo $cmd 

        # 添加 username/password
        cmd=`
        curl -s -XPOST --data "username=test&password=123456" \
        http://localhost:8001/consumers/Jason/basic-auth  `
        echo $cmd 



