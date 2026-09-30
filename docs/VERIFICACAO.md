# Verificação da entrega

Data: 30 de setembro de 2026.

- `npm test`: cinco testes de domínio aprovados.
- `npm run test:e2e`: 22 verificações aprovadas no endereço local.
- `TEST_URL=https://llevisouza.github.io/raizes-do-nordeste-4506310/ npm run test:e2e`: 22 verificações aprovadas na publicação pública. A sintaxe de variável acima é para shells POSIX; em PowerShell, usar `$env:TEST_URL='https://llevisouza.github.io/raizes-do-nordeste-4506310/'` antes do comando.
- Site público: HTTP 200 e título da aplicação confirmado sem autenticação.
- Console: nenhum erro nas sessões analisadas pelos testes.
- Responsividade: 320, 390, 768, 1024 e 1440 pixels, sem rolagem horizontal da página.
- axe: nenhuma violação detectada nas páginas e regras testadas.
- PDF: conteúdo, sumário, links, diagramas, tabelas e capturas conferidos por extração e renderização das páginas.

O teste de inatividade do Totem utiliza relógio controlado do Playwright. As capturas foram produzidas com a aplicação em execução. A publicação contém dados fictícios e nenhum processamento financeiro real. O relatório JSON guarda a URL, versão de navegador e resultado individual das verificações.

Não foram executados teste de carga, integração com provedor financeiro, aplicativo nativo, leitor de tela em dispositivo real, equipamento físico de Totem ou pesquisa com usuários. Os papéis administrativos são representados, sem controle de autorização de produção.
