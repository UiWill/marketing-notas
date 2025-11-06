import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { User, Mail, Phone, DollarSign, ArrowRight, Loader2 } from 'lucide-react'
import { useLeadCapture } from '@/hooks/useLeadCapture'
import type { LeadFormData } from '@/types'

interface LeadFormProps {
  onSubmitSuccess: (leadId: string) => void
  className?: string
}

export const LeadForm = ({ onSubmitSuccess, className = '' }: LeadFormProps) => {
  const [showForm, setShowForm] = useState(false)
  const { submitLead, isSubmitting, error } = useLeadCapture()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LeadFormData>()

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    }
    return value
  }

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    const amount = parseInt(numbers) / 100
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount)
  }

  const onSubmit = async (data: LeadFormData) => {
    try {
      const lead = await submitLead({
        ...data,
        phone: data.phone.replace(/\D/g, ''),
      })
      onSubmitSuccess(lead.id)
    } catch (err) {
      console.error('Error submitting lead:', err)
    }
  }

  if (!showForm) {
    return (
      <div className={`text-center ${className}`}>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-3 bg-white hover:bg-gray-100 text-black font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl animate-pulse-slow border-2 border-white"
        >
          CLIQUE AQUI E RECEBA NOSSOS SERVIÇOS EXCLUSIVOS
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-2xl shadow-2xl p-8 ${className}`}>
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Receba Nossa Consultoria Exclusiva
        </h3>
        <p className="text-gray-600">
          Preencha os dados abaixo e proteja seu negócio hoje mesmo
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Nome Completo *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              {...register('name', {
                required: 'Nome é obrigatório',
                minLength: { value: 2, message: 'Nome deve ter pelo menos 2 caracteres' }
              })}
              type="text"
              id="name"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors"
              placeholder="Seu nome completo"
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            E-mail *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              {...register('email', {
                required: 'E-mail é obrigatório',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'E-mail inválido'
                }
              })}
              type="email"
              id="email"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors"
              placeholder="seu@email.com"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            WhatsApp *
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              {...register('phone', {
                required: 'WhatsApp é obrigatório',
                minLength: { value: 10, message: 'WhatsApp deve ter pelo menos 10 dígitos' }
              })}
              type="tel"
              id="phone"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors"
              placeholder="(11) 99999-9999"
              onChange={(e) => {
                const formatted = formatPhone(e.target.value)
                setValue('phone', formatted)
              }}
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="revenue" className="block text-sm font-medium text-gray-700 mb-2">
            Faturamento Mensal *
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              {...register('revenue', {
                required: 'Faturamento é obrigatório',
                min: { value: 0.01, message: 'Faturamento deve ser maior que zero' }
              })}
              type="text"
              id="revenue"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors"
              placeholder="R$ 0,00"
              onChange={(e) => {
                const formatted = formatCurrency(e.target.value)
                setValue('revenue', parseFloat(formatted.replace(/[^0-9,]/g, '').replace(',', '.')))
              }}
            />
          </div>
          {errors.revenue && (
            <p className="mt-1 text-sm text-red-600">{errors.revenue.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-accent-400 hover:bg-orange-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              QUERO PROTEGER MEU NEGÓCIO AGORA
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>

        <p className="text-xs text-gray-500 text-center">
          Seus dados estão seguros conosco. Não compartilhamos informações com terceiros.
        </p>
      </form>
    </div>
  )
}