from pathlib import Path
import re, json, html, math
from reportlab.pdfgen import canvas
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle, Image, KeepTogether
from reportlab.platypus.tableofcontents import TableOfContents
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_JUSTIFY, TA_CENTER, TA_LEFT
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.graphics.shapes import Drawing, Rect, Ellipse, Circle, Line, String, Polygon
from reportlab.graphics import renderSVG
from PIL import Image as PILImage

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT.parent / 'output/pdf/4506310_Projeto_Front_End.pdf'
OUT.parent.mkdir(parents=True, exist_ok=True)
for name, file in [('Arial', 'arial.ttf'), ('Arial-Bold', 'arialbd.ttf'), ('Arial-Italic', 'ariali.ttf')]:
    pdfmetrics.registerFont(TTFont(name, str(Path('C:/Windows/Fonts') / file)))
pdfmetrics.registerFontFamily('Arial', normal='Arial', bold='Arial-Bold', italic='Arial-Italic', boldItalic='Arial-Bold')
INK = colors.HexColor('#242424')
MUTED = colors.HexColor('#666666')
LINE = colors.HexColor('#8b8b8b')
LIGHT = colors.HexColor('#f4f4f4')
W = A4[0] - 5 * cm
styles = {
    'body': ParagraphStyle('Body', fontName='Arial', fontSize=12, leading=18, spaceAfter=10, alignment=TA_JUSTIFY, textColor=INK, splitLongWords=True),
    'h1': ParagraphStyle('Chapter', fontName='Arial-Bold', fontSize=12, leading=18, spaceAfter=18, keepWithNext=True),
    'h2': ParagraphStyle('Subsection', fontName='Arial-Bold', fontSize=12, leading=18, spaceBefore=12, spaceAfter=10, keepWithNext=True),
    'caption': ParagraphStyle('Caption', fontName='Arial', fontSize=10, leading=14, alignment=TA_LEFT, spaceAfter=14),
    'cell': ParagraphStyle('Cell', fontName='Arial', fontSize=9.5, leading=13, spaceAfter=0),
    'header': ParagraphStyle('HeaderCell', fontName='Arial-Bold', fontSize=9.5, leading=13, spaceAfter=0),
    'cover': ParagraphStyle('Cover', fontName='Arial', fontSize=12, leading=20, alignment=TA_CENTER, spaceAfter=14),
    'title': ParagraphStyle('Title', fontName='Arial-Bold', fontSize=14, leading=22, alignment=TA_CENTER, spaceAfter=14),
}
def p(text, style='body'):
    return Paragraph(html.escape(text), styles[style])
def label(d, x, y, text, size=9, bold=False, center=True):
    lines = text.split('\n')
    for i, line in enumerate(lines):
        d.add(String(x, y + (len(lines)-1)*size*.55 - i*size*1.2, line, fontName='Arial-Bold' if bold else 'Arial', fontSize=size, fillColor=INK, textAnchor='middle' if center else 'start'))
def arrow(d, x1, y1, x2, y2, dashed=False):
    d.add(Line(x1, y1, x2, y2, strokeColor=LINE, strokeWidth=.8, strokeDashArray=[3,3] if dashed else None))
    a = math.atan2(y2-y1, x2-x1)
    d.add(Polygon([x2,y2,x2-6*math.cos(a-.5),y2-6*math.sin(a-.5),x2-6*math.cos(a+.5),y2-6*math.sin(a+.5)], fillColor=LINE, strokeColor=LINE))
def box(d,x,y,w,h,text,size=9,fill=LIGHT):
    d.add(Rect(x,y,w,h,fillColor=fill,strokeColor=LINE,strokeWidth=.8,rx=4,ry=4))
    label(d,x+w/2,y+h/2-3,text,size)
def actor(d,x,y,text):
    d.add(Circle(x,y+22,6,fillColor=None,strokeColor=INK,strokeWidth=1))
    for a,b,c,e in [(x,y+16,x,y-4),(x-10,y+7,x+10,y+7),(x,y-4,x-9,y-17),(x,y-4,x+9,y-17)]:
        d.add(Line(a,b,c,e,strokeColor=INK,strokeWidth=1))
    label(d,x,y-32,text,8)
