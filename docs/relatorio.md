# Projeto Front-end: Rede Raízes do Nordeste

Levi Vieira de Sousa - RU 4506310
Análise e Desenvolvimento de Sistemas - UNINTER
Projeto Multidisciplinar - Trilha Front-end
Professor: Giuliano Lanes de Almeida
Polo de apoio: Salvador - BA
Segundo semestre de 2026

## 1 INTRODUÇÃO E OBJETIVOS

A rede Raízes do Nordeste cresceu a partir de uma lanchonete familiar de Recife. A expansão trouxe unidades com estruturas diferentes e novos canais de atendimento. O cliente, porém, continua precisando de uma experiência simples: encontrar o cardápio correto, escolher produtos disponíveis, pagar e retirar seu pedido. A proposta deste projeto concentra essas etapas em uma interface comum, adaptada à Web, ao App e ao Totem.

O problema principal é evitar que a diversidade da operação se transforme em confusão na compra. Uma unidade expressa não deve oferecer um produto que depende de uma cozinha completa; uma negativa de pagamento não deve aparecer como pedido confirmado; e o cadastro para fidelidade não deve obrigar o cliente a aceitar campanhas. Essas situações orientam os requisitos e as decisões de navegação.

O objetivo geral é representar uma jornada de pedido para retirada, do primeiro contato com o cardápio à confirmação no balcão. Os objetivos específicos são organizar o cardápio por unidade, demonstrar as respostas do pagamento externo, permitir acompanhamento de status, representar o programa de pontos e tornar visíveis as escolhas de privacidade.

Os usuários considerados são cliente, atendente, equipe de cozinha e gerente ou administrador. O serviço externo de pagamento participa como ator de integração. A matriz recebe indicadores consolidados em uma evolução do sistema; o demonstrador permite observar indicadores locais, sem afirmar que existe uma operação distribuída real.

A entrega adotada é a opção B do roteiro: HTML, CSS e JavaScript, com dados fictícios. O App é representado por um modo da interface web responsiva; não foi desenvolvido um aplicativo nativo. O Totem utiliza a mesma lógica de pedidos e acrescenta controles de encerramento de sessão. O pagamento não realiza cobranças, conforme a delimitação da atividade.

## 2 ANÁLISE DO NEGÓCIO E REQUISITOS

### 2.1 Recorte e premissas

Foram definidos três exemplos de unidade: Recife - Boa Vista, com cozinha completa; Salvador - Centro, em formato expresso; e Caruaru - Centro, com cozinha completa. Nomes, endereços, preços e estoque são fictícios. A unidade de Salvador não oferece cuscuz neste recorte e possui um preço próprio para a tapioca. A canjica só é liberada em junho, conforme a data do dispositivo, para demonstrar a sazonalidade citada no estudo de caso.

O pedido é sempre para retirada. Não se exige cadastro para comprar; a conta é necessária apenas para representar o vínculo com a fidelidade. Não se coletam CPF, número de cartão, endereço residencial ou data de nascimento. A simplificação reduz dados desnecessários e mantém o foco no fluxo de Front-end.

As prioridades são: P1, essencial à compra e à privacidade; P2, apoio à experiência ou à operação; P3, evolução que depende de serviços de back-end. Um requisito conceitual continua fazendo parte da solução, mas não deve ser confundido com uma funcionalidade pronta no demonstrador.

### 2.2 Requisitos funcionais

