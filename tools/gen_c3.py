from gl import *
wb0=openpyxl.load_workbook(SRC); T=template_sheets(wb0)
ch={}
for i,s in enumerate(T): ch[input_cell(wb0,s)]=round(120.25+41.5*i,2)
ch.update({'B6':137,'B10':120,'B9':120*75,'H21':800.5,'H23':1200,'H25':500,'H27':100,'E8':45000,'E9':7200,'E12':2500,'E13':1500,'E31':3000,'E32':250.5,'Q12':1,'Q13':12,
 'U5':2,'V5':3,'W5':1,'U6':1,'V6':1,'W6':2,'U14':10,'V14':8,'W14':12,'X14':6,'Y14':4,'U15':3,'V15':4,'W15':5,'X15':6,'Y15':7})
wv=run('todo',ch)
sh={}
for s in T: sh[s]=dict(ent=rng(wv[s],'N8:Q12'),sal=rng(wv[s],'N15:Q19'))
for s in VIV: sh[s]=dict(ent=rng(wv[s],'M10:P14'),sal=rng(wv[s],'M17:P21'),c4=wv[s]['C4'].value)
sh.update(sheets_flow(wv))
json.dump(dict(inputs=ch,sheets=sh,results=results(wv)),open('gold_todo.json','w'))
r=results(wv); print(r['tot'],r['cat'],r['ai'])
