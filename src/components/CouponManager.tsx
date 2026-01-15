import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Tag, Plus, Edit2, Trash2, Check, X, Loader2 } from 'lucide-react'

interface Coupon {
  id: string
  code: string
  description: string
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  active: boolean
  valid_until: string | null
  max_uses: number | null
  used_count: number
  created_at: string
}

export const CouponManager = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)

  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discount_type: 'percentage' as 'percentage' | 'fixed',
    discount_value: '',
    active: true,
    valid_until: '',
    max_uses: ''
  })

  useEffect(() => {
    fetchCoupons()
  }, [])

  const fetchCoupons = async () => {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setCoupons(data || [])
    } catch (err) {
      console.error('Erro ao carregar cupons:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const couponData = {
        code: formData.code.toUpperCase(),
        description: formData.description,
        discount_type: formData.discount_type,
        discount_value: parseFloat(formData.discount_value),
        active: formData.active,
        valid_until: formData.valid_until || null,
        max_uses: formData.max_uses ? parseInt(formData.max_uses) : null
      }

      if (editingCoupon) {
        // Update existing coupon
        const { error } = await supabase
          .from('coupons')
          .update(couponData)
          .eq('id', editingCoupon.id)

        if (error) throw error
      } else {
        // Create new coupon
        const { error } = await supabase
          .from('coupons')
          .insert([couponData])

        if (error) throw error
      }

      // Reset form
      setFormData({
        code: '',
        description: '',
        discount_type: 'percentage',
        discount_value: '',
        active: true,
        valid_until: '',
        max_uses: ''
      })
      setShowForm(false)
      setEditingCoupon(null)
      fetchCoupons()
    } catch (err: any) {
      alert('Erro ao salvar cupom: ' + err.message)
    }
  }

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon)
    setFormData({
      code: coupon.code,
      description: coupon.description,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value.toString(),
      active: coupon.active,
      valid_until: coupon.valid_until ? coupon.valid_until.split('T')[0] : '',
      max_uses: coupon.max_uses?.toString() || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este cupom?')) return

    try {
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchCoupons()
    } catch (err: any) {
      alert('Erro ao excluir cupom: ' + err.message)
    }
  }

  const toggleActive = async (coupon: Coupon) => {
    try {
      const { error } = await supabase
        .from('coupons')
        .update({ active: !coupon.active })
        .eq('id', coupon.id)

      if (error) throw error
      fetchCoupons()
    } catch (err: any) {
      alert('Erro ao atualizar cupom: ' + err.message)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Tag className="w-6 h-6 text-orange-600" />
          <h2 className="text-2xl font-bold text-gray-900">Gerenciar Cupons</h2>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm)
            setEditingCoupon(null)
            setFormData({
              code: '',
              description: '',
              discount_type: 'percentage',
              discount_value: '',
              active: true,
              valid_until: '',
              max_uses: ''
            })
          }}
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
        >
          <Plus className="w-5 h-5" />
          Novo Cupom
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-bold mb-4">
            {editingCoupon ? 'Editar Cupom' : 'Criar Novo Cupom'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código do Cupom *
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="EXEMPLO10"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Desconto *
              </label>
              <select
                value={formData.discount_type}
                onChange={(e) => setFormData({ ...formData, discount_type: e.target.value as 'percentage' | 'fixed' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="percentage">Porcentagem (%)</option>
                <option value="fixed">Valor Fixo (R$)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor do Desconto *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.discount_value}
                onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder={formData.discount_type === 'percentage' ? '10' : '50.00'}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Máximo de Usos
              </label>
              <input
                type="number"
                value={formData.max_uses}
                onChange={(e) => setFormData({ ...formData, max_uses: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="Deixe vazio para ilimitado"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Válido Até
              </label>
              <input
                type="date"
                value={formData.valid_until}
                onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-5 h-5 text-orange-600 rounded focus:ring-2 focus:ring-orange-500"
                />
                <span className="text-sm font-medium text-gray-700">Cupom Ativo</span>
              </label>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                rows={2}
                placeholder="Descrição do cupom..."
              />
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              <Check className="w-5 h-5" />
              {editingCoupon ? 'Atualizar' : 'Criar'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false)
                setEditingCoupon(null)
              }}
              className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              <X className="w-5 h-5" />
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Coupons List */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Código</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Desconto</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Usos</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Validade</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Ações</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div>
                    <p className="font-bold text-gray-900">{coupon.code}</p>
                    <p className="text-sm text-gray-500">{coupon.description}</p>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="font-semibold text-green-600">
                    {coupon.discount_type === 'percentage'
                      ? `${coupon.discount_value}%`
                      : `R$ ${coupon.discount_value.toFixed(2)}`}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm">
                    {coupon.used_count} / {coupon.max_uses || '∞'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-gray-600">
                    {coupon.valid_until
                      ? new Date(coupon.valid_until).toLocaleDateString('pt-BR')
                      : 'Sem limite'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => toggleActive(coupon)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      coupon.active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {coupon.active ? 'Ativo' : 'Inativo'}
                  </button>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEdit(coupon)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(coupon.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {coupons.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Tag className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum cupom cadastrado ainda</p>
          </div>
        )}
      </div>
    </div>
  )
}
