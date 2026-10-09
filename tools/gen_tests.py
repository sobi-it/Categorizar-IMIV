import json
OUT='/home/claude/p001-imiv-web/js/data/testCases.js'
L=lambda f:json.load(open(f))
g1=L('golden_libreoffice.json'); com=L('gold_commerce.json'); c2=L('gold_c2.json'); todo=L('gold_todo.json'); c4=L('gold_c4.json')
tram=L('golden_tramos.json'); m3=L('golden_M3.json'); m4=L('golden_M4.json'); rnd=[x for x in L('golden_round.json') if x[0]!=0.49999999999999994]
base=openpyxl=None
import openpyxl
b=openpyxl.load_workbook('/home/claude/t/base.xlsx',data_only=True)['RESULTADOS IMIV']
rg=lambda r:[[c.value for c in row] for row in b[r]]
R=lambda r:{k:r[k] for k in ('ent','sal','tot','cat','ai')}
cases=[]
def add(id,n,group,title,inputs,expected,mode='user',sheets=None,intentional=None,note=''):
    cases.append(dict(id=id,n=n,group=group,title=title,mode=mode,inputs=inputs,expected=expected,sheets=sheets,intentional=intentional,note=note))
add('E-01',1,'Todo en cero','Libro original sin entradas (todo en cero)',{},dict(ent=rg('C21:F25'),sal=rg('C28:F32'),tot=rg('C35:F39'),cat=rg('C4:G8'),ai=rg('E12:F16')),note='Debe producir ceros y «N.A.».')
sp=lambda k:g1[k]
add('E-02',2,'Sólo Casas','100 viviendas',{'B6':100},R(sp('T01_casas100')))
for k,(a,b_) in {'a':(45,'T02a_dptos_prom45'),'b':(55,'T02b_dptos_prom55'),'c':(100,'T02c_dptos_prom100'),'d':(200,'T02d_dptos_prom200'),'e':(300,'T02e_dptos_prom300')}.items():
    add('E-03'+k,3,'Sólo Departamentos',f'200 viviendas, superficie promedio {a} m²',{'B10':200,'B9':a*200},R(sp(b_)))