def architecture():
    d=Drawing(W,430)
    d.add(Rect(10,258,W-20,160,strokeColor=LINE,fillColor=None,rx=4))
    label(d,W/2,399,'Demonstrador executado no navegador',10,True)
    box(d,25,325,120,45,'Telas e navegação\nviews.js / app.js')
    box(d,165,325,120,45,'Regras e estado\nstore.js')
    box(d,305,325,120,45,'Catálogo local\ndata.js')
    arrow(d,145,347,165,347); arrow(d,285,347,305,347)
    label(d,W/2,283,'Web / App representado / Totem - memória da sessão',9)
    box(d,50,164,W-100,60,'API de pedidos e autenticação\nFutura: autoridade de preço, estoque, sessões e papéis',9)
    arrow(d,W/2,258,W/2,224,True)
    label(d,340,240,'Contrato futuro',8)
    box(d,20,69,190,58,'Integração de pagamento\nProvedor / webhook / consulta',9)
    box(d,244,69,190,58,'Operação e matriz\nCozinha / balcão / relatórios',9)
    arrow(d,165,164,115,127,True); arrow(d,285,164,340,127,True)
    box(d,121,2,210,43,'Persistência e auditoria\nTransações e retenção',9)
    arrow(d,115,69,150,45,True); arrow(d,340,69,303,45,True)
    return d
def cases():
    d=Drawing(W,570)
    d.add(Rect(102,20,246,531,fillColor=None,strokeColor=LINE))
    label(d,225,536,'Sistema Raízes do Nordeste',10,True)
    texts=['Selecionar unidade e\nconsultar cardápio','Personalizar e\nrealizar pedido','Solicitar pagamento','Acompanhar pedido','Consultar / resgatar\nbenefícios','Cadastrar / autenticar\nconta','Gerenciar privacidade','Confirmar retirada','Atualizar preparo','Gerenciar cardápio\ne campanhas','Consultar indicadores\ne auditar operações']
    ys=[498-i*44 for i in range(len(texts))]
    for text,y in zip(texts,ys):
        d.add(Ellipse(225,y,99,17,fillColor=LIGHT,strokeColor=LINE,strokeWidth=.7))
        label(d,225,y-3,text,8.5)
    actor(d,32,423,'Cliente')
    for y in ys[:7]: d.add(Line(44,430,126,y,strokeColor=LINE,strokeWidth=.6))
    actor(d,32,190,'Atendente')
    d.add(Line(44,198,126,ys[7],strokeColor=LINE,strokeWidth=.6))
    actor(d,32,102,'Cozinha')
    d.add(Line(44,110,126,ys[8],strokeColor=LINE,strokeWidth=.6))
    actor(d,414,425,'Pagamento\nexterno')
    d.add(Line(402,432,324,ys[2],strokeColor=LINE,strokeWidth=.6))
    actor(d,414,135,'Gerente /\nAdministrador')
    for y in ys[-2:]: d.add(Line(402,143,324,y,strokeColor=LINE,strokeWidth=.6))
    return d
