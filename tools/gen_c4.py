from gl import *
out={}
for k,ch in {'T03b_restaurant500':{'E16':500},'T03c_hospital20000':{'H45':20000},'T03d_hospedaje150':{'B22':150}}.items():
    wv=run(k,ch); out[k]=dict(inputs=ch,results=results(wv)); print(k,flush=True)
json.dump(out,open('gold_c4.json','w'))
