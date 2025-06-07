"use client";

import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SavingsData } from "../result/SavingsResult";
import Image from "next/image";

interface IBGEState {
  id: number;
  sigla: string;
  nome: string;
}

interface IBGECity {
  id: number;
  nome: string;
}

interface SimulationFormProps {
  onSuccess: (data: SavingsData) => void;
}

const leadSchema = z.object({
  name: z.string().min(3, "O nome completo é obrigatório."),
  email: z.string().email("Formato de e-mail inválido."),
  phone: z.string().min(10, "O telefone é obrigatório."),
  cpf: z.string().length(11, "O CPF deve ter 11 dígitos."),

  monthlyBillValue: z
    .number({ required_error: "O valor da conta é obrigatório." })
    .positive("O valor deve ser positivo."),
  supplyType: z.enum(["MONOPHASIC", "BIPHASIC", "TRIPHASIC"], {
    required_error: "Selecione o tipo.",
  }),
  state: z.string().min(1, "Selecione um estado."),
  city: z.string().min(1, "Selecione uma cidade."),
});

type LeadFormData = z.infer<typeof leadSchema>;

export default function SimulationForm({ onSuccess }: SimulationFormProps) {
  const [states, setStates] = useState<IBGEState[]>([]);
  const [cities, setCities] = useState<IBGECity[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
  });

  const watchedState = watch("state");

  useEffect(() => {
    fetch(
      "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome"
    )
      .then((res) => res.json())
      .then((data) => {
        setStates(data);
      });
  }, []);

  useEffect(() => {
    if (!watchedState) {
      setCities([]);
      return;
    }

    fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${watchedState}/municipios`
    )
      .then((res) => res.json())
      .then((data) => {
        setCities(data);
      });
  }, [watchedState]);

  const onSubmit: SubmitHandler<LeadFormData> = async (data) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.ok) {
        const discount = 0.25;
        const monthlySaving = data.monthlyBillValue * discount;

        const resultData: SavingsData = {
          totalPaidIn1Year: data.monthlyBillValue * 12,
          savedIn1Year: monthlySaving * 12,
          totalPaidIn3Years: data.monthlyBillValue * 36,
          savedIn3Years: monthlySaving * 36,
          totalPaidIn5Years: data.monthlyBillValue * 60,
          savedIn5Years: monthlySaving * 60,
        };

        onSuccess(resultData);
      } else {
        alert(`Erro ao enviar: ${responseData.error || "Tente novamente."}`);
      }
    } catch (error) {
      alert("Ocorreu um erro de conexão. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 p-8 bg-white shadow-md rounded-lg"
    >
      <div className="flex">
        <Image
          src="/logo.png"
          alt="Clean Energy Logo"
          width={100}
          height={100}
          className=""
        />
        <h2 className="text-2xl font-bold text-gray-800 text-center mt-8 mx-3">
          Venha conhecer o futuro da energia limpa!
        </h2>
      </div>

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Nome Completo
        </label>
        <input
          id="name"
          type="text"
          {...register("name")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
        />
        {errors.name && (
          <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          E-mail
        </label>
        <input
          id="email"
          type="email"
          {...register("email")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
        />
        {errors.email && (
          <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700"
        >
          Telefone
        </label>
        <input
          id="phone"
          type="tel"
          {...register("phone")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
        />
        {errors.phone && (
          <p className="mt-2 text-sm text-red-600">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="cpf"
          className="block text-sm font-medium text-gray-700"
        >
          CPF
        </label>
        <input
          id="cpf"
          type="text"
          {...register("cpf")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
        />
        {errors.cpf && (
          <p className="mt-2 text-sm text-red-600">{errors.cpf.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="state"
          className="block text-sm font-medium text-gray-700"
        >
          Estado
        </label>
        <select
          id="state"
          {...register("state")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
        >
          <option value="">Selecione um estado</option>
          {states.map((state) => (
            <option key={state.id} value={state.sigla}>
              {state.nome}
            </option>
          ))}
        </select>
        {errors.state && (
          <p className="mt-2 text-sm text-red-600">{errors.state.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="city"
          className="block text-sm font-medium text-gray-700"
        >
          Cidade
        </label>
        <select
          id="city"
          {...register("city")}
          disabled={cities.length === 0}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 disabled:bg-gray-100"
        >
          <option value="">Selecione uma cidade</option>
          {cities.map((city) => (
            <option key={city.id} value={city.nome}>
              {city.nome}
            </option>
          ))}
        </select>
        {errors.city && (
          <p className="mt-2 text-sm text-red-600">{errors.city.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="supplyType"
          className="block text-sm font-medium text-gray-700"
        >
          Tipo de Fornecimento
        </label>
        <select
          id="supplyType"
          {...register("supplyType")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
        >
          <option value="">Selecione o tipo</option>
          <option value="MONOPHASIC">Monofásico</option>
          <option value="BIPHASIC">Bifásico</option>
          <option value="TRIPHASIC">Trifásico</option>
        </select>
        {errors.supplyType && (
          <p className="mt-2 text-sm text-red-600">
            {errors.supplyType.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="monthlyBillValue"
          className="block text-sm font-medium text-gray-700"
        >
          Valor da sua conta de luz (R$)
        </label>
        <input
          id="monthlyBillValue"
          type="number"
          step="0.01"
          {...register("monthlyBillValue", { valueAsNumber: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
        />
        {errors.monthlyBillValue && (
          <p className="mt-2 text-sm text-red-600">
            {errors.monthlyBillValue.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full inline-flex justify-center rounded-md border border-transparent bg-emerald-500 py-3 px-4 text-base font-medium text-white shadow-sm hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
      >
        {isLoading ? "Enviando..." : "Simular"}
      </button>
    </form>
  );
}