| ID / prioridade | Requisito e critério de aceitação | Evidência / alcance |
|---|---|---|
| RF01 / P1 | Selecionar uma unidade antes de revisar o pedido. A identificação da loja acompanha o carrinho. | Seletor de unidade e tela Revisão. |
| RF02 / P1 | Exibir cardápio, preço regional, disponibilidade e produto sazonal por unidade. | Salvador não exibe cuscuz; esgotados têm ação desativada. |
| RF03 / P1 | Permitir busca e filtro por categoria, com recuperação quando não houver resultado. | Busca textual e categorias do cardápio. |
| RF04 / P1 | Personalizar itens com adicionais e observação limitada a 120 caracteres. | Modal do produto, avisos de alergênicos e cálculo em centavos. |
| RF05 / P1 | Somar itens, alterar quantidades, remover produtos e impedir excesso de estoque local. | Sacola e verificação de saldo por produto. |
| RF06 / P1 | Confirmar a limpeza da sacola ao mudar de unidade. | Modal com Confirmar e Voltar; preço e disponibilidade são recalculados. |
| RF07 / P1 | Representar cadastro e autenticação, sem exigir conta para comprar. | Conta de teste e cadastro em memória. Não há autenticação real. |
| RF08 / P1 | Revisar unidade, itens, total, retirada e aviso de dados antes de solicitar pagamento. | Tela Revisão; confirmação de leitura obrigatória. |
| RF09 / P1 | Solicitar pagamento a serviço externo e mostrar aprovação, recusa ou pendência. | Adaptador simulado com retorno assíncrono. Sem cobrança. |
| RF10 / P1 | Impedir preparo antes da confirmação e manter o código durante consulta de retorno. | Pedido pendente ou recusado não aparece na fila da cozinha. |
| RF11 / P1 | Acompanhar Confirmado, Em preparo, Pronto para retirada e Retirado. | Meus pedidos e ações do painel Operação. |
| RF12 / P2 | Creditar pontos uma única vez e resgatar benefício apenas com saldo suficiente. | 1 ponto por R$ 1 pago; 100 pontos dão até R$ 5 de desconto. |
| RF13 / P2 | Apresentar promoção e distinguir campanha geral de personalização autorizada. | Combo da casa e preferências separadas de marketing e histórico. |
| RF14 / P1 | Exibir finalidade dos dados, permitir revogação, exportação e exclusão do perfil. | Privacidade; JSON sem senha; exclusão desvincula o cliente dos pedidos. |
| RF15 / P1 | Adaptar a jornada aos canais Web, App e Totem e limpar o atendimento compartilhado. | Seletor de canal, alvos maiores no Totem e encerramento automático. |
| RF16 / P2 | Representar a fila e a confirmação de retirada por unidade. | Cozinha atualiza preparo; atendente confirma retirada. |
| RF17 / P3 | Gerenciar catálogo, campanhas, estoque e relatórios consolidados com autorização por papel. | Estoque, vendas e eventos locais demonstrados. Edição e consolidação são conceituais. |
| RF18 / P3 | Auditar cancelamentos, descontos excepcionais, acessos e ajustes com trilha persistente. | Eventos locais de pagamento e preparo; auditoria completa depende de back-end. |

### 2.3 Requisitos não funcionais

| ID / prioridade | Requisito | Critério de avaliação |
|---|---|---|
| RNF01 / P1 | Mobile-first e responsividade. | Layout útil entre 320 e 1440 pixels, sem rolagem horizontal da página. Menus podem rolar dentro do seu próprio contêiner. |
| RNF02 / P1 | Acessibilidade. | Rótulos, foco visível, navegação por teclado, modal com Escape, mensagens com texto e regiões de anúncio. Verificação automática complementada por revisão visual. |
| RNF03 / P2 | Desempenho de interface. | Arquivos estáticos, SVG locais, imagens secundárias com carregamento adiado e ausência de bibliotecas de execução. Medição de carga real permanece pendente. |
| RNF04 / P1 | Tratamento de falhas. | Retorno pendente preserva o pedido; recusa oferece consulta; cliques durante processamento não criam uma nova cobrança simulada. |
| RNF05 / P1 | Privacidade e minimização. | Não coletar cartão, CPF ou idade. Dados fictícios apenas na memória. Marketing opcional e revogável sem bloquear compra. |
| RNF06 / P2 | Manutenção. | Separação entre catálogo, regras, telas e controle de eventos; testes reproduzíveis. |
| RNF07 / P3 | Escala e disponibilidade. | Produção deve separar API, pagamento e operação por unidade, permitir monitoramento e reconsulta após falhas. Não há evidência de teste de carga neste recorte. |
| RNF08 / P1 | Transparência da demonstração. | Aviso de simulação, limites do App web, dos papéis administrativos e dos dados temporários visíveis ao avaliador. |

