"use client"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus,faMinus } from '@fortawesome/free-solid-svg-icons';
import Navbar from "@/Components/Navbar";
import { useState ,useEffect} from "react";


export default function Home() {
  const stockinitial=[]
  const[loadst,setloadst]=useState(stockinitial)
  const[addst,setaddst]=useState({slug:"",quantity:"",price:""})
  const[mtrue,setmtrue]=useState(false)
  const[query,setquery]=useState("")
  const[drop,setdrop]=useState([])

  useEffect(()=>{
    getstocks()
  },[])

   const addproduct= async (e)=>{
    e.preventDefault()
    try {
      const response=await fetch('/api/products',{
        method:'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body:JSON.stringify(addst)
      })
      if(response.ok){
        setmtrue(true)
        setTimeout(() => {
          setmtrue(false)
        }, 1500);
        console.log("success")
      }
      else {
        console.log("error adding ")
      }
      getstocks()
      setaddst({slug:"",quantity:"",price:""})
    } catch (error) {
      console.error('Error:',error)
    }
  }
  const getstocks=async()=>{
    const response=await fetch('/api/products',{
      method:'GET',
      headers:{
        'Content-Type': 'application/json',
      },
    })
    const json=await response.json()
    setloadst(json.productstock)
  }
  
  const handlechange=(e)=>{
    setaddst({...addst,[e.target.name]:e.target.value})
  }

  const ondrop = async (e) => {
    let value=e.target.value
    setquery(value)
    if(value.length>=3){
      const response=await fetch('/api/search?query='+ query)
      const json=await response.json()
      setdrop(json.productstock)
    }
    else{
      setdrop([])

    }
  }

  const stockadddel= async (action,slug,initialquantity) => {
    let index=loadst.findIndex((item)=>item.slug=slug)
    let newloadst=JSON.parse(JSON.stringify(loadst))
    if(action=="plus"){
      newloadst[index].quantity=parseInt(initialquantity)+1
    }
    else{
      newloadst[index].quantity=parseInt(initialquantity)-1
    }
    setloadst(newloadst)

    let indexdrop=drop.findIndex((item)=>item.slug=slug)
    let newdrop=JSON.parse(JSON.stringify(drop))
    if(action=='plus'){
      newdrop[indexdrop].quantity=parseInt(initialquantity)+1
    }
    else{
      newdrop[indexdrop].quantity=parseInt(initialquantity)-1
    }
    setdrop(newdrop)
    try {
      const response=await fetch('/api/action',{
        method:'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body:JSON.stringify({action,slug,initialquantity})
      })
  }catch (error){
    console.error('Error:',error)
  }
}

  return(
  <>
  <Navbar/>
  {/* display current stock */}
  <div className="container mx-auto ">
  <div className="text-center"><span className="text-sm text-teal-500">{mtrue ? "Your stock has been added successfully!!!" : ""}</span></div>
    <h1 className="text-teal-500 font-semibold mb-2">Search Product</h1>
    <input type="text"  onChange={ondrop} className="w-4/5 border border-gray-400    mx-2 px-2 py-1 text-sm rounded-md mb-2 "/>
    <div className="absolute bg-teal-50 border rounded b-2">
    {drop.map((item)=>{
      return <div key={item._id} className=" flex justify-between  w-[72vw] text-base  p-2">
      <div>{item.slug} {item.quantity} availabe for ₹{item.price}</div>
      <div>
      <button onClick={() => {stockadddel("plus",item.slug,item.quantity)}} className='bg-white-200 px-0.5 py-0 rounded-md border mx-3 '>
  <FontAwesomeIcon icon={faPlus} size='sm' className="px-1" />
  
</button>
      {/* <span><FontAwesomeIcon icon={faPlus} size='sm' /></span> */}
      <span>{item.quantity}</span>
      {/* <span><FontAwesomeIcon icon={faMinus} size='sm' /></span> */}
      <button onClick={() => {stockadddel("minus",item.slug,item.quantity)}} className='bg-white-200 px-0.5 py-0 rounded-md border  mx-3 '>
  <FontAwesomeIcon icon={faMinus} size='sm' className="px-1" />

</button>

      </div>
      </div>
    })}
    </div>
  <div className="mb-2 my-3">
    <h1 className=" font-semibold text-teal-500">Add a Product</h1>
  </div>
  <form className="">
    <div className="mb-4">
      <label htmlFor="Productname" className="block mb-2 text-slate-500">Product slug</label>
      <input value={addst.slug} onChange={handlechange} name="slug" type="text" id="slug" className="w-4/5 border border-gray-400   mx-2 px-2 py-1 text-sm rounded-md "/>
    </div>
    <div className="mb-4">
      <label htmlFor="stock" className="block mb-2 text-slate-500">quantity</label>
      <input value={addst.quantity} onChange={handlechange} name="quantity" type="text" id="quantity" className="w-4/5 border border-gray-400 mx-2 px-2 py-1 text-sm rounded-md "/>
    </div>
    <div className="mb-4">
      <label htmlFor="price" className="block mb-2 text-slate-500">Price</label>
      <input value={addst.price} onChange={handlechange} name="price" type="text" id="price" className="w-4/5 border border-gray-400 mx-2 px-2 py-1 text-sm rounded-md "/>
    </div>
    <button onClick={addproduct} type="submit" className=" text-sm text-white bg-teal-500 hover:text-base   border  border-teal-500 rounded-md px-2 py-1" >save</button>
  </form>
  <div className="my-4">
    <h1 className="font-semibold text-teal-500">Display Current Stock</h1>
    </div>
  <section className="text-gray-600 body-font my-4">
  <div className="">
    <div className=" overflow-auto">
      <table className="table-auto w-full text-left whitespace-no-wrap ">
        <thead> 
          <tr className="">
            <th className="  px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tl rounded-bl">Product Slug</th>
            <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">Stock</th>
            <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">Price</th>
          </tr>
        </thead>
        <tbody>
        {Array.isArray(loadst) && loadst.map((item)=>{
       return  <tr key={item._id} className="  border-gray-200">
            <td  className=" border px-4 py-3 ">{item.slug}</td>
            <td className="border px-4 py-3">{item.quantity}</td>
            <td className="border px-4 py-3">₹ {item.price}</td>
          </tr>
})}
        </tbody>
      </table>
    </div>
  </div>
</section>
</div>

  </>
  )
  
}
