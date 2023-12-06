import { useState, useEffect, useRef } from 'react'
import './App.css'

interface IEntry {
  min_alder: number
  maks_alder: number
  min_belop: number
  maks_belop: number
  pensjonist: boolean
  student: boolean
  navn: string
  id: string
  href: string
  leverandor: string
  produktpakke_tekst: string
  markedsomraade: string
  markedsomraadeTekst: string
  spesielle_betingelser: string
}

const App = () => {

  const [bankData, setBankData] = useState<IEntry[]>([])
  const [age, setAge] = useState(0)
  const [belop, setBelop] = useState(0)
  const [pensjonist, setPensjonist] = useState(false)
  const [student, setStudent] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const reset = () => {
    setAge(0)
    setBelop(0)
    setPensjonist(false)
    setStudent(false)
  }

  useEffect(() => {
    (async () => {
      const data = await fetch("/data")
      const json = await data.json()
      setBankData(json as IEntry[])
    })()
  }, [])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])


  const filteredData = bankData.filter((entry) => {
    if(
      (entry.min_alder === 0 || age === 0 || age >= entry.min_alder) &&
      (entry.maks_alder === 0 || age <= entry.maks_alder) && 
      (entry.min_belop === 0 || belop === 0 || belop >= entry.min_belop) && 
      (entry.maks_belop === 0 || belop <= entry.maks_belop) &&
      (entry.pensjonist === pensjonist) &&
      (entry.student === student)
    ) {
      return true
    }
    return false
  })

  return (
    <>
      <h1>Spareavtaler</h1>
      <h3>Fyll inn informasjon</h3>
      <div><label>Alder<input type="number" value={age} onChange={(e) => setAge(+e.target.value)} ref={inputRef} /></label></div>
      <div><label>Beløp<input type="number" value={belop} onChange={(e) => setBelop(+e.target.value)} /></label></div>
      <div><label>Pensjonist<input type="checkbox" checked={pensjonist} onChange={() => setPensjonist(!pensjonist)} /></label></div>
      <div><label>Student<input type="checkbox" checked={student} onChange={() => setStudent(!student) } /></label></div>
      <button onClick={() => reset()}>Reset</button>
      <hr />
      
      <div>
        {filteredData.map(entry => <Entry key={entry.id} entry={entry}/>)}
      </div>
    </>
  )
}

const Entry = ({entry}: {entry: IEntry}) => {
  return (
    <details className="entry">
      <summary>{entry.navn}</summary>
      <div>{entry.produktpakke_tekst}</div>
      <hr />
      <div>{entry.markedsomraade}</div>
      <div>{entry.markedsomraadeTekst}</div>
      <hr />
      <div>{entry.spesielle_betingelser}</div>
      <a href={entry.href} target='_blank'>Les mer</a>
    </details>
  )
}

export default App
