# Raízes do Nordeste

Projeto Multidisciplinar, trilha Front-end. Levi Vieira de Sousa, RU 4506310. Curso: Análise e Desenvolvimento de Sistemas, UNINTER. Polo: Salvador - BA. Professor: Giuliano Lanes de Almeida. 2026, segundo semestre.

Aplicação demonstrativa em HTML, CSS e JavaScript, com cardápio regional, pedidos para retirada, pagamento externo simulado e fidelidade. Os canais Web, App e Totem compartilham regras e navegação; o App é uma representação web, sem pacote nativo.

## Executar

Use Node.js 22 ou superior. Na pasta do projeto:

```sh
npm install
npm start
```

Abra http://127.0.0.1:4173. Para servir com outra ferramenta, publique os arquivos estáticos sem modificar caminhos relativos. Módulos JavaScript precisam de um servidor HTTP; abrir `index.html` por duplo clique não é suficiente.

## Experimentar a jornada

1. Escolha uma unidade. Salvador usa formato expresso, sem cuscuz, e preço regional para a tapioca.
2. Escolha um produto, adicionais e uma observação. O suco esgotado não pode ser adicionado; a canjica só fica disponível em junho.
3. Revise a sacola e selecione um resultado do pagamento simulado.
4. Um pagamento aprovado gera o código RN-001 e libera a cozinha. Em Meus pedidos, acompanhe o status.
5. No painel Operação, inicie o preparo, marque como pronto e confirme a retirada.

Para fidelidade, use `cliente@exemplo.com` e senha de teste `nordeste123`. O perfil de teste começa com 100 pontos. Novos cadastros começam com zero. Ative o resgate na revisão: 100 pontos dão até R$ 5,00 de desconto. A cada R$ 1,00 efetivamente pago, ganha-se 1 ponto, sem arredondar para cima.

Não utilize dados ou senhas reais. Cadastros, senhas de teste, preferências, pedidos e auditoria ficam na memória da página e são reiniciados ao recarregar. Dados de cartão e CPF não são solicitados. A senha de teste é comparada por resumo SHA-256 em memória, sem representar autenticação segura de produção.

## Testes

```sh
npm test
npx playwright install chromium
npm run test:e2e
```

Os resultados reais e as capturas ficam em `docs/evidencias/`. O teste de interface cria uma sessão nova por cenário e verifica os fluxos, console, larguras de tela e acessibilidade com axe. Não valida integração financeira, carga de produção, aplicativo nativo ou leitores de tela em dispositivo real.

Para testar uma publicação, defina `TEST_URL` com a URL pública antes de executar o teste de interface.

## Organização

| Arquivo | Responsabilidade |
|---|---|
| `index.html` | Estrutura semântica, navegação e modal |
| `styles.css` | Interface responsiva e modos dos canais |
| `data.js` | Unidades, produtos, preços e cálculos |
| `store.js` | Estado e regras de pedido, pagamento, pontos e estoque |
| `views.js` | Telas e conteúdo apresentado |
| `app.js` | Navegação, formulários, ações e simulação assíncrona |
| `assets/` | Ilustrações SVG locais |
| `tests/` | Testes de domínio e navegador |
| `docs/` | Relatório, figuras e evidências |

## Publicação

O projeto pode ser publicado no GitHub Pages pela raiz da branch `main`. Não há dependência de banco, API privada, chave de serviço ou build. Repositório e site devem permanecer públicos para a avaliação, conforme o roteiro. Os endereços definitivos devem constar no PDF após a publicação e a verificação de acesso.

## Limites da demonstração

O painel de operação representa papéis sem controle administrativo real. Estoque e eventos são locais à sessão. Um back-end real precisa controlar autorização por unidade, concorrência, reserva de estoque, idempotência, webhooks assinados, sessões, retenção, auditoria e atendimento a direitos. O status só avança para a cozinha depois de confirmação simulada; os estados de falha mantêm o mesmo código para consulta.

As regras de campanha, valores, endereços e saldo inicial são fictícios. A LGPD aparece nos avisos e nas escolhas da interface, sem certificação de conformidade jurídica. A consulta automática de acessibilidade não substitui a avaliação humana.

## Referências

- UNINTER. Roteiro de Atividade Prática de Projeto Multidisciplinar, Trilha Front-End. Revisão 0.6, 2026.
- UNINTER. Projeto Multidisciplinar: Estudo de Caso, Rede Raízes do Nordeste. Revisão 0.3.
- [MDN: design responsivo](https://developer.mozilla.org/pt-BR/docs/Learn_web_development/Core/CSS_layout/Responsive_Design).
- [W3C: referência WCAG 2.2](https://www.w3.org/WAI/WCAG22/quickref/).
- [LGPD: Lei nº 13.709/2018](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm).
- [GitHub: publicação com Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).

As ilustrações foram construídas em SVG para este projeto, sem fotografias de terceiros. A documentação apresenta as verificações executadas.