## 3 ARQUITETURA E DECISÕES DA INTERFACE

A solução utiliza HTML semântico para a estrutura, CSS para os ajustes de tela e módulos JavaScript para o comportamento. Essa escolha atende ao tamanho da aplicação e permite publicar os arquivos diretamente, sem etapa de compilação. Um framework não resolveria, por si só, os pontos mais importantes do caso: estado correto do pedido, diferenças entre unidades e resposta às falhas de pagamento.

O arquivo data.js descreve unidades, produtos e regras de cálculo. store.js concentra o estado e as transições de pedido, estoque e pontos. views.js representa as telas. app.js associa formulários, navegação e eventos. O estado fica na memória da página. Recarregar reinicia a demonstração; não se usa armazenamento persistente para dados pessoais.

A navegação mantém cinco acessos principais: Cardápio, Meus pedidos, Fidelidade, Minha conta e Operação. A revisão só é aberta quando a sacola contém produtos. Privacidade pode ser acessada pelo rodapé e pela conta. No desktop, a sacola aparece ao lado do cardápio; em telas menores, pode ser aberta pelo botão no cabeçalho.

As cores terrosas, o verde e as ilustrações simples se relacionam com a identidade da rede. Os elementos decorativos não substituem informações de preço, disponibilidade, alergênicos ou status. A aparência é compartilhada entre canais para reduzir a necessidade de reaprender o pedido, mas o Totem utiliza botões maiores e evita depender do cadastro.

O sistema real teria uma API responsável por disponibilidade, preços, autenticação, autorização e pedidos. Uma camada de integração solicitaria o pagamento ao provedor e receberia seus retornos. A interface apresentaria o resultado informado pelo servidor. Um redirecionamento concluído no navegador não deveria, sozinho, confirmar o pagamento.

[FIGURE:arquitetura]

Figura 1 - Organização do demonstrador e limites dos serviços futuros. Fonte: elaboração para este projeto.

### 3.1 Estados e consistência

O pagamento possui os estados pendente, recusado, aprovado e cancelado sem cobrança. Um pedido em espera não é mostrado como confirmado. A cozinha só recebe um pedido aprovado, que então avança por quatro etapas. O demonstrador bloqueia novas alterações na sacola quando existe uma tentativa pendente ou recusada; o cliente precisa consultar ou encerrar essa tentativa.

O total é calculado em centavos para evitar erros de soma em números decimais. O saldo do programa de fidelidade só muda no retorno aprovado. A confirmação repetida do mesmo pedido não desconta estoque nem credita pontos novamente. Em produção, essas garantias precisam ser implementadas no servidor, com transação, chave de idempotência e proteção contra concorrência entre clientes.

## 4 MODELAGEM DE CASOS DE USO

O Cliente consulta o cardápio, realiza o pedido, acompanha as etapas, participa da fidelidade e gerencia seus dados. O Atendente confirma a retirada e ajuda o cliente no balcão. A Cozinha atualiza o andamento do preparo. O Gerente ou Administrador mantém a oferta e consulta indicadores e operações sensíveis. O Sistema de Pagamento Externo recebe a solicitação e informa o resultado.

[FIGURE:casos]

Figura 2 - Diagrama de casos de uso com os cinco atores exigidos. Fonte: elaboração para este projeto. O diagrama inclui capacidades conceituais de gestão; elas não representam permissões implementadas no navegador.

### 4.1 Relação entre atores, telas e responsabilidades

