const carrinho = [];
function adicionar(id) {
  const produto = PRODUTOS.find(p => p.id === id);
  if (!produto || !produto.unidades.includes(unidadeAtual)) return;
  const item = carrinho.find(i => i.id === id);
  if (item) item.quantidade += 1;
  else carrinho.push({ id, quantidade: 1 });
  atualizarCarrinho();
  avisar(`${produto.nome} adicionado ao carrinho.`);
}
function quantidade(id, diferenca) {
  const item = carrinho.find(i => i.id === id);
  if (!item) return;
  item.quantidade += diferenca;
  if (item.quantidade <= 0) carrinho.splice(carrinho.indexOf(item), 1);
  atualizarCarrinho();
}
function totalCarrinho() {
  return carrinho.reduce((s, item) => s + PRODUTOS.find(p => p.id === item.id).preco * item.quantidade, 0);
}
function atualizarCarrinho() {
  const area = document.getElementById('itens-carrinho');
  area.replaceChildren();
  if (!carrinho.length) { const p = document.createElement('p'); p.textContent = 'Seu carrinho está vazio.'; area.append(p); }
  carrinho.forEach(item => {
    const produto = PRODUTOS.find(p => p.id === item.id);
    const linha = document.createElement('div'); linha.className = 'item';
    const nome = document.createElement('span'); nome.textContent = `${produto.nome} – ${moeda(produto.preco * item.quantidade)}`;
    const botoes = document.createElement('div'); botoes.className = 'acoes';
    const menos = document.createElement('button'); menos.type = 'button'; menos.textContent = '−'; menos.setAttribute('aria-label', `Diminuir ${produto.nome}`); menos.addEventListener('click', () => quantidade(item.id, -1));
    const qtd = document.createElement('span'); qtd.textContent = item.quantidade;
    const mais = document.createElement('button'); mais.type = 'button'; mais.textContent = '+'; mais.setAttribute('aria-label', `Aumentar ${produto.nome}`); mais.addEventListener('click', () => quantidade(item.id, 1));
    botoes.append(menos, qtd, mais); linha.append(nome, botoes); area.append(linha);
  });
  document.getElementById('total').textContent = moeda(totalCarrinho());
  document.getElementById('contador').textContent = carrinho.reduce((s, i) => s + i.quantidade, 0);
}
