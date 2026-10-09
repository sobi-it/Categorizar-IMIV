import openpyxl, re, json
SRC='/mnt/user-data/uploads/P001_FLUJOS_IMIV_IT_V4_0.xlsx'
SPECIAL={'INPUTS PROYECTO','RESULTADOS IMIV','Art 2.1.36 OGUC','Art 1.2.6 IMIV','Art 3.2.2 IMIV'}
PEND=['Establec. Educacionales Tipo1','Establec. Educacionales Tipo2','Establec. Educacionales Tip3','Establec. Educacionales Tip 4','Centros Comerciales','Supermercados-LocalesComercials','Otro Comercio (Vega)','Terminales TPUB sin Pasajeros','Puertos']
VIV=['Casas','Departamentos']
def template_sheets(wb):
    return [n for n in wb.sheetnames if n not in SPECIAL and n not in PEND and n not in VIV]
def input_cell(wb,sheet):
    v=wb[sheet]['C4'].value
    return re.findall(r"!\$?([A-Z]+)\$?(\d+)",v)[0][0]+re.findall(r"!\$?([A-Z]+)\$?(\d+)",v)[0][1]