| Ator | Tela / interação | Responsabilidade e limite |
|---|---|---|
| Cliente | Cardápio, revisão, pedidos, conta, fidelidade e privacidade. | Escolher, confirmar e acompanhar. Não altera o andamento da cozinha. |
| Atendente | Operação e código do pedido. | Confirmar retirada após status Pronto. O atendimento humano é previsto no caso. |
| Cozinha | Fila da unidade em Operação. | Iniciar preparo e informar que está pronto, somente após pagamento aprovado. |
| Gerente / Administrador | Disponibilidade, indicadores e registro de eventos. | Gestão de catálogo e consolidação previstas; controle de papel depende de API. |
| Pagamento externo | Solicitação e consulta de resultado. | Retorna aprovação, negativa ou pendência. Representado por simulação. |

## 5 FUNCIONALIDADE DETALHADA: SOLICITAR PAGAMENTO

### 5.1 Identificação e condições

UC-PAG-01 tem como ator principal o Cliente e como ator de apoio o Sistema de Pagamento Externo. O objetivo é obter uma resposta financeira antes de liberar o preparo. As pré-condições são unidade selecionada, sacola não vazia, produtos disponíveis, total calculado e revisão das informações do pedido. Para resgatar benefício, é preciso estar na conta e possuir ao menos 100 pontos.

Na saída aprovada, o pedido recebe confirmação, o estoque local é reduzido e os pontos são ajustados uma única vez. Na saída recusada ou pendente, o código continua disponível, o preparo não é liberado e o saldo de fidelidade permanece igual. O demonstrador não possui transação financeira real; a mesma lógica precisaria receber respostas verificadas do servidor em produção.

### 5.2 Fluxo principal

1. O cliente abre a revisão e confere unidade, itens, adicionais, benefício e total.
2. O cliente escolhe Pix ou cartão em ambiente externo e lê o aviso de dados.
3. A interface cria o pedido e apresenta o estado de processamento, bloqueando novas solicitações durante a espera.
4. O sistema de integração solicita o pagamento e associa a tentativa ao código do pedido. No demonstrador, um retorno escolhido pelo avaliador substitui esse serviço.
5. O retorno aprovado é registrado. A interface informa a confirmação e apresenta o código para retirada.
6. O pedido entra na fila da cozinha. Estoque e fidelidade são ajustados sem repetir efeitos para a mesma confirmação.
7. O cliente acompanha o preparo e recebe o aviso de retirada após a cozinha marcar o pedido como pronto.

### 5.3 Fluxos alternativos

| Situação | Resposta da interface | Regra preservada |
|---|---|---|
| Pagamento recusado | Exibe a negativa e permite consultar outro resultado da simulação ou encerrar a tentativa. | Não libera cozinha e não consome pontos. |
| Serviço sem retorno | Exibe pendência e orienta consultar antes de refazer. | O código se mantém; ausência de resposta não vira aprovação. |
| Confirmação duplicada | Mantém o resultado já aplicado. | Estoque e pontos não sofrem outro ajuste. |
| Produto sem saldo na confirmação | Exibe falha de disponibilidade; a simulação não gera cobrança. | Em produção, estoque deve ser reservado e falhas financeiras tratadas pelo servidor. |
| Benefício sem saldo válido | Recusa a aplicação e orienta refazer sem o desconto. | Nenhum saldo fica negativo. |
| Cliente encerra tentativa | Mostra cancelamento sem cobrança e esvazia a sacola. | Não se aplica a pagamento já aprovado. |

No fluxo real, expiração, estorno, abandono do provedor e confirmação tardia precisam de tratamento próprio. A interface não oferece cancelamento de pagamento aprovado, pois isso dependeria da política comercial e da integração financeira. A auditoria persistente deve guardar identificador da tentativa, resultado e momento do processamento sem incluir credenciais bancárias.

## 6 JORNADA DO USUÁRIO

A jornada começa na escolha da unidade e termina na retirada do pedido. O cadastro aparece como uma possibilidade para participar da fidelidade, sem interromper a compra como visitante. A revisão funciona como ponto de conferência: evita que o cliente descubra a unidade ou o total somente depois do pagamento.

