import { useEffect, useRef, useState } from 'react'
import TextInput from './TextInput';
import QRCodeGenerator from './QRCodeGenerator';
import { useReactToPrint } from "react-to-print";
import SelectInput, { OptionType } from './SelectInput';

function App() {
  const componentRef = useRef(null)
  const buttonRef = useRef<null | HTMLButtonElement>(null)

  const initialFormData = Object.freeze({
    rangeFrom: "000000",
    rangeTo: "",
    bag: "",
    country: "",
    warehouseLocation:"",
    warehouse: "",
    product: "",
    productCode: ""
  });

  const [formData, updateFormData] = useState(initialFormData)

  const [selectedBagOption, setSelectedBagOption] = useState<any>({value: '', label: ''})
  const [selectedProductOption, setSelectedProductOption] = useState<any>({value: '', label: ''})
  const [selectedWarehouseLocationOption, setSelectedWarehouseLocationOption] = useState<any>({value: '', label: ''})
  const [selectedWarehouseOption, setSelectedWarehouseOption] = useState<any>({value: '', label: ''})


  const [rangeTo, setRangeTo] = useState('')
  const [productCode, setProductCode] = useState('')
  const [printAllAddresses, setPrintAllAddresses] = useState<boolean>(false)
  const [encodedData, setEncodedData] = useState<string[]>([])
  const [showQRCode, setShowQRCode] = useState<boolean>(false)
  // const [qrCodeSize, setQRCodeSize] = useState<number>(290)
  
  useEffect(() => {
    scrollToBottom()
  }, [showQRCode])

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    const { name, value } = event.target;
    
    if(name === 'rangeTo')
      setRangeTo(bagNumberFormat(Number(value)))
    
    updateFormData({
      ...formData,
      [name]: value.trim()
    });
  }

  const onBagSelect = (selected:OptionType) => {
    setSelectedBagOption(selected)
    updateFormData({
      ...formData,
      bag: selected.value
    })
  }

  const onProductSelect = (selected:OptionType) => {
    setSelectedProductOption(selected)
    setProductCode(selected.code)
    updateFormData({
      ...formData,
      product: selected.value,
      productCode: selected.code
    })
  }

  const onWarehouseLocationSelect = (selected:OptionType) => {
    setSelectedWarehouseLocationOption(selected)
    updateFormData({
      ...formData,
      warehouseLocation: selected.value
    })
  }

  const onWarehouseSelect = (selected:OptionType) => {
    setSelectedWarehouseOption(selected)
    updateFormData({
      ...formData,
      warehouse: selected.value
    })
  }
  
  const onToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.currentTarget.value === 'true' ? true : false;
    setPrintAllAddresses(isChecked)
    setShowQRCode(false)
    setEncodedData([])
  }

  const submitForm: React.FormEventHandler<HTMLFormElement> = (event) => { 
    event.preventDefault()
    generateQRCode()
    setShowQRCode(true)
    scrollToBottom()
  }

  const generateQRCode = () => {
    let lastRangeNumber = parseInt(rangeTo, 10)
    // if(printAllAddresses){
    //   return setEncodedData(generateSequence(lastRangeNumber).flat())
    // }
    // return setEncodedData([JSON.stringify(`${aisle + ':' + rack + ':' + level}`)])
    return setEncodedData(generateSequence(lastRangeNumber).flat())
  }

  const bagNumberFormat = (value:number) => `000000${value}`.slice(-6)

  const bagCodeformat = (index: number) => `${bagNumberFormat(index)}-${selectedBagOption.value}-${formData.country.toUpperCase()}-${selectedWarehouseLocationOption.value}-${selectedWarehouseOption.value}-${selectedProductOption.value}-${productCode}`

  const generateSequence = (quantity: number) => {
    const sequence = Array.apply(0, Array(quantity)).map(function(_, idx) { return `${bagCodeformat(idx)}` }).map((item) => {
      const temp = []
      const bagCode =  item
      temp.push(bagCode)
      return temp;
    })
    delete sequence[0]
    return sequence.filter(items => !!items)
  }

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    // onBeforePrint: () => setQRCodeSize(1290)
  });

  const scrollToBottom = () => {
    if(buttonRef.current){
      buttonRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest'
      })
    }
  }

  const bagOptions = [
    { value: "40", label: "40KG", type: "bags"},
    { value: "50", label: "50KG", type: "bags"},
    { value: "60", label: "60KG", type: "bags"},
    { value: "85", label: "85KG", type: "bags"},
  ]

  const warehouseLocations = [
    {value: "KAG", label: "Kaduna", code: "DAM", type: "warehouse-locations"}
  ]

  const warehouses = [
    {value: "DAM", label: "DAM", type: "warehouses"}
  ]

  const products = [
    {value: "GINGER", label: "DSGR-GINGER", code: "DSGR", type: "products"},
    {value: "MAIZE", label: "MZE-MAIZE", code: "MZE", type: "products"},
    {value: "SORGHUM", label: "SUM-SORGHUM", code: "SUM", type: "products"}
  ]

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Enter Bag Address to Print
        </p>
      </header>
      <form onSubmit={submitForm}>
        <div className="select-boxes">
          <div className='flex'>
            <TextInput defaultValue='000000' name='rangeFrom' placeholder="range" type='number' title="Range from" readOnly />
            <TextInput name='rangeTo' value={rangeTo} placeholder="range-to" title="Range to" type='number' onChange={onChangeHandler} />
          </div>
          <SelectInput options={bagOptions} title='Bags' name='bag' selected={selectedBagOption} onSelect={onBagSelect} />
          <TextInput name='country' title="Country" placeholder="country" onChange={onChangeHandler}  />
          <SelectInput options={warehouseLocations} title='Warehouse Location' name='warehouseLocation' selected={selectedWarehouseLocationOption} onSelect={onWarehouseLocationSelect} />
          <SelectInput options={warehouses} title='Warehouse' name='warehouse' selected={selectedWarehouseOption} onSelect={onWarehouseSelect} />
          <SelectInput options={products} title='Products' name='product' selected={selectedProductOption} onSelect={onProductSelect} />
          <TextInput name='productCode'value={productCode} title="Product Code" placeholder="Product Code" onChange={onChangeHandler} />
        </div>
        
        <div className="form-group">
          <input type="radio" checked={printAllAddresses === false} value='false' onChange={onToggle}  name="printAllAddresses" id="single"/>
          <label htmlFor="single">Print only this address</label>
        </div>
        
        <div className="form-group">
          <input type="radio" checked={printAllAddresses === true} value='true' onChange={onToggle} name="printAllAddresses" id="multiple"/>
          <label htmlFor="multiple">Print all addresses for this range</label>
        </div>
        
        {!showQRCode ? <input type='submit' value='submit' /> : null}
      </form>
      
      <div className="qr-code-container" ref={componentRef}>
        {showQRCode ? encodedData.map((data, idx) => <QRCodeGenerator key={idx} data={data} size={290}/>) : null}
      </div>
      {showQRCode ? <button ref={buttonRef} onClick={handlePrint}>print</button> : null}
    </div>
  );
}

export default App;