add('E-04a',4,'Oficinas / Restaurant-Bar','Oficinas 5.000 m² (incluye caso ROUND .5: 55,5 + 10 = 65,5 → 66)',{'K5':5000},R(sp('T03_oficinas5000')))
add('E-04b',4,'Oficinas / Restaurant-Bar','Restaurant-Bar 500 m²',{'E16':500},R(c4['T03b_restaurant500']['results']))
add('E-04c',4,'Oficinas / Restaurant-Bar','Hospitales-Clínicas 20.000 m²',{'H45':20000},R(c4['T03c_hospital20000']['results']))
add('E-04d',7,'Varios períodos activos','Hospedaje 150 habitaciones',{'B22':150},R(c4['T03d_hospedaje150']['results']))
for k,v in c2['edu'].items(): add('E-05'+k[1:],5,'Establecimientos educacionales',f'Conjunto {int(k[1:])+1}: códigos {[v["inputs"][c] for c in ("H20","H22","H24","H26")]} · estudiantes {[v["inputs"][c] for c in ("H21","H23","H25","H27")]}',v['inputs'],R(v['results']),mode=('audit' if k=='E1' else 'user'),sheets=v['sheets'],note=('Códigos fuera de 1–4 sólo se admiten en modo auditoría (el Excel no aplica tasas).' if k=='E1' else ''))
add('E-06',6,'Mixto residencial y comercial','100 viviendas + supermercado 3.000 m² (carga 1.500) + restaurant 500 m²',{'B6':100,'E12':3000,'E13':1500,'E16':500},R(sp('T05_mixto')))
add('E-07',7,'Varios períodos activos','Todos los módulos activos (36 plantillas, Casas, Departamentos, educacionales, comercios, puerto, terminal US1–US2)',todo['inputs'],R(todo['results']),sheets=todo['sheets'])
add('E-08',8,'Valores altos','Industrias 500.000 m², oficinas 80.000 m², centro comercial 60.000 m² (carga 8.000)',{'N5':500000,'K5':80000,'E8':60000,'E9':8000},R(sp('T06_altos')))
add('E-09',9,'Campos vacíos','Entradas explícitamente vacías',c2['vacio']['inputs'],R(c2['vacio']['results']))
for c,v in com.items(): add('E-10_'+c,10,'Límites comerciales',f'Carga de ocupación = {c} en los tres comercios (CC 20.000 m², Super 2.000 m², Vega 3.000 m²)',v['inputs'],R(v['results']),sheets=v['sheets'])
names={'P0':'tipo 0, capacidad 10','P1':'tipo 1 (contenedores), capacidad 10','P2':'tipo 2 (granel), capacidad 100','P3':'tipo 3 (fuera de rango), capacidad 5','P4':'tipo 1, capacidad 7,5','P5':'tipo 2, capacidad 0,5'}
num={'P1':11,'P2':12}
for k,v in c2['ports'].items(): add('E-'+str(num.get(k,11))+k,num.get(k,11),'Puertos',names[k],v['inputs'],R(v['results']),mode=('audit' if k=='P3' else 'user'),sheets=v['sheets'],note=('Tipo fuera de 1–2 sólo en modo auditoría (el Excel entrega flujo 0).' if k=='P3' else ''))
add('E-13',13,'Bodegas Industriales','Bodegas 10.000 m² (privado × 2,5)',{'N8':10000},R(sp('T10a_bodegas')))
add('E-14',14,'Relleno Sanitario','Relleno 10.000 m² (privado × 2,5)',{'Q20':10000},R(sp('T10b_relleno')))
add('E-aeropuerto',3,'Plantilla (divisor C4)','Aeropuerto 2.000 pax/h',{'Q17':2000},R(sp('T08c_aeropuerto')))
add('E-17a',17,'Terminal TPUB sin Pasajeros','US1: flota 2/3/1, frecuencias 10/8/12/6/4',c2['term']['TS1_us1']['inputs'],R(c2['term']['TS1_us1']['results']),sheets=c2['term']['TS1_us1']['sheets'])
add('E-17b',17,'Terminal TPUB sin Pasajeros','US1 + US2 con distinta flota y frecuencia',c2['term']['TS2_us1_us2']['inputs'],R(c2['term']['TS2_us1_us2']['results']),sheets=c2['term']['TS2_us1_us2']['sheets'])
add('E-17c',17,'Terminal TPUB sin Pasajeros','Fila de flota duplicada (U7:W10): el Excel no la usa (VLOOKUP) y la web la tiene deshabilitada → flujo 0',c2['term']['TS3_flota_duplicada_ignorada']['inputs'],R(c2['term']['TS3_flota_duplicada_ignorada']['results']),sheets=c2['term']['TS3_flota_duplicada_ignorada']['sheets'],note='En la web los campos U7:W10 están deshabilitados: se ignoran (coincide con el Excel).',mode='audit')
add('E-17d',17,'Terminal TPUB sin Pasajeros','Frecuencia en US1 con flota 0 (factor 0)',c2['term']['TS4_flota_cero']['inputs'],R(c2['term']['TS4_flota_cero']['results']),sheets=c2['term']['TS4_flota_cero']['sheets'])
add('E-17e',17,'Terminal TPUB sin Pasajeros','US3 con frecuencia 5 (U16): el Excel devuelve #N/A en todos los resultados',c2['term']['TS5_us3_na']['inputs'],R(c2['term']['TS5_us3_na']['results']),sheets=None,mode='audit',intentional='D2',note='Diferencia intencional D2: la web excluye US3–US6 del cálculo y lo informa.')
add('E-neg',0,'Negativos (modo auditoría)','Oficinas −5.000 m² (el Excel acepta negativos)',{'K5':-5000},R(sp('T13_negativo')),mode='audit')
bundle=dict(origen='Libro original recalculado con LibreOffice (valores en caché del caso base idénticos a Excel en 12.742 celdas). NO son valores de Excel: confirmar una muestra en Excel.',cases=cases,sheetsTodo=todo['sheets'],tramos=tram,m3=m3,m4=m4,round=rnd,roundInject=dict(ent=[[0.4,0,0,0]]*5,sal=[[0.4,0,0,0]]*5,expectedTot=c2['round']['results']['tot'],resChanges=c2['round']['res_changes']))
open(OUT,'w',encoding='utf8').write("/* Casos de prueba y valores de referencia (LibreOffice sobre el libro original). Generado por script. */\n(function(r){'use strict';r.IMIV=r.IMIV||{};r.IMIV.testCases="+json.dumps(bundle,ensure_ascii=False)+";})(typeof window!=='undefined'?window:globalThis);\n")
print(len(cases),sorted({c['n'] for c in cases}))