[FIGURE:jornada]

Figura 3 - Jornada com decisões de pagamento e retirada. Fonte: elaboração para este projeto.

| Etapa | Decisão do usuário / retorno | Informação necessária |
|---|---|---|
| Descoberta | Escolher unidade e canal. | Nome da loja, formato e previsão de retirada. |
| Escolha | Buscar, filtrar e personalizar produto. | Preço local, adicionais, disponibilidade e alergênicos. |
| Revisão | Conferir sacola e escolher fidelidade opcional. | Quantidade, total e benefício aplicado. |
| Pagamento | Solicitar e aguardar retorno. | Aviso de processamento externo e ausência de cobrança na simulação. |
| Falha ou espera | Consultar resposta ou encerrar tentativa. | Mensagem específica; nenhum pedido liberado indevidamente. |
| Confirmação | Acompanhar etapas pelo código. | Unidade, itens e estado atual. |
| Retirada | Informar o código ao atendente. | Aviso Pronto para retirada e confirmação final. |

No Totem, o cliente não precisa possuir um aparelho ou uma conta. A sessão compartilhada exige limpeza depois do atendimento. O modo App prioriza pedido antecipado e fidelidade, mas preserva as mesmas mensagens e etapas da Web. O atendimento de balcão é representado pelo papel do Atendente no painel de operação.

## 7 WIREFRAMES E DESIGN RESPONSIVO

Os wireframes representam a distribuição das informações antes da aparência final. Mantêm a hierarquia entre unidade, produtos, sacola, total e próximo passo. São versões de baixa fidelidade, sem fotografias ou detalhes decorativos, e servem para relacionar requisitos e telas.

[FIGURE:wiremobile]

Figura 4 - Wireframes mobile: cardápio, revisão e acompanhamento. Fonte: elaboração para este projeto.

### 7.1 Mobile e App

O cardápio usa uma coluna em telas pequenas. Busca e categorias ficam antes dos produtos; o botão Sacola continua disponível no cabeçalho. A revisão mostra primeiro a retirada e o pagamento, com o resumo do pedido logo em seguida. Os status são apresentados como etapas com texto, sem depender exclusivamente de cores.

A interface começa pelas regras de telas menores e amplia a organização a partir de 640 pixels. Em 1000 pixels, o cardápio e a sacola passam a ficar lado a lado. Os pontos de quebra foram escolhidos conforme o espaço necessário ao conteúdo, não para identificar marcas de dispositivos. Essa decisão segue as práticas descritas pela MDN (2026).

[FIGURE:wiredesktop]

Figura 5 - Wireframes desktop e Totem. Fonte: elaboração para este projeto.

### 7.2 Desktop e Totem

No desktop, a sacola lateral permite acompanhar o total enquanto o cliente compara produtos. No Totem, os botões principais possuem altura mínima de 56 pixels e há ação de encerrar atendimento. Após 100 segundos sem interação, a interface avisa sobre o encerramento em 20 segundos e permite continuar. Com 120 segundos de inatividade, perfil e pedidos da sessão são apagados.

O modal utiliza o elemento dialog, limita o foco ao conteúdo aberto e pode ser fechado com Escape, exceto durante o processamento do pagamento. Rótulos visíveis identificam formulários, e mensagens dinâmicas usam regiões de anúncio. A avaliação automática com axe não substitui testes com leitores de tela ou usuários reais; esses testes continuam recomendados antes de uma implantação.

## 8 LGPD E PRIVACIDADE NA INTERFACE

A privacidade é tratada em pontos concretos da jornada. O cadastro apresenta a finalidade de fidelidade e oferece uma opção independente para campanhas. Na página Privacidade, a autorização para marketing é separada da autorização de sugestões com histórico. Ambas começam desmarcadas e podem ser revogadas. Nenhuma delas impede uma compra como visitante.

