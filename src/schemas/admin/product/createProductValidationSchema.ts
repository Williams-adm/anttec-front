import { array, number, object, string } from 'yup'

export const createProductSchema = object({
  name: string()
    .required('El nombre es obligatorio')
    .min(3, 'Debe de contener más de 3 caracteres')
    .max(100, 'Debe contener menos de 100 caracteres'),
  model: string()
    .required('El modelo es obligatorio')
    .min(3, 'Debe de contener más de 3 caracteres')
    .max(80, 'Debe contener menos de 80 caracteres'),
  description: string().notRequired().nullable().min(10, 'Debe de contener más de 10 caracteres').transform((value, originalValue) =>
    originalValue === '' ? null : value
  ),
  subcategory_id: number()
    .nullable()
    .transform((value, originalValue) => (originalValue === '' ? null : value))
    .required('La subcategoría es obligatoria'),
  brand_id: number()
    .nullable()
    .transform((value, originalValue) => (originalValue === '' ? null : value))
    .required('La marca es obligatoria'),
  specifications: array()
    .of(
      object({
        specification_id: number().required('El ID de especificación es obligatorio'),

        value: string()
          .required('El valor es obligatorio')
          .min(2, 'Debe contener al menos 2 caracteres'),
      }),
    )
    .required('Debes agregar al menos una especificación')
    .min(1, 'Debes agregar al menos una especificación')
    .test('unique-specification-ids', 'No puedes repetir especificaciones', (specs) => {
      if (!specs) return false
      const ids = specs.map((s) => s.specification_id)
      return ids.length === new Set(ids).size
    }),
})
