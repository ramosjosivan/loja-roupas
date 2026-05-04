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
  const valorInvestido = produtos.reduce((acc, p) => acc + p.quantidade * p.compra, 0);
  const valorVendaTotal = produtos.reduce((acc, p) => acc + p.quantidade * p.venda, 0);
  const lucroPrevisto = valorVendaTotal - valorInvestido;
  const faturamentoReal = vendas.reduce((acc, v) => acc + v.valorVendaTotal, 0);
  const lucroReal = vendas.reduce((acc, v) => acc + v.lucroTotal, 0);

  const formatarMoeda = (valor: number) =>
    valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const cadastrar = () => {
    if (!nome || !quantidade || !compra || !venda) {
      alert("Preencha todos os campos.");
      return;
    }

    const novo = {
      id: Date.now(),
      nome,
      quantidade: Number(quantidade),
      compra: Number(compra),
      venda: Number(venda),
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
        p.id === id ? { ...p, quantidade: p.quantidade - 1 } : p
      )
    );
  };

  const excluirProduto = (id: number) => {
    if (!confirm("Deseja excluir este produto?")) return;
    setProdutos((prev) => prev.filter((p) => p.id !== id));
  };

  const excluirVenda = (id: number) => {
    if (!confirm("Deseja excluir esta venda?")) return;
    setVendas((prev) => prev.filter((v) => v.id !== id));
  };

  const limparHistorico = () => {
    if (!confirm("Deseja limpar todo o histórico?")) return;
    setVendas([]);
  };

  const inputStyle = {
    padding: 14,
    borderRadius: 10,
    border: "1px solid #334155",
    background: "#020617",
    color: "#fff",
    fontSize: 15,
    outline: "none",
  };

  const buttonStyle = {
    padding: "12px 20px",
    borderRadius: 10,
    border: "none",
    background: "#84cc16",
    color: "#020617",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: 14,
  };

  const deleteButtonStyle = {
    padding: "10px 16px",
    borderRadius: 10,
    border: "none",
    background: "#dc2626",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
    marginLeft: 8,
  };

  const cardStyle = {
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: 14,
    padding: 18,
    marginBottom: 12,
  };

  const resumoCardStyle = {
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: 14,
    padding: 18,
  };

  return (
    <div style={{ background: "#0f172a", minHeight: "100vh", color: "#fff", fontFamily: "Arial" }}>
      <header
        style={{
          background: "#020617",
          borderBottom: "1px solid #1e293b",
          padding: "16px 28px",
          display: "flex",
          alignItems: "center",
          gap: 14,
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <img src="/logo.png" alt="Confia Grifes" style={{ width: 54, height: 54, objectFit: "contain" }} />
        <div>
          <h1 style={{ margin: 0, fontSize: 22 }}>Confia Grifes</h1>
          <p style={{ margin: "4px 0 0", color: "#94a3b8", fontSize: 14 }}>
            Define sua identidade
          </p>
        </div>
      </header>

      <main style={{ maxWidth: 1150, margin: "0 auto", padding: "32px 20px" }}>
        <h2>Resumo Financeiro</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 12,
            marginBottom: 34,
          }}
        >
          <div style={resumoCardStyle}>
            <strong>Itens em estoque</strong>
            <p style={{ fontSize: 22 }}>{totalItens}</p>
          </div>

          <div style={resumoCardStyle}>
            <strong>Valor investido</strong>
            <p style={{ fontSize: 22 }}>{formatarMoeda(valorInvestido)}</p>
          </div>

          <div style={resumoCardStyle}>
            <strong>Venda prevista</strong>
            <p style={{ fontSize: 22 }}>{formatarMoeda(valorVendaTotal)}</p>
          </div>

          <div style={resumoCardStyle}>
            <strong>Lucro previsto</strong>
            <p style={{ fontSize: 22 }}>{formatarMoeda(lucroPrevisto)}</p>
          </div>

          <div style={resumoCardStyle}>
            <strong>Faturamento real</strong>
            <p style={{ fontSize: 22 }}>{formatarMoeda(faturamentoReal)}</p>
          </div>

          <div style={resumoCardStyle}>
            <strong>Lucro real</strong>
            <p style={{ fontSize: 22 }}>{formatarMoeda(lucroReal)}</p>
          </div>
        </div>

        <section style={cardStyle}>
          <h2 style={{ marginTop: 0 }}>Cadastrar Produto</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 12,
            }}
          >
            <input style={inputStyle} placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
            <input style={inputStyle} type="number" placeholder="Quantidade" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} />
            <input style={inputStyle} type="number" placeholder="Valor Compra" value={compra} onChange={(e) => setCompra(e.target.value)} />
            <input style={inputStyle} type="number" placeholder="Valor Venda" value={venda} onChange={(e) => setVenda(e.target.value)} />
          </div>

          <button onClick={cadastrar} style={buttonStyle}>
            Cadastrar
          </button>
        </section>

        <h2 style={{ marginTop: 34 }}>Produtos</h2>

        {produtos.length === 0 && <p style={{ color: "#94a3b8" }}>Nenhum produto cadastrado ainda.</p>}

        {produtos.map((p) => {
          const lucro = p.venda - p.compra;
          const lucroTotalProduto = lucro * p.quantidade;

          return (
            <div key={p.id} style={cardStyle}>
              <h3 style={{ marginTop: 0 }}>{p.nome}</h3>
              <p>
                Estoque: {p.quantidade} | Compra: {formatarMoeda(p.compra)} | Venda:{" "}
                {formatarMoeda(p.venda)} | Lucro unitário: {formatarMoeda(lucro)} |
                Lucro total: {formatarMoeda(lucroTotalProduto)}
              </p>

              <button onClick={() => vender(p.id)} style={buttonStyle}>
                Vender
              </button>

              <button onClick={() => excluirProduto(p.id)} style={deleteButtonStyle}>
                Excluir
              </button>
            </div>
          );
        })}

        <h2 style={{ marginTop: 34 }}>Histórico de Vendas</h2>

        {vendas.length > 0 && (
          <button onClick={limparHistorico} style={deleteButtonStyle}>
            Limpar histórico
          </button>
        )}

        {vendas.length === 0 && <p style={{ color: "#94a3b8" }}>Nenhuma venda registrada ainda.</p>}

        {vendas.map((v) => (
          <div key={v.id} style={cardStyle}>
            <h3 style={{ marginTop: 0 }}>{v.produtoNome}</h3>
            <p>Data: {v.data}</p>
            <p>
              Venda: {formatarMoeda(v.valorVendaTotal)} | Lucro:{" "}
              {formatarMoeda(v.lucroTotal)}
            </p>

            <button onClick={() => excluirVenda(v.id)} style={deleteButtonStyle}>
              Excluir venda
            </button>
          </div>
        ))}
      </main>
    </div>
  );
}