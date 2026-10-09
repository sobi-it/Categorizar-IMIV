from gl import *
out={}
for c in [0,249,250,251,999,1000,1001,5999,6000,6001]:
    wv=run(f'com{c}',{'E8':20000,'E9':c,'E12':2000,'E13':c,'E31':3000,'E32':c})
    out[str(c)]=dict(inputs={'E8':20000,'E9':c,'E12':2000,'E13':c,'E31':3000,'E32':c},sheets=sheets_flow(wv),results=results(wv)); print('com',c,flush=True)
json.dump(out,open('gold_commerce.json','w'))
