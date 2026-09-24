import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  buscarResumo,
  buscarEstoqueBaixo,
  buscarTopVendidos,
} from "../api/estoque";

export default function Dashboard() {
  const [resumo, setResumo] = useState(null);
  const [estoqueBaixo, setEstoqueBaixo] = useState([]);
  const [topVendidos, setTopVendidos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    Promise.all([buscarResumo(), buscarEstoqueBaixo(), buscarTopVendidos()])
      .then(([r, eb, tv]) => {
        setResumo(r);
        setEstoqueBaixo(eb);
        setTopVendidos(tv);
      })
      .finally(() => setCarregando(false));
  }, []);

  if (carregando) return <p className="carregando">Carregando dashboard...</p>;

  return (
    <div className="dashboard">
      <div className="cards-resumo">
        <div className="card">
          <span className="card-label">Total em Estoque</span>
          <span className="card-valor">
            R$ {resumo.valor_total_estoque.toFixed(2)}
          </span>
        </div>
        <div className="card">
          <span className="card-label">Faturamento Estimado</span>
          <span className="card-valor">
            R$ {resumo.faturamento_estimado.toFixed(2)}
          </span>
        </div>
        <div className="card">
          <span className="card-label">Produtos Cadastrados</span>
          <span className="card-valor">{resumo.total_produtos}</span>
        </div>
        <div className={`card ${estoqueBaixo.length > 0 ? "card-alerta" : ""}`}>
          <span className="card-label">Produtos em Alerta</span>
          <span className="card-valor">{estoqueBaixo.length}</span>
        </div>
      </div>

      <div className="dashboard-secoes">
        <div className="secao">
          <h3>Top produtos mais vendidos</h3>
          {topVendidos.length === 0 ? (
            <p className="vazio">Ainda não há vendas registradas.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={topVendidos}>
                <XAxis dataKey="nome" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="total_vendido" fill="#4f6ef7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="secao">
          <h3>Produtos com estoque baixo</h3>
          {estoqueBaixo.length === 0 ? (
            <p className="vazio">Nenhum produto em alerta.</p>
          ) : (
            <ul className="lista-alerta">
              {estoqueBaixo.map((p) => (
                <li key={p.id}>
                  <span>{p.nome}</span>
                  <span>
                    {p.quantidade_estoque} / mín. {p.estoque_minimo}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
