import { units, money, available } from './data.js';
import { state, catalog, canAdd, createOrder, settlePayment, advanceOrder, abandonOrder, eraseUser, resetSession } from './store.js';
import { escape, button, menuView, cartView, productsView, checkoutView, ordersView, loyaltyView, accountView, privacyView, operationsView } from './views.js';
const main = document.querySelector('#content');
const modal = document.querySelector('#modal');
const profiles = new Map();
let timer, noticeTimer, modalReturnFocus;
const routes = { cardapio: menuView, revisao: checkoutView, pedidos: ordersView, fidelidade: loyaltyView, conta: accountView, privacidade: privacyView, operacao: operationsView };
const labels = { cardapio: 'Cardápio', pedidos: 'Meus pedidos', fidelidade: 'Fidelidade', conta: 'Minha conta', operacao: 'Operação' };
const route = () => location.hash.slice(1) || 'cardapio';
const unresolved = () => state.orders.find(order => ['pendente', 'recusado'].includes(order.payment));
function notice(text) {
  const box = document.querySelector('#notice'); box.textContent = text; box.classList.add('visible');
  clearTimeout(noticeTimer); noticeTimer = setTimeout(() => box.classList.remove('visible'), 6000);
}
function render(focus = false) {
  const current = route();
  main.innerHTML = (routes[current] || menuView)();
  document.querySelector('#navigation').innerHTML = Object.entries(labels).map(([path, text]) => `<a class="nav-link" href="#${path}" ${current === path ? 'aria-current="page"' : ''}>${text}</a>`).join('') + (state.channel === 'totem' ? '<button class="text-button" data-action="reset">Encerrar atendimento</button>' : '');
  document.querySelector('#cart-count').textContent = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelector('#unit').value = state.unit; document.querySelector('#channel').value = state.channel;
  document.body.className = `mode-${state.channel}`;
  if (focus) main.focus();
}
function navigate(path) { if (route() === path) render(true); else location.hash = path; }
function openModal(title, content) {
  modalReturnFocus = document.activeElement;
  modal.innerHTML = `<div class="modal-head"><h2 id="modal-title">${title}</h2><button class="close" data-action="close" aria-label="Fechar">×</button></div>${content}`;
  modal.showModal();
}
modal.addEventListener('close', () => modalReturnFocus?.isConnected && modalReturnFocus.focus());
function confirmAction(title, text, onConfirm) {
  openModal(title, `<p>${text}</p><div class="actions"><button class="button" id="confirm-action">Confirmar</button>${button('Voltar', 'close', '', 'secondary')}</div>`);
  document.querySelector('#confirm-action').addEventListener('click', () => { modal.close(); onConfirm(); }, { once: true });
}
function productModal(id) {
  const product = catalog().find(product => product.id === id);
  if (!product || !available(product, state.unit)) return;
  openModal(product.name, `<img class="modal-image" src="assets/${product.image}.svg" alt="Ilustração do produto"><p>${product.description}</p><p class="hint">${product.allergens} Pode haver contato cruzado na cozinha. Consulte o atendente se houver restrição alimentar.</p><form class="form" id="product-form" data-id="${id}">${product.extras.length ? `<fieldset><legend>Deixe do seu jeito</legend>${product.extras.map((extra, index) => `<label class="check"><input type="checkbox" name="extra" value="${index}">${extra.name} · + ${money(extra.price)}</label>`).join('')}</fieldset>` : ''}<label>Observação (opcional)<textarea name="note" maxlength="120" placeholder="Ex.: sem orégano. Não informe dados pessoais."></textarea></label><button class="button" type="submit">Adicionar à sacola · ${money(product.price)}</button></form>`);
}
async function pay(order, result) {
  if (state.busy) return;
  state.busy = true;
  if (modal.open) modal.close();
  openModal('Aguardando o pagamento', '<p role="status">Solicitação enviada ao serviço simulado. Aguarde o retorno.</p><p class="hint">Esta etapa não gera cobrança nem abre um provedor real.</p>');
  modal.querySelector('.close').disabled = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 900));
    settlePayment(order, result);
    notice(result === 'aprovado' ? `Pedido ${order.code} confirmado. A cozinha já pode iniciar o preparo.` : result === 'recusado' ? 'Pagamento recusado. Nenhum ponto foi descontado.' : 'Sem confirmação. Consulte o pedido antes de tentar novamente.');
  } catch (error) { notice(error.message); }
  finally { state.busy = false; modal.close(); navigate('pedidos'); }
}
modal.addEventListener('cancel', event => { if (state.busy) event.preventDefault(); });
const digest = async password => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password)))).map(byte => byte.toString(16).padStart(2, '0')).join('');
function errorAt(id, text) { document.querySelector(id).innerHTML = `<p class="error">${escape(text)}</p>`; }
document.addEventListener('submit', async event => {
  event.preventDefault(); if (state.busy) return;
  const form = event.target, values = new FormData(form);
  if (form.id === 'product-form') {
    if (unresolved()) { notice('Finalize ou encerre a tentativa de pagamento em Meus pedidos.'); return; }
    const product = catalog().find(product => product.id === form.dataset.id);
    if (!canAdd(product.id)) { notice('Quantidade indisponível nesta unidade. Revise sua sacola.'); return; }
    const extras = values.getAll('extra').map(index => product.extras[Number(index)]);
    const note = String(values.get('note')).trim();
    const line = state.cart.find(item => item.id === product.id && item.note === note && JSON.stringify(item.extras) === JSON.stringify(extras));
    if (line) line.quantity++; else state.cart.push({ id: product.id, name: product.name, price: product.price, extras, note, quantity: 1 });
    modal.close(); render(); notice(`${product.name} adicionado à sacola.`);
  }
  if (form.id === 'payment-form') {
    if (unresolved()) { navigate('pedidos'); return; }
    try { const order = createOrder(); order.method = String(values.get('method')); await pay(order, String(values.get('result'))); } catch (error) { notice(error.message); }
  }
  if (form.id === 'retry-form') {
    const order = state.orders.find(order => order.id === form.dataset.id);
    if (order && ['pendente', 'recusado'].includes(order.payment)) await pay(order, String(values.get('result')));
  }
  if (form.id === 'register-form') {
    const name = String(values.get('name')).trim(), email = String(values.get('email')).trim().toLowerCase();
    if (name.length < 2) { errorAt('#register-error', 'Informe um nome com pelo menos 2 caracteres.'); return; }
    if (profiles.has(email) || email === 'cliente@exemplo.com') { errorAt('#register-error', 'Este e-mail já está cadastrado na demonstração.'); return; }
    profiles.set(email, { name, email, points: 0, digest: await digest(String(values.get('password'))) });
    state.user = profiles.get(email); state.preferences.marketing = values.has('marketing');
    navigate('conta'); notice('Conta de teste criada. Marketing continua opcional.');
  }
  if (form.id === 'login-form') {
    const email = String(values.get('email')).trim().toLowerCase(), hash = await digest(String(values.get('password')));
    if (email === 'cliente@exemplo.com' && !profiles.has(email)) profiles.set(email, { name: 'Cliente de teste', email, points: 100, digest: await digest('nordeste123') });
    const user = profiles.get(email);
    if (!user || user.digest !== hash) { errorAt('#login-error', 'E-mail ou senha inválidos na demonstração.'); return; }
    state.user = user; navigate('conta'); notice('Você entrou na conta de teste.');
  }
  if (form.id === 'preferences-form') {
    state.preferences = { marketing: values.has('marketing'), segmentation: values.has('segmentation') };
    notice('Preferências salvas nesta sessão. Você pode revogá-las a qualquer momento.');
  }
});
document.addEventListener('click', event => {
  const target = event.target.closest('[data-action]'); if (!target || state.busy) return;
  const { action, id, index, delta, category } = target.dataset;
  if (action === 'close') modal.close();
  if (action === 'product') productModal(id);
  if (action === 'category') { state.category = category; render(); main.querySelector(`[data-category="${category}"]`)?.focus(); }
  if (action === 'cart') openModal('Revisar sacola', cartView());
  if (action === 'checkout') { if (modal.open) modal.close(); navigate(unresolved() ? 'pedidos' : 'revisao'); }
  if (action === 'quantity') {
    if (unresolved()) { notice('Finalize ou encerre a tentativa de pagamento em Meus pedidos.'); return; }
    const item = state.cart[Number(index)]; if (!item) return;
    if (Number(delta) > 0 && !canAdd(item.id)) { notice('Limite de estoque atingido para este produto.'); return; }
    item.quantity += Number(delta); if (!item.quantity) state.cart.splice(Number(index), 1);
    render();
    if (modal.open) { modal.querySelector('#modal-title').parentElement.nextElementSibling?.remove(); modal.innerHTML = `<div class="modal-head"><h2 id="modal-title">Revisar sacola</h2><button class="close" data-action="close" aria-label="Fechar">×</button></div>${cartView()}`; }
  }
  if (action === 'menu') { if (modal.open) modal.close(); navigate('cardapio'); }
  if (action === 'account') navigate('conta');
  if (action === 'privacy') navigate('privacidade');
  if (action === 'retry') openModal('Consultar resultado simulado', `<p>O pedido mantém o mesmo código. A confirmação repetida não credita pontos novamente.</p><form class="form" id="retry-form" data-id="${id}"><label>Retorno do serviço<select name="result"><option value="aprovado">Aprovado</option><option value="recusado">Recusado</option><option value="pendente">Ainda pendente</option></select></label><button class="button" type="submit">Consultar retorno</button></form>`);
  if (action === 'abandon') confirmAction('Encerrar tentativa?', 'A simulação não gerou cobrança. Sua sacola será esvaziada para iniciar um novo pedido.', () => { abandonOrder(id); render(true); });
  if (action === 'advance') { if (state.orders.find(order => order.id === id)?.unit === state.unit && advanceOrder(id)) { render(); notice('Etapa do pedido atualizada.'); } }
  if (action === 'logout') { state.user = null; state.redeem = false; state.preferences = { marketing: false, segmentation: false }; render(true); }
  if (action === 'export') {
    const profile = state.user ? { name: state.user.name, email: state.user.email, points: state.user.points } : null;
    const blob = new Blob([JSON.stringify({ profile, preferences: state.preferences, orders: state.orders }, null, 2)], { type: 'application/json' });
    const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'dados-da-sessao.json'; link.click(); setTimeout(() => URL.revokeObjectURL(link.href), 1000); notice('Arquivo de dados fictícios exportado.');
  }
  if (action === 'erase') confirmAction('Excluir conta de teste?', 'Nome, e-mail, senha de teste e preferências serão removidos. Pedidos serão desvinculados do perfil.', () => { profiles.delete(state.user.email); eraseUser(); render(true); notice('Conta de teste excluída e pedidos desvinculados.'); });
  if (action === 'reset') confirmAction('Encerrar atendimento?', 'A sessão será apagada para o próximo cliente.', () => { profiles.clear(); resetSession(); navigate('cardapio'); notice('Atendimento encerrado.'); });
});
document.addEventListener('input', event => {
  if (event.target.id === 'search') { state.search = event.target.value; document.querySelector('#products').innerHTML = productsView(); }
});
document.addEventListener('change', event => {
  if (state.busy) { event.target.value = event.target.id === 'unit' ? state.unit : state.channel; return; }
  if (event.target.id === 'redeem') { state.redeem = event.target.checked; render(); }
  if (event.target.id === 'unit') {
    const unit = event.target.value; event.target.value = state.unit;
    if (unresolved()) { notice('Finalize ou encerre a tentativa de pagamento antes de trocar a unidade.'); return; }
    const change = () => { state.unit = unit; state.cart = []; state.redeem = false; state.category = 'Tudo'; state.search = ''; navigate('cardapio'); render(); };
    if (state.cart.length) confirmAction('Trocar de unidade?', 'Preços e disponibilidade podem mudar. Sua sacola atual será esvaziada.', change); else change();
  }
  if (event.target.id === 'channel') {
    const channel = event.target.value; event.target.value = state.channel;
    const change = () => { if (channel === 'totem' || state.channel === 'totem') { profiles.clear(); resetSession(); } state.channel = channel; render(); idle(); };
    if ((channel === 'totem' || state.channel === 'totem') && (state.cart.length || state.user || state.orders.length)) confirmAction('Iniciar outro canal?', 'Entrar ou sair do totem apaga a sessão para proteger os dados do atendimento.', change); else change();
  }
});
function idle() {
  clearTimeout(timer);
  if (state.channel === 'totem') timer = setTimeout(() => {
    if (state.busy) { idle(); return; }
    if (modal.open) modal.close(); profiles.clear(); resetSession(); navigate('cardapio'); render(); notice('Sessão encerrada por inatividade. Inicie um novo atendimento.');
  }, 120000);
}
['pointerdown', 'keydown', 'input'].forEach(event => document.addEventListener(event, idle, { passive: true }));
window.addEventListener('hashchange', () => render(true));
document.querySelector('#unit').innerHTML = units.map(unit => `<option value="${unit.id}">${unit.name}</option>`).join('');
render();
