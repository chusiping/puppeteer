#!/bin/bash
    cmd='curl -s -X DELETE http://127.0.0.1:8001/routes/route2'
    echo ${cmd} 
    echo ${cmd}|awk '{run=$0;system(run)}'
    
    cmd='curl -s -X DELETE http://127.0.0.1:8001/services/form'
    echo ${cmd} 
    echo ${cmd}|awk '{run=$0;system(run)}'
    
    cmd='curl -s -X DELETE http://127.0.0.1:8001/routes/route1'
    echo ${cmd} 
    echo ${cmd}|awk '{run=$0;system(run)}'
    
    cmd='curl -s -X DELETE http://127.0.0.1:8001/services/api'
    echo ${cmd} 
    echo ${cmd}|awk '{run=$0;system(run)}'
    
    cmd='curl -s -X DELETE http://127.0.0.1:8001/routes/route3'
    echo ${cmd} 
    echo ${cmd}|awk '{run=$0;system(run)}'
    
    cmd='curl -s -X DELETE http://127.0.0.1:8001/services/vhost'
    echo ${cmd} 
    echo ${cmd}|awk '{run=$0;system(run)}'
    