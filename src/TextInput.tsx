import React from 'react'

type TextInputProps = {
  value?: string
  defaultValue?: string
  placeholder?: string
  name: string
  title: string
  type?: string
  readOnly?: boolean
  pattern?: string
  minLength?: number
  maxLength?: number
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export default function TextInput({value, placeholder='type here', name, onChange, type='text', title, pattern, defaultValue, readOnly=false, minLength, maxLength}: TextInputProps) {

  return (
    <div>
      <h3 className='form-label'>{title}</h3>
      <input name={name} type={type} className='form-control' value={value} defaultValue={defaultValue} readOnly={readOnly} minLength={minLength} maxLength={maxLength} pattern={pattern} placeholder={placeholder} onChange={onChange}/>
    </div>
  )
}
