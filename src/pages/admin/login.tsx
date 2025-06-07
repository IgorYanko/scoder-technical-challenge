import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import nookies from 'nookies';
import Image from 'next/image';

const loginSchema = z.object({
   email: z.string().email("Formato de e-mail inválido."),
   password: z.string().min(6, "Senha curta demais.").max(12, "Senha longa demais."),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
   const [isLoading, setIsLoading] = useState(false);
   const router = useRouter();

   const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
      resolver: zodResolver(loginSchema)
   });

   const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
      setIsLoading(true);
   
      try {
         const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
         });

         const responseData = await response.json();
   
         if (response.ok) {
            nookies.set(null, 'token', responseData.token, {
               maxAge: 30,
               path: '/',
            });
            router.push('/admin/dashboard');
         } else {
            alert(responseData.error || 'Falha no login')
         }
      } catch (error) {
         alert('Ocorreu um erro de conexão. Por favor, tente novamente.');
      }
   };

   return (
      <div className="block min-h-screen items-center justify-center bg-gray-100 p-4">
         
         <div>
            <Image src="/logo.png" alt="Clean Energy Logo" width={320} height={320} className="mx-auto"/>
         </div>

         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-8 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-medium text-center">Faça seu login</h2>

            <div className="mb-4">
               <label htmlFor="email" className="block text-lg font-medium text-gray-700">Email</label>
               <input id="email" type="email" {...register('email')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"/>
               {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div className="mb-6">
               <label htmlFor="password" className="block text-lg font-medium text-gray-700">Senha</label>
               <input id="password" type="password" {...register('password')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"/>
               {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
            </div>

            <button
               type="submit"
               disabled={isLoading}
               className="w-full inline-flex justify-center rounded-md border border-transparent bg-emerald-500 py-3 px-4 text-base font-medium text-white shadow-sm hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
                  {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
         </form>
      </div>
   )
}