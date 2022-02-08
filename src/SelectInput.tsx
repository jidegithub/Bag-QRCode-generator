import Select from 'react-select'

export type OptionType = {
  value: string
  label: string
  type: string
  code: string
};

type selectProps = {
  options: any[]
  title: string
  name: string
  selected?: string
  onSelect?: any
}

export default function SelectInput({options, title, name, selected, onSelect}: selectProps) {
  return (
    <div>
      <h3 className='form-label'>{title}</h3>
      <Select options={options} name={name} value={selected} onChange={(select) => onSelect(select)} />
    </div>
  )
}
