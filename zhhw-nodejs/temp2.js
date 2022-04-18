^F12::
InputBox, time, 计时器, 请输入计时分钟数,,180,130,,,,,2
InputBox, msg, 计时器, 输入提示信息,,180,130,,,,,2
if ErrorLevel
return
else
time := time*60000
Sleep,%time%
SoundBeep, 250, 100
Sleep,50
SoundBeep, 250, 100
Sleep,50
SoundBeep, 250, 500
MsgBox %msg%
return