O aviso da revisão informa quais dados organizam o pedido. A confirmação de leitura não é apresentada como autorização genérica para todos os tratamentos. Para uma operação real, a definição de bases legais e prazos precisa considerar as finalidades e obrigações do controlador. Os princípios de finalidade, necessidade e transparência e os direitos do titular são tratados nos artigos 6º e 18 da LGPD; o consentimento e sua revogação têm disciplina própria nos artigos 7º e 8º (BRASIL, 2018).

| Informação / controle | Finalidade na proposta | Implementação e limite |
|---|---|---|
| Produtos, total, unidade e status | Organizar compra e retirada. | Guardados em memória, sem API. No sistema real, execução do pedido e retenção precisam ser formalizadas. |
| Nome e e-mail fictícios | Identificação da conta e vínculo de pontos. | Cadastro demonstrativo. Não há verificação de identidade ou e-mail. |
| Senha de teste | Representar acesso à conta. | Resumo em memória; não substitui autenticação, sessão protegida ou política de segurança. |
| Marketing e histórico | Representar comunicações e personalização opcionais. | Escolhas separadas, sem caixas pré-marcadas. Não há envio de campanhas. |
| Dados de cartão / CPF / idade | Não necessários ao recorte. | Não são coletados. Pagamento usa somente método e resultado fictícios. |
| Exportação | Dar visibilidade ao conteúdo da sessão. | Gera JSON com perfil, preferências e pedidos, sem senha ou seu resumo. |
| Exclusão | Remover o perfil fictício. | Apaga o perfil e desvincula o e-mail dos pedidos. Não é certificação de anonimização de uma base real. |

A ausência de cookies de rastreamento evita a necessidade de um painel fictício de consentimento para tecnologias que não existem no demonstrador. Na produção, serviços analíticos ou outras tecnologias precisariam ser inventariados antes de apresentar escolhas. A tela também informa que recarregar a página reinicia os dados temporários.

No Totem, entrar ou sair do canal compartilhado limpa a sessão mediante confirmação quando há dados. O encerramento manual e o tempo de inatividade reduzem a exposição do atendimento anterior. Em uma implantação, o back-end ainda precisaria revogar a sessão e impedir consulta de pedidos de outro cliente.

Antes de operar com pessoas reais, a rede deve definir controlador, canal de atendimento ao titular, política de retenção, perfis de acesso, registro das autorizações, descarte e auditoria. O demonstrador mostra escolhas de interface; não declara conformidade integral com a LGPD.

## 9 ENTREGA TÉCNICA E ROTEIRO DE AVALIAÇÃO

A aplicação pode ser executada localmente com Node.js 22 ou superior, usando npm install e npm start. O endereço local é http://127.0.0.1:4173. O projeto é estático e usa caminhos relativos, compatíveis com publicação pela raiz da branch principal no GitHub Pages. Os módulos JavaScript devem ser servidos por HTTP, portanto a abertura por duplo clique não substitui a execução indicada.

[PUBLICATION]

O roteiro de demonstração é: selecionar Recife, adicionar Cuscuz da casa, revisar, confirmar leitura do aviso e solicitar pagamento aprovado. Em Meus pedidos aparece o código RN-001. No painel Operação, iniciar preparo, marcar pronto e confirmar retirada. Ao voltar a Meus pedidos, o estado final é Retirado.

Para fidelidade, a conta cliente@exemplo.com usa a senha fictícia nordeste123 e começa com 100 pontos de teste. Novos cadastros começam com zero. Ao resgatar o benefício em um cuscuz de R$ 15,90, o total passa para R$ 10,90. Com pagamento aprovado, são usados 100 pontos e creditados 10 pontos. Se o retorno for pendente ou recusado, o saldo inicial permanece igual.

Para examinar falhas, selecionar os resultados Recusado ou Sem retorno / pendente na revisão. A tentativa mantém o código e não libera a cozinha. Simular confirmação consulta o retorno do mesmo pedido. Encerrar tentativa representa abandono sem cobrança. Esses controles existem para o avaliador exercitar os estados, não seriam seletores oferecidos ao cliente em um serviço real.

