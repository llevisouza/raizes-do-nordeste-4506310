import { test } from 'node:test';
import assert from 'node:assert/strict';
import { available, products, subtotal, itemPrice } from '../data.js';
import { state, canAdd, createOrder, settlePayment, advanceOrder, resetSession } from '../store.js';
test('cardápio respeita unidade, sazonalidade e estoque', () => {
  const cuscuz = products.find(product => product.id === 'cuscuz');
  assert.equal(available(cuscuz, 'salvador'), false);
  assert.equal(available(products.find(product => product.id === 'suco'), 'recife'), false);
  const canjica = products.find(product => product.id === 'canjica');
  assert.equal(available(canjica, 'recife', new Date(2026, 8, 30)), false);
  assert.equal(available(canjica, 'recife', new Date(2026, 5, 1)), true);
});
test('adicionais e quantidades calculados em centavos', () => {
  const item = { price: 1590, extras: [{ price: 300 }], quantity: 2 };
  assert.equal(itemPrice(item), 1890); assert.equal(subtotal([item]), 3780);
});
test('pedido vazio é rejeitado', () => { resetSession(); assert.throws(() => createOrder(), /vazia/); });
test('retorno pendente e recusado não libera cozinha nem debita pontos; confirmação é idempotente', () => {
  resetSession(); state.unit = 'recife'; state.user = { name: 'Teste', email: 'teste@exemplo.com', points: 100 }; state.redeem = true;
  state.cart = [{ id: 'tapioca', name: 'Tapioca', price: 1390, extras: [], quantity: 1 }];
  const order = createOrder(); settlePayment(order, 'pendente');
  assert.equal(order.stage, -1); assert.equal(state.user.points, 100); assert.equal(advanceOrder(order.id), false);
  settlePayment(order, 'recusado'); assert.equal(state.user.points, 100);
  settlePayment(order, 'aprovado'); assert.equal(order.total, 890); assert.equal(state.user.points, 8); assert.equal(order.stage, 0);
  settlePayment(order, 'aprovado'); assert.equal(state.user.points, 8);
  assert.equal(advanceOrder(order.id), true); assert.equal(order.stage, 1);
});
test('estoque impede quantidade superior ao saldo e conta todos os adicionais', () => {
  resetSession(); state.unit = 'recife'; state.cart = [{ id: 'cuscuz', price: 1590, extras: [], quantity: 15 }];
  assert.equal(canAdd('cuscuz'), false);
  state.cart[0].quantity = 16; assert.throws(() => createOrder(), /disponibilidade/);
});
