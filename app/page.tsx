"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [produtos, setProdutos] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const dados = localStorage.getItem("produtos");
      return dados ? JSON.parse(dados) : [];
    }
    return [];
  });

  const [vendas, setVendas] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const dados = localStorage.getItem("vendas");
      return dados ? JSON.parse(dados) : [];
    }
    return [];
  });

  const [nome, setNome] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [compra, setCompra] = useState("");
  const [venda, setVenda] = useState("");

  useEffect(() => {
    localStorage.setItem("produtos", JSON.stringify(produtos));
  }, [produtos]);

  useEffect(() => {
    localStorage.setItem("vendas", JSON.stringify(vendas));
  }, [vendas]);

  const totalItens = produtos.reduce((acc, p) => acc + p.quantidade, 0);

  const valorInvestido = produtos.reduce(
    (acc, p) => acc + p.quantidade * p.compra,
    0
  );

  const valorVendaTotal = produtos.reduce(
    (acc, p) => acc + p.quantidade * p.venda,
    0
  );

  const lucroPrevisto = valorVendaTotal - valorInvestido;

  const faturamentoReal = vendas.reduce(
    (acc, v) => acc + v.valorVendaTotal,
    0
  );

  const lucroReal = vendas.reduce((acc, v) => acc + v.lucroTotal, 0);

  const cadastrar = () => {
    if (!nome || !quantidade || !compra || !venda) {
      alert("Preencha todos os campos.");
      return;
    }

    if (
      isNaN(Number(quantidade)) ||
      isNaN(Number(compra)) ||
      isNaN(Number(venda))
    ) {
      alert("Digite valores válidos.");
      return;
    }

    const novo = {
      id: Date.now(),
      nome,
      quantidade: Number(quantidade) || 0,
      compra: Number(compra) || 0,
      venda: Number(venda) || 0,
    };

    setProdutos([novo, ...produtos]);

    setNome("");
    setQuantidade("");
    setCompra("");
    setVenda("");
  };

  const vender = (id: number) => {
    const produto = produtos.find((p) => p.id === id);

    if (!produto || produto.quantidade <= 0) {
      alert("Produto sem estoque.");
      return;
    }

    const lucroUnitario = produto.venda - produto.compra;

    const novaVenda = {
      id: Date.now(),
      produtoNome: produto.nome,
      quantidade: 1,
      valorVendaTotal: produto.venda,
      lucroTotal: lucroUnitario,
      data: new Date().toLocaleString("pt-BR"),
    };

    setVendas([novaVenda, ...vendas]);

    setProdutos((prev) =>
      prev.map((p) =>
        p.id === id && p.quantidade > 0
          ? { ...p, quantidade: p.quantidade - 1 }
          : p
      )
    );
  };

  const excluirProduto = (id: number) => {
    if (!confirm("Excluir produto?")) return;
    setProdutos((prev) => prev.filter((p) => p.id !== id));
  };

  const excluirVenda = (id: number) => {
    if (!confirm("Excluir venda?")) return;
    setVendas((prev) => prev.filter((v) => v.id !== id));
  };

  const limparHistorico = () => {
    if (!confirm("Limpar histórico?")) return;
    setVendas([]);
  };

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const inputStyle = {
    padding: 12,
    borderRadius: 8,
    border: "1px solid #333",
    fontSize: 16,
    background: "#0f172a",
    color: "#fff",
  };

  const buttonStyle = {
    marginTop: 15,
    padding: "12px 22px",
    borderRadius: 8,
    border: "none",
    background: "#22c55e",
    color: "#000",
    cursor: "pointer",
    fontWeight: "bold",
  };

  const deleteButtonStyle = {
    marginTop: 10,
    marginLeft: 8,
    padding: "8px 14px",
    borderRadius: 6,
    border: "none",
    background: "#ef4444",
    color: "#fff",
    cursor: "pointer",
  };

  const cardStyle = {
    listStyle: "none",
    marginBottom: 12,
    padding: 16,
    borderRadius: 10,
    background: "#1e293b",
    border: "1px solid #333",
  };

  const resumoCard = {
    background: "#1e293b",
    border: "1px solid #333",
    borderRadius: 10,
    padding: 15,
  };

  return (
    <div style={{ padding: 30, background: "#0f172a", minHeight: "100vh", color: "#fff" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* LOGO */}
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <img src="/logo.png" alt="Confia Grifes" style={{ width: 220 }} />
          <h1>Confia Grifes</h1>
          <p style={{ color: "#aaa" }}>Define sua identidade</p>
        </div>

        {/* RESUMO */}
        <h2>Resumo Financeiro</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10 }}>
          <div style={resumoCard}>Itens: {totalItens}</div>
          <div style={resumoCard}>Investido: {formatarMoeda(valorInvestido)}</div>
          <div style={resumoCard}>Venda Prevista: {formatarMoeda(valorVendaTotal)}</div>
          <div style={resumoCard}>Lucro Previsto: {formatarMoeda(lucroPrevisto)}</div>
          <div style={resumoCard}>Faturamento: {formatarMoeda(faturamentoReal)}</div>
          <div style={resumoCard}>Lucro Real: {formatarMoeda(lucroReal)}</div>
        </div>

        {/* CADASTRO */}
        <h2 style={{ marginTop: 30 }}>Cadastrar Produto</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
          <input style={inputStyle} placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
          <input style={inputStyle} type="number" placeholder="Qtd" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} />
          <input style={inputStyle} type="number" placeholder="Compra" value={compra} onChange={(e) => setCompra(e.target.value)} />
          <input style={inputStyle} type="number" placeholder="Venda" value={venda} onChange={(e) => setVenda(e.target.value)} />
        </div>

        <button onClick={cadastrar} style={buttonStyle}>Cadastrar</button>

        {/* PRODUTOS */}
        <h2 style={{ marginTop: 30 }}>Produtos</h2>
        <ul style={{ padding: 0 }}>
          {produtos.map((p) => {
            const lucro = p.venda - p.compra;
            return (
              <li key={p.id} style={cardStyle}>
                <strong>{p.nome}</strong><br />
                Estoque: {p.quantidade} | Compra: {formatarMoeda(p.compra)} | Venda: {formatarMoeda(p.venda)} | Lucro: {formatarMoeda(lucro)}
                <br />
                <button onClick={() => vender(p.id)} style={buttonStyle}>Vender</button>
                <button onClick={() => excluirProduto(p.id)} style={deleteButtonStyle}>Excluir</button>
              </li>
            );
          })}
        </ul>

        {/* HISTÓRICO */}
        <h2>Histórico de Vendas</h2>
        {vendas.length > 0 && (
          <button onClick={limparHistorico} style={deleteButtonStyle}>Limpar histórico</button>
        )}

        <ul style={{ padding: 0 }}>
          {vendas.length === 0 && <p>Nenhuma venda ainda</p>}
          {vendas.map((v) => (
            <li key={v.id} style={cardStyle}>
              <strong>{v.produtoNome}</strong><br />
              {v.data}<br />
              Venda: {formatarMoeda(v.valorVendaTotal)} | Lucro: {formatarMoeda(v.lucroTotal)}
              <br />
              <button onClick={() => excluirVenda(v.id)} style={deleteButtonStyle}>Excluir</button>
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
}