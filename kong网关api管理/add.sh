#!/bin/bash
source del.sh

    cmd='
    curl -s -X POST 
    --url http://127.0.0.1:8001/services/ 
    --data "name=form" 
    --data "url=http://121.4.43.207:80/form" |python -m json.tool '
    echo ${cmd} 
    echo ${cmd} |awk '{run=$0;system(run)}'
    
    cmd='
    curl -s -X POST 
    --url http://127.0.0.1:8001/services/form/routes 
    --data "paths=/form_" 
    --data "strip_path=true" 
    --data "hosts=form.mapked.com" 
    --data "name=route2" |python -m json.tool '
    echo ${cmd} 
    echo ${cmd}|awk '{run=$0;system(run)}'
    
    cmd='
    curl -s -X POST 
    --url http://127.0.0.1:8001/services/ 
    --data "name=api" 
    --data "url=http://121.4.43.207:3002" |python -m json.tool '
    echo ${cmd} 
    echo ${cmd} |awk '{run=$0;system(run)}'
    
    cmd='
    curl -s -X POST 
    --url http://127.0.0.1:8001/services/api/routes 
    --data "paths=/" 
    --data "strip_path=false" 
    --data "hosts=api.mapked.com" 
    --data "name=route1" |python -m json.tool '
    echo ${cmd} 
    echo ${cmd}|awk '{run=$0;system(run)}'
    
    cmd='
    curl -s -X POST 
    --url http://127.0.0.1:8001/services/ 
    --data "name=vhost" 
    --data "url=http://192.168.1.144/vhost/" |python -m json.tool '
    echo ${cmd} 
    echo ${cmd} |awk '{run=$0;system(run)}'
    
    cmd='
    curl -s -X POST 
    --url http://127.0.0.1:8001/services/vhost/routes 
    --data "paths=/" 
    --data "strip_path=false" 
    --data "hosts=vhost.mapked.com" 
    --data "name=route3" |python -m json.tool '
    echo ${cmd} 
    echo ${cmd}|awk '{run=$0;system(run)}'
    