import { GetServerSideProps } from "next";
import { useState } from "react";
import { useRouter } from "next/router";
import nookies from "nookies";
import { prisma } from "../../lib/prisma";

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  city: string;
  state: string;
  supplyType: string;
  monthlyBillValue: number;
}

interface DashboardProps {
  initialLeads: Lead[];
  token: string;
}

export default function Dashboard({ initialLeads, token }: DashboardProps) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const router = useRouter();

  const handleDelete = async (leadId: number) => {
    if (!window.confirm("Tem certeza de que deseja excluir este lead?")) {
      return;
    }

    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setLeads((currentLeads) =>
          currentLeads.filter((lead) => lead.id !== leadId)
        );
        alert("Lead excluído com sucesso!");
      } else {
        const data = await response.json();
        alert(`Erro ao excluir: ${data.error || "Tente novamente"}`);
      }
    } catch (error) {
      alert("Ocorreu um erro de conexão.");
    }
  };

  const handleLogout = () => {
    nookies.destroy(null, "token");
    router.push("/admin/login");
  };

  return (
    <div className="p-8">
      <div>
        <h1 className="text-3xl font-bold mb-10 text-center">
          Leads Capturados
        </h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        >
          Sair
        </button>
      </div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Nome</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Telefone</th>
            <th className="py-2 px-4 border-b">CPF</th>
            <th className="py-2 px-4 border-b">Cidade</th>
            <th className="py-2 px-4 border-b">Estado</th>
            <th className="py-2 px-4 border-b">Tipo de Fornecimento</th>
            <th className="py-2 px-4 border-b">Valor Mensal da Conta</th>
            <th className="py-2 px-4 border-b">Ações</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id}>
              <td className="py-2 px-4 border-b text-center">{lead.name}</td>
              <td className="py-2 px-4 border-b text-center">{lead.email}</td>
              <td className="py-2 px-4 border-b text-center">{lead.phone}</td>
              <td className="py-2 px-4 border-b text-center">{lead.cpf}</td>
              <td className="py-2 px-4 border-b text-center">{lead.city}</td>
              <td className="py-2 px-4 border-b text-center">{lead.state}</td>
              <td className="py-2 px-4 border-b text-center">
                {lead.supplyType}
              </td>
              <td className="py-2 px-4 border-b text-center">
                {lead.monthlyBillValue}
              </td>
              <td className="py-2 px-4 border-b text-center">
                <button
                  onClick={() => handleDelete(lead.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = nookies.get(ctx);
  const token = cookies.token;

  if (!token) {
    return { redirect: { destination: "/admin/login", permanent: false } };
  }

  try {
    const leadsFromDb = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
    });

    const initialLeads = leadsFromDb.map((lead) => ({
      ...lead,
      createdAt: lead.createdAt.toISOString(),
    }));

    return {
      props: {
        initialLeads,
        token,
      },
    };
  } catch (error) {
    console.error("Falha ao buscar leads no getServerSideProps:", error);
    nookies.destroy(ctx, "token", { path: "/" });
    return { redirect: { destination: "/admin/login", permanent: false } };
  }
};
