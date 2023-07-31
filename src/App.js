import { useEffect, useState } from 'react'
import './App.css';

import db from './firebase/config';
import { collection, addDoc, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';

export default function App() {
  const [id, setId] = useState(null)
  const [persons, setPersons] = useState([])
  const [name, setName] = useState("")
  const [position, setPosition] = useState("")
  useEffect(()=>{
    onSnapshot(collection(db,"employees"), snap => {
      setPersons( prev => snap.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        position: doc.data().position
      })))
    })
  },[])

  const handlerSave = async () => {
    try{
      const action = id ? updateDoc : addDoc
      const collectionInstance = id ? doc(db, "employees", id) : collection(db, "employees")
      await action(collectionInstance,{
        name, 
        position
      })
    } catch( error ) {
      console.log( error )
    } finally {
      setName("")
      setPosition("")
      setId(null)
    }
  }

  const handlerEdit = (id) => () => {
    const personTarget = persons.find( person => person.id == id )
    setId(prev => id)
    setName( prev => personTarget.name )
    setPosition( prev => personTarget.position )
  }

  const handlerDelete = (id) => async () => {
    try{
      await deleteDoc(
        doc(db, "employees", id)
      )
    } catch( error ) {
      console.log( error )
    }
    
  }


  return (
    <div className="p-5 bg-gray-100 h-screen">
      <div className="w-1/3 mx-auto flex flex-col rounded-lg p-4 bg-white gap-4 shadow-lg shadow-gray-400 h-min-1/4">
        <h3 className="text-center font-bold">Formulario</h3>
        <input type="text" placeholder="Nombre" value={name} onChange={ev=>setName(ev.target.value)} className="text-gray-500 font-bold outline-none border border-blue-200 bg-blue-50 p-2 rounded-lg hover:border-blue-400 focus:border-blue-400 focus:bg-blue-200"/>
        <input type="text" placeholder="Posicion" value={position} onChange={ev=>setPosition(ev.target.value)} className="text-gray-500 font-bold outline-none border border-blue-200 bg-blue-50 p-2 rounded-lg hover:border-blue-400 focus:border-blue-400 focus:bg-blue-200"/>
        <button onClick={handlerSave} className="bg-purple-500 p-2 px-10 rounded-lg text-white font-bold w-fit mx-auto hover:p-3 hover:px-12 transition-[padding] transition-5000">Enviar</button>
      </div>
      <div className="w-1/3 mx-auto flex flex-col rounded-lg p-4 bg-white gap-4 shadow-lg shadow-gray-400 mt-10">
        <h3 className="text-center font-bold">Lista de Personas</h3>
        <ul className="border-t-2 border-b-2 pt-2">
          { persons.map( person => <li className="flex flex-row justify-between p-2 border-b  items-center" key={person.id}>
            <span>
              <p className="font-bold">{person.name}</p>
              <small className="relative left-5 text-gray-500 italic">{person.position}</small>
            </span>
            <span className="flex flex-col gap-2">
              <button className="bg-blue-200 hover:bg-blue-500 p-1 px-3 rounded-lg text-white" onClick={handlerEdit(person.id)}>Editar</button>
              <button className="bg-red-200 hover:bg-red-500 p-1 px-3 rounded-lg text-white" onClick={handlerDelete(person.id)}>Eliminar</button>
            </span>
          </li>)}
        </ul>
      </div>
    </div>
  );
}