Os arquivos de código, os testes e este relatório editável acompanham a entrega. As ilustrações são SVG locais, sem dependência de fotografias ou serviços remotos. O arquivo final deve manter o nome 4506310_Projeto_Front_End.pdf, conforme o padrão solicitado pelo roteiro.

## 10 PLANO DE TESTES

A estratégia combina testes de regras com execução em navegador. Os testes de domínio verificam catálogo, cálculo, estoque, pedido vazio e efeitos do pagamento. Os testes de interface percorrem caminhos positivos e negativos em sessões novas, verificando o texto apresentado ao cliente, as ações disponíveis e a ausência de erros de JavaScript.

O ambiente utilizado é Chromium com Playwright. A verificação de acessibilidade utiliza axe nas páginas principais. As larguras testadas são 320, 390, 768, 1024 e 1440 pixels. O teste de inatividade usa relógio controlado para exercitar os 120 segundos do Totem sem esperar esse período em tempo real.

### 10.1 Cenários funcionais, negativos e de privacidade

| ID | Entrada e passos | Saída esperada / mensagem |
|---|---|---|
| T01 | Selecionar Salvador no cardápio. | Cuscuz ausente; tapioca a R$ 14,90. Unidade correspondente à sacola. |
| T02 | Buscar inexistente; depois buscar cuscuz. | Nenhum produto encontrado; depois um resultado coerente. |
| T03 | Tentar escolher Suco de cajá sem estoque. | Botão desativado e aviso Esgotado. |
| T04 | Cuscuz, adicional Ovo, observação Sem manteiga. | Item com adicional e observação; subtotal R$ 18,90. |
| T05 | Adicionar item, aumentar, diminuir e remover. | Contagem e valor atualizados; revisão desativada na sacola vazia. |
| T06 | Trocar unidade com item; primeiro Voltar, depois Confirmar. | Voltar preserva loja e sacola; Confirmar troca e limpa os itens. |
| T07 | Preencher cadastro sem adesão; depois marcar adesão. | Cadastro bloqueado sem confirmação; conta criada com marketing desmarcado. |
| T08 | cliente@exemplo.com com senha incorreta. | E-mail ou senha inválidos na demonstração. |
| T09 | Comprar como visitante; avançar preparo e retirada. | Código único; etapa final Retirado. Sem exigência de cadastro. |
| T10 | Solicitar pagamento Recusado. | Negativa explícita; nenhum pedido liberado à cozinha. |
| T11 | Conta com 100 pontos, resgate e pagamento Pendente; consultar Aprovado. | Mesmo código e um pedido; saldo não muda enquanto pendente; crédito de 10 pontos após confirmação. |
| T12 | Aceitar e revogar marketing; realizar compra. | Preferência revogada e compra continua possível. |
| T13 | Exportar perfil de teste e depois excluí-lo. | JSON sem senha ou resumo; perfil removido e ação de exclusão desativada. |
| T14 | Trocar para Totem com sacola; encerrar novo atendimento. | Confirmação limpa sessão; próximo cliente encontra sacola vazia. |
| T15 | Totem com item; avançar relógio em 120001 ms. | Sessão encerrada por inatividade e contagem zero. |
| T16 | Focar Escolher, pressionar Enter e depois Escape. | Modal abre, fecha e devolve foco ao botão de origem. |
| T17 | Abrir telas nas cinco larguras e observar dimensões. | Nenhuma rolagem horizontal da página; controles internos mantêm acesso. |
| T18 | Analisar páginas com axe nas regras WCAG selecionadas. | Ausência de violações detectadas no recorte automático. |

### 10.2 Critérios de liberação e verificações pendentes

Para esta entrega, devem passar os testes de domínio e navegador, sem erros de console nos cenários executados. Os links públicos precisam responder sem login e a versão publicada deve reproduzir o fluxo principal. Capturas e relatórios são evidências complementares, não substitutos de um acesso funcional.

