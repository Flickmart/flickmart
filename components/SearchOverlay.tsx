import { ArrowLeft } from 'lucide-react'
import React, { useState } from 'react'
import SearchInput from './SearchInput'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'

export default function SearchOverlay({open, openSearch}: {open: boolean, openSearch: (val: boolean)=> void}) {
  const [autoSuggest, setAutoSuggest] = useState<Array<string>>([])
  function updateAutoSuggest(values: Array<string>){
    setAutoSuggest(values)
  }
  return (
    <div className={`py-3 flex flex-col bg-white min-h-screen fixed z-40 inset-0 ${open? "block": "hidden"} `}>
      <div className='flex shadow-md py-3 px-3 justify-between items-center gap-3'>
        <ArrowLeft onClick={()=>openSearch(false)}/>
        <div className='bg-gray-100 rounded-lg flex-grow'>
          <SearchInput updateAutoSuggest={updateAutoSuggest}/>
        </div>
      </div>
      <div className='flex-grow pt-3 px-4'>
        {autoSuggest.map((item, index)=> 
        <p className=' px-0 py-4 hover:bg-gray-100 transition-all duration-700 ease-in-out font-medium text-sm capitalize' key={index}>
          {item}
        </p>
        )}
      </div>
    </div>
  )
}
