from gl import *
out={'ports':{},'edu':{},'term':{},'vacio':None,'round':None,'todo':None}
for i,(t,cap) in enumerate([(0,10),(1,10),(2,100),(3,5),(1,7.5),(2,0.5)]):
    ch={'Q12':t,'Q13':cap}; wv=run(f'pt{i}',ch)
    out['ports'][f'P{i}']=dict(inputs=ch,sheets=sheets_flow(wv),results=results(wv)); print('pt',i,flush=True)
EDUSETS=[{'H20':1,'H21':800.5,'H22':2,'H23':1200,'H24':3,'H25':500,'H26':4,'H27':100},
 {'H20':0,'H21':100,'H22':5,'H23':100,'H24':2,'H25':300,'H26':2,'H27':700},
 {'H20':3,'H21':50,'H22':3,'H23':60,'H24':4,'H25':70,'H26':1,'H27':80},
 {'H20':4,'H21':1000,'H22':3,'H23':1000,'H24':2,'H25':1000,'H26':1,'H27':1000}]
for i,ch in enumerate(EDUSETS):
    wv=run(f'ed{i}',ch); out['edu'][f'E{i}']=dict(inputs=ch,sheets=sheets_flow(wv),results=results(wv)); print('ed',i,flush=True)
TERM={'TS1_us1':{'U5':2,'V5':3,'W5':1,'U14':10,'V14':8,'W14':12,'X14':6,'Y14':4},
 'TS2_us1_us2':{'U5':1,'V5':0,'W5':0,'U6':0,'V6':2,'W6':2,'U14':5,'V14':5,'W14':5,'X14':5,'Y14':5,'U15':3,'V15':4,'W15':5,'X15':6,'Y15':7},
 'TS3_flota_duplicada_ignorada':{'U7':5,'V7':5,'W7':5,'U14':10,'V14':10,'W14':10,'X14':10,'Y14':10},
 'TS4_flota_cero':{'U14':10,'V14':10},
 'TS5_us3_na':{'U16':5}}
for k,ch in TERM.items():
    wv=run('tm_'+k,ch); out['term'][k]=dict(inputs=ch,sheets=sheets_flow(wv),results=results(wv)); print('tm',k,flush=True)
ch={c:None for c in ['B6','B9','B10','K5','E8','E9','H21','H20','Q13','Q12','N5','U5']}
wv=run('vacio',ch); out['vacio']=dict(inputs=ch,results=results(wv))
wv=run('round',{},{'D46':0.4,'D53':0.4}); out['round']=dict(res_changes={'D46':0.4,'D53':0.4},results=results(wv))
json.dump(out,open('gold_c2.json','w'))
