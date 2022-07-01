#!/bin/bash
    
serviceName="FormMake"
routeName="FormMake_rt1"
consumerName="Jason"
plugin="basic-auth"


# 删除
    cmd=`curl -s -X DELETE http://127.0.0.1:8001/consumers/${consumerName} `
    echo $cmd 

    cmd=` curl -s -X DELETE http://127.0.0.1:8001/plugins/${basic-auth} `
    echo $cmd 

    cmd=`curl -s -X DELETE http://127.0.0.1:8001/routes/${routeName} `
    echo $cmd 
    
    cmd=`curl -s -X DELETE http://127.0.0.1:8001/services/${serviceName} `
    echo $cmd 
