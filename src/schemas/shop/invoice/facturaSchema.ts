import { object, string } from 'yup'

export const facturaSchema = object({
  business_name: string()
    .required('La razón social es obligatoria')
    .min(3, 'Debe de contener más de 3 caracteres')
    .max(100, 'Debe contener menos de 100 caracteres'),
  tax_address: string()
    .required('La dirección fiscal es obligatoria')
    .min(1, 'Debe de contener más de 1 caracteres')
    .max(150, 'Debe contener menos de 150 caracteres'),
  document_type: string()
    .required('El tipo de documento es obligatorio')
    .oneOf(['RUC'], 'Tipo de documento no válido'),
  document_number: string()
    .required('El RUC es obligatorio')
    .matches(/^[0-9]+$/, 'El número de documento solo debe contener números')
    .length(11, 'EL RUC debe tener exactamente 11 dígitos'),
})
