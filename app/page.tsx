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

  const cadastrar = () => {
    if (!nome || !quantidade || !compra || !venda) return;

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
    if (!produto || produto.quantidade <= 0) return;

    const lucro = produto.venda - produto.compra;

    setVendas([
      {
        id: Date.now(),
        produtoNome: produto.nome,
        valorVendaTotal: produto.venda,
        lucroTotal: lucro,
        data: new Date().toLocaleString("pt-BR"),
      },
      ...vendas,
    ]);

    setProdutos((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, quantidade: p.quantidade - 1 } : p
      )
    );
  };

  const formatar = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div style={{ background: "#0f172a", minHeight: "100vh", color: "#fff" }}>
      
      {/* HEADER */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: 70,
          background: "#020617",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          borderBottom: "1px solid #1e293b",
          zIndex: 1000,
        }}
      >
        <img src="/logo.png" style={{ width: 50, marginRight: 10 }} />
        <div>
          <strong>Confia Grifes</strong>
          <p style={{ fontSize: 12, color: "#aaa", margin: 0 }}>
            Define sua identidade
          </p>
        </div>
      </div>

      {/* CONTEÚDO */}
      <div style={{ padding: "100px 20px", maxWidth: 1000, margin: "0 auto" }}>
        
        <h2>Cadastrar Produto</h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
          <input placeholder="Nome" onChange={(e) => setNome(e.target.value)} />
          <input type="number" placeholder="Qtd" onChange={(e) => setQuantidade(e.target.value)} />
          <input type="number" placeholder="Compra" onChange={(e) => setCompra(e.target.value)} />
          <input type="number" placeholder="Venda" onChange={(e) => setVenda(e.target.value)} />
        </div>

        <button onClick={cadastrar} style={{ marginTop: 10 }}>
          Cadastrar
        </button>

        <h2 style={{ marginTop: 30 }}>Produtos</h2>

        {produtos.map((p) => (
          <div key={p.id} style={{ marginBottom: 10 }}>
            {p.nome} | Estoque: {p.quantidade}
            <button onClick={() => vender(p.id)}>Vender</button>
          </div>
        ))}

        <h2>Histórico</h2>

        {vendas.map((v) => (
          <div key={v.id}>
            {v.produtoNome} - {formatar(v.valorVendaTotal)}
          </div>
        ))}
      </div>
    </div>
  );
}