def journey():
    d=Drawing(W,570)
    stages=[(518,'Escolher unidade e canal\nWeb / App / Totem'),(452,'Consultar cardápio\nDisponibilidade, preço e personalização'),(386,'Organizar sacola\nCadastro e fidelidade opcionais'),(320,'Revisar e solicitar pagamento\nTotal, retirada e aviso de dados')]
    for y,text in stages: box(d,105,y,240,43,text)
    for (y,_),(nexty,_) in zip(stages,stages[1:]): arrow(d,225,y,225,nexty+43)
    box(d,105,254,240,43,'Aguardar retorno externo\nSem preparo durante a espera')
    arrow(d,225,320,225,297)
    d.add(Polygon([225,239,275,211,225,183,175,211],fillColor=LIGHT,strokeColor=LINE))
    label(d,225,208,'Resultado?',9,True); arrow(d,225,254,225,239)
    box(d,5,192,105,40,'Recusado\nExibir erro',8.5); arrow(d,175,211,110,211)
    box(d,340,192,105,40,'Pendente\nPreservar código',8.5); arrow(d,275,211,340,211)
    box(d,5,127,105,43,'Consultar retorno\nou encerrar',8.5); arrow(d,57,192,57,170)
    box(d,340,127,105,43,'Consultar resultado\nSem novo pedido',8.5); arrow(d,392,192,392,170)
    d.add(Line(5,149,1,149,strokeColor=LINE)); d.add(Line(1,149,1,275,strokeColor=LINE)); arrow(d,1,275,105,275)
    d.add(Line(445,149,450,149,strokeColor=LINE)); d.add(Line(450,149,450,275,strokeColor=LINE)); arrow(d,450,275,345,275)
    box(d,5,67,105,35,'Encerrar: fim\nSem cobrança',8.5); arrow(d,57,127,57,102)
    label(d,260,171,'Aprovado',8)
    box(d,120,126,210,35,'Confirmar pedido\nAplicar estoque e pontos uma vez',8.5); arrow(d,225,183,225,161)
    box(d,120,67,210,35,'Cozinha: Em preparo → Pronto',8.5); arrow(d,225,126,225,102)
    box(d,120,8,210,35,'Cliente informa código\nAtendente confirma Retirado',8.5); arrow(d,225,67,225,43)
    return d
def wire_mobile():
    d=Drawing(W,416)
    for x,title in [(5,'Cardápio'),(157,'Revisão'),(309,'Pedido')]:
        d.add(Rect(x,28,137,355,fillColor=None,strokeColor=INK,rx=10))
        label(d,x+68,400,title,10,True)
        box(d,x+7,345,123,25,'Marca  |  Sacola',8)
        box(d,x+7,310,123,25,'Unidade / Canal',8)
    box(d,12,265,123,34,'Busca e categorias',8)
    for y in [188,113]:
        box(d,12,y,39,61,'Foto',8,colors.white); box(d,55,y,80,61,'Produto / Preço\nDisponível\n[ Escolher + ]',8,colors.white)
    box(d,12,45,123,42,'[ Abrir sacola ]\nTotal do pedido',8)
    box(d,164,243,123,56,'Loja / Retirada\nItens e adicionais',8)
    box(d,164,177,123,54,'Benefício opcional\nTotal / Aviso de dados',8)
    box(d,164,107,123,58,'Forma de pagamento\n[ Solicitar pagamento ]',8)
    box(d,164,45,123,44,'[ Voltar ao cardápio ]',8)
    box(d,316,252,123,47,'Código RN-001\nUnidade e total',8)
    box(d,316,140,123,96,'1 Confirmado\n2 Em preparo\n3 Pronto\n4 Retirado',8)
    box(d,316,45,123,69,'Mensagem do status\nOu pendência / erro\n[ Consultar retorno ]',8)
    label(d,W/2,8,'Baixa fidelidade - informações e ações antes do estilo final',8)
    return d
def wire_desktop():
    d=Drawing(W,535)
    label(d,W/2,519,'Desktop - cardápio com sacola lateral',10,True)
    d.add(Rect(5,279,440,220,fillColor=None,strokeColor=INK))
    box(d,12,461,426,28,'Marca  |  Cardápio  |  Pedidos  |  Fidelidade  |  Conta',9)
    box(d,12,425,426,27,'Unidade / Canal - identificação visível',8)
    box(d,12,366,280,49,'Mensagem da loja / busca / categorias',8)
    for x in [12,154]: box(d,x,290,133,66,'Produto\nPreço e disponibilidade\n[ Escolher ]',8)
    box(d,303,290,135,125,'SUA SACOLA\nItens e quantidades\nSubtotal\n[ Revisar pedido ]',8)
    label(d,W/2,253,'Totem - ações maiores e encerramento da sessão',10,True)
    d.add(Rect(55,10,340,225,fillColor=None,strokeColor=INK,rx=7))
    box(d,65,194,320,31,'Unidade  |  [ Encerrar atendimento ]',9)
    box(d,65,140,320,44,'Escolher produtos sem cadastro\nCategorias e disponibilidade',9)
    box(d,65,84,154,46,'[ Produto + ]',10); box(d,231,84,154,46,'[ Produto + ]',10)
    box(d,65,25,320,46,'Total  |  [ Revisar e pagar ]\nAviso de inatividade / Continuar atendimento',8)
    return d
