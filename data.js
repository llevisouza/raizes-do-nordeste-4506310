export const units = [
  { id: 'recife', name: 'Recife · Boa Vista', address: 'Rua do Sol, 120 · endereço fictício', time: '15–20 min', format: 'Cozinha completa' },
  { id: 'salvador', name: 'Salvador · Centro', address: 'Rua da Aurora, 45 · endereço fictício', time: '10–15 min', format: 'Unidade expressa' },
  { id: 'caruaru', name: 'Caruaru · Centro', address: 'Rua da Feira, 80 · endereço fictício', time: '15–25 min', format: 'Cozinha completa' }
];
export const products = [
  { id: 'cuscuz', name: 'Cuscuz da casa', description: 'Cuscuz de milho, queijo coalho e manteiga de garrafa.', category: 'Da nossa cozinha', price: 1590, stock: 15, units: ['recife', 'caruaru'], image: 'cuscuz', tag: 'Mais pedido', allergens: 'Contém leite.', extras: [{ name: 'Ovo', price: 300 }, { name: 'Carne de sol', price: 600 }] },
  { id: 'tapioca', name: 'Tapioca de queijo coalho', description: 'Massa fininha, queijo na chapa e um toque de orégano.', category: 'Da nossa cozinha', price: 1390, stock: 20, units: ['recife', 'salvador', 'caruaru'], image: 'tapioca', tag: '', allergens: 'Contém leite.', extras: [{ name: 'Carne de sol', price: 600 }] },
  { id: 'bolo', name: 'Bolo de macaxeira', description: 'Uma fatia do nosso bolo, com coco e café como companhia.', category: 'Para adoçar', price: 890, stock: 10, units: ['recife', 'salvador', 'caruaru'], image: 'bolo', tag: '', allergens: 'Contém leite e ovos.', extras: [] },
  { id: 'cafe', name: 'Café passado', description: 'Café coado na hora. Servido sem açúcar, 180 ml.', category: 'Bebidas', price: 590, stock: 30, units: ['recife', 'salvador', 'caruaru'], image: 'cafe', tag: '', allergens: 'Sem alergênicos declarados na receita.', extras: [] },
  { id: 'suco', name: 'Suco de cajá', description: 'Cajá, água e o frescor da nossa terra. Copo de 300 ml.', category: 'Bebidas', price: 790, stock: 0, units: ['recife', 'salvador', 'caruaru'], image: 'suco', tag: '', allergens: 'Sem alergênicos declarados na receita.', extras: [] },
  { id: 'combo', name: 'Pausa nordestina', description: 'Tapioca de queijo coalho + café passado, para uma pausa boa.', category: 'Combos', price: 1790, stock: 12, units: ['recife', 'salvador', 'caruaru'], image: 'combo', tag: 'Combo da casa', allergens: 'Contém leite.', extras: [] },
  { id: 'canjica', name: 'Canjica junina', description: 'Receita de milho verde com canela. Disponível somente em junho.', category: 'Para adoçar', price: 1090, stock: 12, units: ['recife', 'caruaru'], image: 'cuscuz', tag: 'Sazonal', allergens: 'Contém leite.', seasonal: 5, extras: [] }
];
export const categories = ['Tudo', 'Da nossa cozinha', 'Para adoçar', 'Bebidas', 'Combos'];
export const money = cents => (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
export const available = (product, unit, date = new Date()) => product.units.includes(unit) && product.stock > 0 && (product.seasonal === undefined || date.getMonth() === product.seasonal);
export const itemPrice = item => item.price + item.extras.reduce((sum, extra) => sum + extra.price, 0);
export const subtotal = cart => cart.reduce((sum, item) => sum + itemPrice(item) * item.quantity, 0);
export const orderStates = ['Confirmado', 'Em preparo', 'Pronto para retirada', 'Retirado'];
