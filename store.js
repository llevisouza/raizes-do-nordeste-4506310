import { products, units, subtotal, available } from './data.js';
export const state = { unit: 'recife', channel: 'web', cart: [], orders: [], user: null, category: 'Tudo', search: '', redeem: false, busy: false, preferences: { marketing: false, segmentation: false }, audit: [] };
const stock = Object.fromEntries(units.map(unit => [unit.id, Object.fromEntries(products.map(product => [product.id, product.stock]))]));
export const catalog = () => products.filter(product => product.units.includes(state.unit)).map(product => ({ ...product, stock: stock[state.unit][product.id], price: product.price + (state.unit === 'salvador' && product.id === 'tapioca' ? 100 : 0) }));
export const canAdd = (id, quantity = 1) => {
  const product = catalog().find(item => item.id === id);
  const inCart = state.cart.filter(item => item.id === id).reduce((sum, item) => sum + item.quantity, 0);
  return product && available(product, state.unit) && inCart + quantity <= product.stock;
};
export const discount = () => state.redeem && state.user?.points >= 100 ? Math.min(500, subtotal(state.cart)) : 0;
export function createOrder() {
  if (!state.cart.length) throw new Error('Sua sacola está vazia. Escolha um produto para continuar.');
  for (const item of state.cart) {
    const product = catalog().find(product => product.id === item.id);
    const quantity = state.cart.filter(line => line.id === item.id).reduce((sum, line) => sum + line.quantity, 0);
    if (!product || !available(product, state.unit) || quantity > product.stock) throw new Error('A disponibilidade mudou. Revise sua sacola.');
  }
  const reduction = discount();
  const order = { id: crypto.randomUUID(), code: `RN-${String(state.orders.length + 1).padStart(3, '0')}`, unit: state.unit, channel: state.channel, items: structuredClone(state.cart), total: subtotal(state.cart) - reduction, discount: reduction, payment: 'pendente', stage: -1, createdAt: new Date().toISOString(), customer: state.user?.email || null, points: 0, credited: false, attempts: 0 };
  state.orders.unshift(order);
  return order;
}
export function settlePayment(order, result) {
  if (order.payment === 'aprovado') return;
  order.attempts++;
  if (result !== 'aprovado') { order.payment = result; return; }
  const quantities = {};
  for (const item of order.items) quantities[item.id] = (quantities[item.id] || 0) + item.quantity;
  if (Object.entries(quantities).some(([id, count]) => stock[order.unit][id] < count)) {
    order.payment = 'recusado'; throw new Error('Produto sem estoque. A simulação não gerou cobrança; refaça o pedido.');
  }
  const owner = state.user?.email === order.customer ? state.user : null;
  if (order.discount && (!owner || owner.points < 100)) {
    order.payment = 'recusado'; throw new Error('Saldo de pontos mudou. Refaça o pedido sem o benefício.');
  }
  for (const [id, count] of Object.entries(quantities)) stock[order.unit][id] -= count;
  order.payment = 'aprovado'; order.stage = 0;
  if (owner) {
    order.points = Math.floor(order.total / 100);
    owner.points += order.points - (order.discount ? 100 : 0);
    order.credited = true;
  }
  state.cart = []; state.redeem = false;
  state.audit.push({ action: 'pagamento.confirmado', order: order.code, at: new Date().toISOString() });
}
export function advanceOrder(id) {
  const order = state.orders.find(item => item.id === id);
  if (!order || order.payment !== 'aprovado' || order.stage >= 3) return false;
  order.stage++;
  state.audit.push({ action: ['pedido.confirmado', 'cozinha.preparo', 'cozinha.pronto', 'balcao.retirado'][order.stage], order: order.code, at: new Date().toISOString() });
  return true;
}
export function abandonOrder(id) {
  const order = state.orders.find(item => item.id === id);
  if (!order || order.payment === 'aprovado' || order.payment === 'cancelado') return false;
  order.payment = 'cancelado';
  state.cart = []; state.redeem = false;
  state.audit.push({ action: 'pedido.cancelado.sem.cobranca', order: order.code, at: new Date().toISOString() });
  return true;
}
export function eraseUser() {
  const email = state.user?.email;
  for (const order of state.orders) if (order.customer === email) order.customer = null;
  state.user = null; state.preferences = { marketing: false, segmentation: false }; state.redeem = false;
}
export function resetSession() {
  state.cart = []; state.orders = []; state.user = null; state.redeem = false; state.search = ''; state.category = 'Tudo'; state.preferences = { marketing: false, segmentation: false }; state.audit = [];
}