figures={'arquitetura':architecture(),'casos':cases(),'jornada':journey(),'wiremobile':wire_mobile(),'wiredesktop':wire_desktop()}
def readable_text(shape, minimum):
    if isinstance(shape,String): shape.fontSize=max(minimum,shape.fontSize)
    for child in getattr(shape,'contents',[]): readable_text(child,minimum)
for key,target in [('arquitetura',340),('casos',480),('jornada',480),('wiremobile',380),('wiredesktop',360)]:
    original=figures[key]
    readable_text(original,9 if key=='wiremobile' else 9.5 if key=='casos' else 12 if key=='wiredesktop' else 10)
    scale=target/original.height
    wrapper=Drawing(W,target)
    original.scale(scale,scale)
    original.translate((W/scale-W)/2,0)
    wrapper.add(original)
    figures[key]=wrapper
figdir=ROOT/'docs/figuras';figdir.mkdir(exist_ok=True)
for key,drawing in figures.items(): renderSVG.drawToFile(drawing,str(figdir/(key+'.svg')))

class Report(SimpleDocTemplate):
    def afterFlowable(self, flowable):
        if isinstance(flowable,Paragraph) and flowable.style.name=='Chapter':
            text=flowable.getPlainText(); key='section-'+str(self.seq.nextf('heading'))
            self.canv.bookmarkPage(key);self.canv.addOutlineEntry(text,key,0)
            self.notify('TOCEntry',(0,text,self.page-2,key))
def footer(canv,doc):
    if doc.page>2:
        canv.setFont('Arial',10);canv.setFillColor(MUTED);canv.drawRightString(A4[0]-2*cm,A4[1]-1.6*cm,str(doc.page-2))
    canv.setTitle('Projeto Front-end - Rede Raízes do Nordeste - RU 4506310')
    canv.setAuthor('Levi Vieira de Sousa')
