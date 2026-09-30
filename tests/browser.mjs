import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const base = process.env.TEST_URL || 'http://127.0.0.1:4173';
const output = new URL('../docs/evidencias/', import.meta.url);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const report = { date: new Date().toISOString(), url: base, browser: await browser.version(), results: [] };
async function check(name, run, viewport = { width: 1440, height: 1000 }) {
  const context = await browser.newContext({ viewport, locale: 'pt-BR' });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  try {
    await page.goto(base); await page.locator('.product').first().waitFor(); await run(page);
    assert.deepEqual(errors, []);
    report.results.push({ name, passed: true }); console.log(`PASS ${name}`);
  } catch (error) {
    report.results.push({ name, passed: false, error: error.message }); console.error(`FAIL ${name}: ${error.message}`);
    await page.screenshot({ path: new URL(`erro-${report.results.length}.png`, output).pathname.replace(/^\/(\w:)/, '$1'), fullPage: true });
  } finally { await context.close(); }
}
const add = async (page, name = 'Cuscuz da casa') => { await page.getByRole('button', { name: `Escolher ${name}`, exact: true }).click(); await page.getByRole('button', { name: /Adicionar à sacola/ }).click(); };
const login = async page => {
  await page.getByRole('link', { name: 'Minha conta', exact: true }).click();
  await page.locator('#login-form [name=email]').fill('cliente@exemplo.com');
  await page.locator('#login-form [name=password]').fill('nordeste123');
  await page.getByRole('button', { name: 'Entrar na demonstração' }).click();
  await page.getByRole('heading', { name: 'Cliente de teste', exact: true }).waitFor();
};
const pay = async (page, result = 'aprovado') => {
  await page.getByRole('button', { name: 'Revisar pedido →' }).click();
  await page.locator('[name=result]').selectOption(result);
  await page.locator('[name=terms]').check();
  await page.getByRole('button', { name: /Solicitar pagamento simulado/ }).click();
  await page.getByRole('heading', { name: 'Cada etapa, bem pertinho.' }).waitFor();
};
await check('T01 - catálogo por unidade e preço regional', async page => {
  await page.getByLabel('Unidade', { exact: true }).selectOption('salvador');
  assert.equal(await page.getByRole('button', { name: 'Escolher Cuscuz da casa', exact: true }).count(), 0);
  assert.ok((await page.locator('.product').filter({ has: page.getByRole('heading', { name: 'Tapioca de queijo coalho', exact: true }) }).innerText()).replace(/\s/g, ' ').includes('R$ 14,90'));
});
await check('T02 - busca sem resultado e recuperação', async page => {
  await page.getByRole('searchbox').fill('inexistente'); await page.getByRole('heading', { name: 'Nenhum produto encontrado' }).waitFor();
  await page.getByRole('searchbox').fill('cuscuz'); assert.equal(await page.locator('.product').count(), 1);
});
await check('T03 - produto esgotado não pode ser escolhido', async page => {
  assert.equal(await page.getByRole('button', { name: 'Escolher Suco de cajá', exact: true }).isDisabled(), true);
});
await check('T04 - adicionais, observação e subtotal', async page => {
  await page.getByRole('button', { name: 'Escolher Cuscuz da casa', exact: true }).click();
  await page.getByLabel('Ovo · + R$ 3,00', { exact: true }).check(); await page.getByLabel('Observação (opcional)').fill('Sem manteiga');
  await page.getByRole('button', { name: /Adicionar à sacola/ }).click();
  assert.ok((await page.locator('#cart').innerText()).replace(/\s/g, ' ').includes('R$ 18,90'));
  assert.ok((await page.locator('#cart').innerText()).includes('Sem manteiga'));
});
await check('T05 - quantidade, remoção e carrinho vazio', async page => {
  await add(page); await page.getByRole('button', { name: 'Aumentar Cuscuz da casa' }).click();
  assert.equal(await page.locator('#cart-count').innerText(), '2');
  await page.getByRole('button', { name: 'Diminuir Cuscuz da casa' }).click(); await page.getByRole('button', { name: 'Diminuir Cuscuz da casa' }).click();
  assert.equal(await page.getByRole('button', { name: 'Revisar pedido →' }).isDisabled(), true);
});
await check('T06 - troca de unidade pede confirmação e limpa carrinho', async page => {
  await add(page); await page.getByLabel('Unidade', { exact: true }).selectOption('salvador'); await page.getByRole('button', { name: 'Voltar', exact: true }).click();
  assert.equal(await page.getByLabel('Unidade', { exact: true }).inputValue(), 'recife'); assert.equal(await page.locator('#cart-count').innerText(), '1');
  await page.getByLabel('Unidade', { exact: true }).selectOption('salvador'); await page.getByRole('button', { name: 'Confirmar', exact: true }).click();
  assert.equal(await page.locator('#cart-count').innerText(), '0');
});
await check('T07 - cadastro exige consentimento e não pré-marca marketing', async page => {
  await page.getByRole('link', { name: 'Minha conta', exact: true }).click();
  assert.equal(await page.locator('#register-form [name=marketing]').isChecked(), false);
  await page.locator('#register-form [name=name]').fill('Visitante de teste'); await page.locator('#register-form [name=email]').fill('visitante@exemplo.com'); await page.locator('#register-form [name=password]').fill('teste12345');
  await page.getByRole('button', { name: 'Criar conta de teste' }).click(); assert.equal(await page.locator('#register-form').count(), 1);
  await page.locator('#register-form [name=loyalty]').check(); await page.getByRole('button', { name: 'Criar conta de teste' }).click(); await page.getByRole('heading', { name: 'Visitante de teste', exact: true }).waitFor();
});
await check('T08 - credenciais inválidas exibem erro', async page => {
  await page.getByRole('link', { name: 'Minha conta', exact: true }).click(); await page.locator('#login-form [name=email]').fill('cliente@exemplo.com'); await page.locator('#login-form [name=password]').fill('incorreta'); await page.getByRole('button', { name: 'Entrar na demonstração' }).click();
  await page.getByText('E-mail ou senha inválidos na demonstração.').waitFor();
});
await check('T09 - compra sem cadastro e retirada completa', async page => {
  await add(page); await pay(page); assert.ok((await page.locator('.order').innerText()).includes('Confirmado'));
  await page.getByRole('link', { name: 'Operação', exact: true }).click();
  for (const name of ['Iniciar preparo', 'Marcar pronto', 'Confirmar retirada']) await page.getByRole('button', { name, exact: true }).click();
  await page.getByRole('link', { name: 'Meus pedidos', exact: true }).click(); assert.ok((await page.locator('.order .status').innerText()).includes('Retirado'));
  await page.screenshot({ path: new URL('pedido-retirado.png', output).pathname.replace(/^\/(\w:)/, '$1'), fullPage: true });
});
await check('T10 - pagamento recusado não libera cozinha', async page => {
  await add(page); await pay(page, 'recusado'); await page.getByText('Pagamento recusado', { exact: true }).waitFor();
  await page.getByRole('link', { name: 'Operação', exact: true }).click(); assert.equal(await page.getByRole('button', { name: 'Iniciar preparo', exact: true }).count(), 0);
});
await check('T11 - pendência conserva código, benefício e crédito único', async page => {
  await login(page); await page.getByRole('link', { name: 'Cardápio', exact: true }).click(); await add(page); await page.getByRole('button', { name: 'Revisar pedido →' }).click();
  await page.locator('#redeem').check(); await page.locator('[name=result]').selectOption('pendente'); await page.locator('[name=terms]').check(); await page.getByRole('button', { name: /Solicitar pagamento simulado/ }).click();
  await page.getByText('Pagamento pendente', { exact: true }).waitFor(); assert.equal(await page.locator('.order-code').innerText(), 'RN-001');
  await page.getByRole('button', { name: 'Simular confirmação', exact: true }).click(); await page.getByRole('button', { name: 'Consultar retorno', exact: true }).click(); await page.getByText('Confirmado', { exact: true }).waitFor();
  assert.equal(await page.locator('.order').count(), 1);
  await page.getByRole('link', { name: 'Fidelidade', exact: true }).click(); assert.ok((await page.locator('.points').innerText()).includes('10'));
});
await check('T12 - recusa de marketing e revogação não bloqueiam compra', async page => {
  await page.getByRole('button', { name: 'Privacidade e dados', exact: true }).click();
  await page.locator('[name=marketing]').check(); await page.getByRole('button', { name: 'Salvar preferências', exact: true }).click();
  await page.locator('[name=marketing]').uncheck(); await page.getByRole('button', { name: 'Salvar preferências', exact: true }).click();
  await page.getByRole('link', { name: 'Cardápio', exact: true }).click(); await add(page); await pay(page); await page.getByText('Confirmado', { exact: true }).waitFor();
});
await check('T13 - exclusão de perfil e exportação sem senha', async page => {
  await login(page); await page.getByRole('button', { name: 'Gerenciar privacidade', exact: true }).click();
  const downloadPromise = page.waitForEvent('download'); await page.getByRole('button', { name: 'Exportar dados da sessão', exact: true }).click();
  const download = await downloadPromise; assert.equal(download.suggestedFilename(), 'dados-da-sessao.json');
  const stream = await download.createReadStream(); const chunks = []; for await (const chunk of stream) chunks.push(chunk); const exported = JSON.parse(Buffer.concat(chunks).toString()); assert.equal(exported.profile.email, 'cliente@exemplo.com'); assert.equal('digest' in exported.profile, false);
  await page.getByRole('button', { name: 'Excluir conta de teste', exact: true }).click(); await page.getByRole('button', { name: 'Confirmar', exact: true }).click();
  assert.equal(await page.getByRole('button', { name: 'Excluir conta de teste', exact: true }).isDisabled(), true);
});
await check('T14 - totem encerra dados do atendimento anterior', async page => {
  await add(page); await page.getByLabel('Canal', { exact: true }).selectOption('totem'); await page.getByRole('button', { name: 'Confirmar', exact: true }).click(); assert.equal(await page.locator('#cart-count').innerText(), '0');
  await add(page); await page.getByRole('button', { name: 'Encerrar atendimento', exact: true }).click(); await page.getByRole('button', { name: 'Confirmar', exact: true }).click(); assert.equal(await page.locator('#cart-count').innerText(), '0');
  await page.screenshot({ path: new URL('totem.png', output).pathname.replace(/^\/(\w:)/, '$1'), fullPage: true });
}, { width: 1024, height: 1366 });
await check('T15 - totem apaga sessão após 120 segundos de inatividade', async page => {
  await page.clock.install(); await page.getByLabel('Canal', { exact: true }).selectOption('totem'); await add(page); await page.clock.fastForward(120001); assert.equal(await page.locator('#cart-count').innerText(), '0');
});
await check('T16 - teclado abre e fecha modal com foco restaurado', async page => {
  const choose = page.getByRole('button', { name: 'Escolher Cuscuz da casa', exact: true }); await choose.focus(); await page.keyboard.press('Enter'); await page.getByRole('dialog').waitFor(); await page.keyboard.press('Escape'); assert.equal(await page.getByRole('dialog').count(), 0); assert.equal(await choose.evaluate(element => element === document.activeElement), true);
});
for (const width of [320, 390, 768, 1024, 1440]) await check(`T17-${width} - responsividade sem rolagem horizontal`, async page => {
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  for (const hash of ['conta', 'privacidade', 'fidelidade', 'operacao']) { await page.goto(`${base}#${hash}`); await page.locator('h1').waitFor(); assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true); }
  await page.goto(base); await page.locator('.product').first().waitFor();
  if ([390, 1440].includes(width)) await page.screenshot({ path: new URL(width === 390 ? 'mobile.png' : 'desktop.png', output).pathname.replace(/^\/(\w:)/, '$1'), fullPage: true });
}, { width, height: width === 390 ? 844 : 1000 });
await check('T18 - acessibilidade automatizada nas telas principais', async page => {
  for (const hash of ['cardapio', 'conta', 'privacidade', 'fidelidade', 'operacao']) {
    await page.goto(`${base}#${hash}`); await page.locator('h1').waitFor();
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    assert.deepEqual(results.violations.map(item => ({ id: item.id, targets: item.nodes.map(node => node.target) })), []);
  }
});
await browser.close();
await writeFile(new URL('resultado-testes.json', output), JSON.stringify(report, null, 2));
console.log(`${report.results.filter(result => result.passed).length}/${report.results.length} verificações aprovadas.`);
if (report.results.some(result => !result.passed)) process.exitCode = 1;
