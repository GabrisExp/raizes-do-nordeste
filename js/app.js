let unidadeAtual = UNIDADES[0].id;
let pedidoAtual = null;
let pontos = 0;
const moeda = n => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
let avisoTimeout;
function avisar(texto) {
  const el = document.getElementById('mensagem'); el.textContent = texto; el.classList.add('mostrar');
  clearTimeout(avisoTimeout); avisoTimeout = setTimeout(() => el.classList.remove('mostrar'), 3800);
}
function renderizarProdutos() {
  const lista = document.getElementById('produtos'); lista.replaceChildren();
  PRODUTOS.forEach(p => {
    const disponivel = p.unidades.includes(unidadeAtual);
    const card = document.createElement('article'); card.className = 'produto';
    const img = document.createElement('img'); img.src = IMAGEM_PRODUTO; img.alt = `Imagem de ${p.nome}`; img.loading = 'lazy';
    const info = document.createElement('div'); info.className = 'produto-info';
    const categoria = document.createElement('small'); categoria.textContent = p.categoria;
    const titulo = document.createElement('h3'); titulo.textContent = p.nome;
    const descricao = document.createElement('p'); descricao.className = 'descricao-produto'; descricao.textContent = p.descricao;
    const preco = document.createElement('p'); preco.className = 'preco'; preco.textContent = moeda(p.preco);
    const botao = document.createElement('button'); botao.className = 'botao'; botao.type = 'button'; botao.disabled = !disponivel;
    botao.textContent = disponivel ? 'Adicionar' : 'Indisponível'; botao.addEventListener('click', () => adicionar(p.id));
    info.append(categoria, titulo, descricao, preco, botao); card.append(img, info); lista.append(card);
  });
}
function mostrarPedido() {
  const el = document.getElementById('pedido-atual'); el.replaceChildren();
  if (!pedidoAtual) { const p = document.createElement('p'); p.textContent = 'Nenhum pedido confirmado.'; el.append(p); return; }
  const h = document.createElement('h3'); h.textContent = `Pedido #${pedidoAtual.numero}`;
  const resumo = document.createElement('p'); resumo.textContent = `${pedidoAtual.unidade} • ${pedidoAtual.modalidade} • ${moeda(pedidoAtual.total)}`;
  const situacao = document.createElement('p'); situacao.textContent = `Situação: ${pedidoAtual.etapas[pedidoAtual.etapa]}`;
  const botao = document.createElement('button'); botao.type = 'button'; botao.className = 'botao'; botao.textContent = 'Avançar situação';
  botao.disabled = pedidoAtual.etapa >= pedidoAtual.etapas.length - 1;
  botao.addEventListener('click', () => { pedidoAtual.etapa++; mostrarPedido(); });
  el.append(h, resumo, situacao, botao);
}
document.addEventListener('DOMContentLoaded', () => {
  const seletor = document.getElementById('unidade');
  UNIDADES.forEach(u => { const op = document.createElement('option'); op.value = u.id; op.textContent = u.nome; seletor.append(op); });
  seletor.addEventListener('change', () => {
    unidadeAtual = seletor.value;
    carrinho.splice(0);
    atualizarCarrinho(); renderizarProdutos();
    document.getElementById('finalizacao').classList.add('oculto');
    avisar('Unidade alterada. O carrinho foi esvaziado para evitar itens de outra unidade.');
  });
  document.getElementById('abrir-finalizacao').addEventListener('click', () => {
    if (!carrinho.length) { avisar('Adicione um produto antes de finalizar.'); return; }
    document.getElementById('finalizacao').classList.remove('oculto');
    document.getElementById('finalizacao').scrollIntoView({ behavior: 'smooth' });
  });
  document.getElementById('ver-privacidade').addEventListener('click', () => document.getElementById('privacidade-texto').scrollIntoView({ behavior: 'smooth' }));
  document.getElementById('form-pedido').addEventListener('submit', evento => {
    evento.preventDefault();
    const form = evento.currentTarget;
    if (!form.reportValidity() || !carrinho.length) { avisar('Verifique os dados e o carrinho.'); return; }
    if (form.elements.pagamento.value === 'recusado') { avisar('Pagamento recusado. Selecione outra opção para tentar novamente.'); return; }
    const valor = totalCarrinho();
    pedidoAtual = {
      numero: Math.floor(100000 + Math.random() * 900000), unidade: UNIDADES.find(u => u.id === unidadeAtual).nome,
      modalidade: document.getElementById('modalidade').value, total: valor, etapa: 0,
      etapas: ['Confirmado', 'Em preparação', 'Pronto para retirada', 'Concluído']
    };
    pontos += Math.floor(valor / 10);
    document.getElementById('pontos').textContent = pontos;
    carrinho.splice(0); atualizarCarrinho(); mostrarPedido();
    document.getElementById('finalizacao').classList.add('oculto');
    form.reset();
    avisar('Pagamento aprovado! Pedido confirmado.');
    document.getElementById('pedidos').scrollIntoView({ behavior: 'smooth' });
  });
  atualizarCarrinho(); renderizarProdutos(); mostrarPedido();
});