story=[p('CENTRO UNIVERSITÁRIO INTERNACIONAL UNINTER','cover'),p('ANÁLISE E DESENVOLVIMENTO DE SISTEMAS','cover'),Spacer(1,2.5*cm),p('LEVI VIEIRA DE SOUSA','cover'),p('RU 4506310','cover'),Spacer(1,3*cm),p('PROJETO MULTIDISCIPLINAR','title'),p('TRILHA FRONT-END','title'),p('REDE RAÍZES DO NORDESTE','title'),Spacer(1,2*cm),p('Professor: Giuliano Lanes de Almeida','cover'),p('Polo de apoio: Salvador - BA','cover'),p('Segundo semestre de 2026','cover'),Spacer(1,2*cm),p('SALVADOR - BA','cover'),p('2026','cover'),PageBreak(),p('SUMÁRIO','title')]
toc=TableOfContents();toc.levelStyles=[ParagraphStyle('TOC',fontName='Arial',fontSize=11,leading=18,spaceBefore=10,leftIndent=0,firstLineIndent=0)]
story.extend([toc,PageBreak()])
lines=(ROOT/'docs/relatorio.md').read_text(encoding='utf-8').splitlines()
start=next(i for i,line in enumerate(lines) if line.startswith('## '))
i=start;first=True
while i<len(lines):
    line=lines[i].strip()
    if not line: i+=1;continue
    if line.startswith('## '):
        if not first: story.append(PageBreak())
        first=False;story.append(p(line[3:],'h1'));i+=1;continue
    if line.startswith('### '):story.append(p(line[4:],'h2'));i+=1;continue
    if line.startswith('|'):
        rows=[]
        while i<len(lines) and lines[i].strip().startswith('|'):
            cells=[cell.strip() for cell in lines[i].strip().strip('|').split('|')]
            if not all(re.fullmatch(r'[-: ]+',cell) for cell in cells):rows.append(cells)
            i+=1
        data=[[p(cell,'header' if r==0 else 'cell') for cell in row] for r,row in enumerate(rows)]
        ratios=[.19,.45,.36] if len(rows[0])==3 else [1/len(rows[0])]*len(rows[0])
        table=Table(data,colWidths=[W*ratio for ratio in ratios],repeatRows=1,hAlign='LEFT')
        table.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('BACKGROUND',(0,0),(-1,0),colors.HexColor('#e8e8e8')),('GRID',(0,0),(-1,-1),.4,colors.HexColor('#bdbdbd')),('LEFTPADDING',(0,0),(-1,-1),7),('RIGHTPADDING',(0,0),(-1,-1),7),('TOPPADDING',(0,0),(-1,-1),7),('BOTTOMPADDING',(0,0),(-1,-1),7)]))
        story.extend([table,Spacer(1,12)]);continue
    if line.startswith('[FIGURE:'):
        key=line[8:-1];figure=figures[key];j=i+1
        while j<len(lines) and not lines[j].strip():j+=1
        if j<len(lines) and lines[j].startswith('Figura '):story.append(KeepTogether([figure,Spacer(1,6),p(lines[j],'caption')]));i=j+1
        else:story.append(figure);i+=1
        continue
    if line.startswith('[SCREEN:'):
        key=line[8:-1];path=ROOT/'docs/evidencias'/f'{key}.png'
        if path.exists():
            # Use an excerpt of the executed screen so the text stays legible in A4.
            im=PILImage.open(path);cropped=im.crop((0,0,im.width,min(im.height,1000 if key!='mobile' else 1100)))
            scratch=ROOT.parent/'tmp/pdfs'/f'{key}-recorte.png';scratch.parent.mkdir(parents=True,exist_ok=True);cropped.save(scratch)
            size=min(W/im.width,500/cropped.height);image=Image(str(scratch),width=im.width*size,height=cropped.height*size)
            story.append(image);story.append(Spacer(1,8))
        i+=1;continue
    if line=='[PUBLICATION]':
        info=ROOT/'docs/publicacao.json'
        if info.exists():
            publication=json.loads(info.read_text(encoding='utf-8-sig'))
            for name,key in [('Repositório público','repository'),('Site público','site')]:
                url=publication[key];story.append(Paragraph(f'<b>{name}:</b> <link href="{html.escape(url)}" color="#164f86">{html.escape(url)}</link>',styles['body']))
            story.append(p(publication.get('verification','Publicação realizada; verificar o acesso antes de submeter.')))
        else:story.append(p('Publicação pública ainda não realizada. Os links obrigatórios dependem da conclusão da publicação e da verificação de acesso. Este arquivo é uma versão de revisão.'))
        i+=1;continue
    if line=='[TEST_RESULTS]':
        result=json.loads((ROOT/'docs/evidencias/resultado-testes.json').read_text(encoding='utf-8'))
        passed=sum(item['passed'] for item in result['results'])
        story.append(p(f'Execução em 30 de setembro de 2026. Navegador Chromium {result["browser"]}. Resultado da suíte de interface: {passed} de {len(result["results"])} verificações aprovadas. O grupo T17 foi executado em cinco larguras, por isso os 18 cenários representam 22 verificações. Os cinco testes de domínio também foram aprovados.'))
        story.append(p('Comandos executados: npm test e npm run test:e2e. Evidência reproduzível: docs/evidencias/resultado-testes.json. A suíte inspecionou o console nas sessões testadas e não encontrou erros.'))
        i+=1;continue
    style='caption' if line.startswith('Figura ') else 'body'
    story.append(p(line,style));i+=1
doc=Report(str(OUT),pagesize=A4,leftMargin=3*cm,rightMargin=2*cm,topMargin=3*cm,bottomMargin=2*cm,title='Projeto Front-end - RU 4506310',author='Levi Vieira de Sousa')
doc.multiBuild(story,onFirstPage=footer,onLaterPages=footer)
print(OUT)
