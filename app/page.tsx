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
      produtoId: produto.id,
      produtoNome: produto.nome,
      quantidade: 1,
      valorCompraUnitario: produto.compra,
      valorVendaUnitario: produto.venda,
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
    const confirmar = confirm("Tem certeza que deseja excluir este produto?");
    if (!confirmar) return;

    setProdutos((prev) => prev.filter((p) => p.id !== id));
  };

  const excluirVenda = (id: number) => {
    const confirmar = confirm("Deseja excluir esta venda do histórico?");
    if (!confirmar) return;

    setVendas((prev) => prev.filter((v) => v.id !== id));
  };

  const limparHistorico = () => {
    const confirmar = confirm("Tem certeza que deseja limpar todo o histórico?");
    if (!confirmar) return;

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
    border: "1px solid #ccc",
    fontSize: 16,
  };

  const buttonStyle = {
    marginTop: 15,
    padding: "12px 22px",
    borderRadius: 8,
    border: "none",
    background: "#111827",
    color: "#fff",
    cursor: "pointer",
    fontSize: 16,
    fontWeight: "bold",
  };

  const smallButtonStyle = {
    marginTop: 10,
    marginRight: 8,
    padding: "8px 14px",
    borderRadius: 6,
    border: "none",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
  };

  const deleteButtonStyle = {
    marginTop: 10,
    padding: "8px 14px",
    borderRadius: 6,
    border: "none",
    background: "#dc2626",
    color: "#fff",
    cursor: "pointer",
  };

  const cardResumoStyle = {
    background: "#f9fafb",
    border: "1px solid #ddd",
    borderRadius: 10,
    padding: 15,
  };

  const cardStyle = {
    listStyle: "none",
    marginBottom: 12,
    padding: 16,
    borderRadius: 10,
    background: "#f9fafb",
    border: "1px solid #ddd",
  };

  return (
    <div
      style={{
        padding: 30,
        fontFamily: "Arial",
        background: "#f4f6f8",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          background: "#fff",
          padding: 25,
          borderRadius: 12,
        }}
      >
        <h1>Confia Grifes</h1>

        <h2>Resumo Financeiro</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: 12,
            marginBottom: 30,
          }}
        >
          <div style={cardResumoStyle}>
            <strong>Itens em estoque</strong>
            <p style={{ fontSize: 20, margin: "8px 0 0" }}>{totalItens}</p>
          </div>

          <div style={cardResumoStyle}>
            <strong>Valor investido</strong>
            <p style={{ fontSize: 20, margin: "8px 0 0" }}>
              {formatarMoeda(valorInvestido)}
            </p>
          </div>

          <div style={cardResumoStyle}>
            <strong>Venda prevista</strong>
            <p style={{ fontSize: 20, margin: "8px 0 0" }}>
              {formatarMoeda(valorVendaTotal)}
            </p>
          </div>

          <div style={cardResumoStyle}>
            <strong>Lucro previsto</strong>
            <p style={{ fontSize: 20, margin: "8px 0 0" }}>
              {formatarMoeda(lucroPrevisto)}
            </p>
          </div>

          <div style={cardResumoStyle}>
            <strong>Faturamento real</strong>
            <p style={{ fontSize: 20, margin: "8px 0 0" }}>
              {formatarMoeda(faturamentoReal)}
            </p>
          </div>

          <div style={cardResumoStyle}>
            <strong>Lucro real</strong>
            <p style={{ fontSize: 20, margin: "8px 0 0" }}>
              {formatarMoeda(lucroReal)}
            </p>
          </div>
        </div>

        <h2>Cadastrar Produto</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 12,
          }}
        >
          <input
            style={inputStyle}
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <input
            type="number"
            style={inputStyle}
            placeholder="Quantidade"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
          />

          <input
            type="number"
            step="0.01"
            style={inputStyle}
            placeholder="Valor Compra"
            value={compra}
            onChange={(e) => setCompra(e.target.value)}
          />

          <input
            type="number"
            step="0.01"
            style={inputStyle}
            placeholder="Valor Venda"
            value={venda}
            onChange={(e) => setVenda(e.target.value)}
          />
        </div>

        <button onClick={cadastrar} style={buttonStyle}>
          Cadastrar
        </button>

        <h2 style={{ marginTop: 30 }}>Produtos</h2>

        <ul style={{ padding: 0 }}>
          {produtos.map((p) => {
            const lucro = p.venda - p.compra;
            const lucroTotalProduto = lucro * p.quantidade;

            return (
              <li key={p.id} style={cardStyle}>
                <strong>{p.nome}</strong>
                <br />
                Estoque: {p.quantidade} | Compra: {formatarMoeda(p.compra)} |
                Venda: {formatarMoeda(p.venda)} | Lucro unitário:{" "}
                {formatarMoeda(lucro)} | Lucro total:{" "}
                {formatarMoeda(lucroTotalProduto)}
                <br />

                <button onClick={() => vender(p.id)} style={smallButtonStyle}>
                  Vender
                </button>

                <button
                  onClick={() => excluirProduto(p.id)}
                  style={deleteButtonStyle}
                >
                  Excluir
                </button>
              </li>
            );
          })}
        </ul>

        <h2 style={{ marginTop: 30 }}>Histórico de Vendas</h2>

        {vendas.length > 0 && (
          <button onClick={limparHistorico} style={deleteButtonStyle}>
            Limpar histórico
          </button>
        )}

        <ul style={{ padding: 0, marginTop: 15 }}>
          {vendas.length === 0 && <p>Nenhuma venda registrada ainda.</p>}

          {vendas.map((v) => (
            <li key={v.id} style={cardStyle}>
              <strong>{v.produtoNome}</strong>
              <br />
              Data: {v.data}
              <br />
              Quantidade: {v.quantidade} | Venda:{" "}
              {formatarMoeda(v.valorVendaTotal)} | Lucro:{" "}
              {formatarMoeda(v.lucroTotal)}
              <br />
              <button
                onClick={() => excluirVenda(v.id)}
                style={deleteButtonStyle}
              >
                Excluir venda
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}