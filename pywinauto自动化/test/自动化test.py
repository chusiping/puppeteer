import time
from pywinauto import Application
from pywinauto.keyboard import send_keys
app = Application(backend='win32').start('notepad.exe')
dlg = app.window(class_name='Notepad')
dlg.menu_select('帮助->关于记事本')
dlg2 = app["关于记事本"]
time.sleep(1)
btn_ok = dlg2['确定'] 
btn_ok.click()