Não foram executados teste de carga, pagamento com provedor real, aplicativo nativo, avaliação com usuários reais ou testes em leitor de tela e equipamento físico de Totem. Também não existe auditoria persistente ou sincronização entre dispositivos. Esses itens precisam de implementação e validação próprias antes de qualquer operação real.

## 11 EVIDÊNCIAS DE EXECUÇÃO

[TEST_RESULTS]

As primeiras execuções encontraram rolagem horizontal no cardápio mobile. A correção limitou a largura mínima dos filhos da grade e manteve o menu de categorias com rolagem dentro do seu contêiner. A suíte foi executada novamente após a correção. Os resultados atuais, e não a tentativa anterior, são os usados no resumo de aprovação.

[SCREEN:desktop]

Figura 6 - Captura da interface desktop, feita no navegador. Fonte: execução local do demonstrador.

[SCREEN:mobile]

Figura 7 - Captura mobile em 390 pixels. Fonte: execução local do demonstrador.

[SCREEN:pedido-retirado]

Figura 8 - Pedido com pagamento aprovado e retirada concluída. Fonte: execução local do demonstrador.

O relatório JSON e os testes acompanham o repositório para permitir conferência. A ausência de violações no axe se refere às páginas e regras analisadas; não significa certificação de acessibilidade. As capturas mostram a aplicação efetivamente executada, sem representar aprovação do professor ou resultados de campo.

## 12 CONCLUSÃO

A proposta organiza a experiência de compra em torno da unidade e do estado do pedido. A separação entre pagamento e preparo evita que uma falha financeira apareça como confirmação operacional. A fidelidade é tratada como uma escolha adicional, com regras de saldo ligadas ao valor efetivamente pago. Na privacidade, a distinção entre pedido, fidelidade e campanhas permite apresentar finalidades e escolhas sem condicionar a compra à personalização.

O demonstrador é suficiente para observar os principais fluxos de Front-end e discutir seus efeitos nas outras áreas. O back-end precisaria assumir a autoridade sobre estoque, pagamento, autorização e auditoria. QA teria de ampliar os cenários para concorrência, disponibilidade, dispositivos e integração externa. A política de dados dependeria de decisões formais do controlador e da implementação de mecanismos de segurança e retenção.

A evolução mais importante é transformar os limites documentados em contratos e testes de integração. Outra prioridade é validar a jornada com clientes e equipes das unidades, principalmente no Totem e nos momentos de espera ou erro. Uma aparência consistente ajuda a orientar, mas a confiabilidade depende de mensagens corretas e de transições que respeitem o negócio.

## 13 REFERÊNCIAS

UNINTER. Roteiro de Atividade Prática de Projeto Multidisciplinar: Trilha Front-End. Rede Raízes do Nordeste. Rev. 0.6. Professor Giuliano Lanes de Almeida. 2026. Material disponibilizado para a atividade.

UNINTER. Projeto Multidisciplinar: Orientações e Estudo de Caso. Rede Raízes do Nordeste. Rev. 0.3, versão final. Material disponibilizado para a atividade.

MDN WEB DOCS. Design responsivo. Disponível em: https://developer.mozilla.org/pt-BR/docs/Learn_web_development/Core/CSS_layout/Responsive_Design. Acesso em: 30 set. 2026.

WORLD WIDE WEB CONSORTIUM. How to Meet WCAG: Quick Reference - WCAG 2.2. Disponível em: https://www.w3.org/WAI/WCAG22/quickref/. Acesso em: 30 set. 2026.

BRASIL. Lei nº 13.709, de 14 de agosto de 2018. Lei Geral de Proteção de Dados Pessoais. Disponível em: https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm. Acesso em: 30 set. 2026.

GITHUB. Creating a GitHub Pages site. Disponível em: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site. Acesso em: 30 set. 2026.

