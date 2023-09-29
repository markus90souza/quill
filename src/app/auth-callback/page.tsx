'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { trpc } from '../_trpc/client'
import { Loader2 } from 'lucide-react'

const AuthCallback = () => {
  const router = useRouter()

  const searchParams = useSearchParams()

  const origin = searchParams.get('origin')

  trpc.authCallback.useQuery(undefined, {
    onSuccess({ success }) {
      if (success) {
        // usuario sincronizado com a base de dados
        return router.push(origin ? `/${origin}` : '/dashboard')
      }
    },

    onError(error) {
      if (error.data?.code === 'UNAUTHORIZED') {
        // se nao existir o usuario retorna para a ágina de login
        return router.push('/sign-in')
      }
    },

    retry: true,
    retryDelay: 500,
  })
  return (
    <div className="flex justify-center w-full mt-24">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="w-8 h-8 text-gray-800 animate-spin" />

        <h3 className="font-semibold text-xl">Settings your account...</h3>
        <p>Redirecionamento automatico</p>
      </div>
    </div>
  )
}
export default AuthCallback
