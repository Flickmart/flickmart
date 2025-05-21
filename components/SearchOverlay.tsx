import { ArrowLeft } from 'lucide-react'
import React, { useState } from 'react'
import SearchInput from './SearchInput'
import { useRouter } from 'next/navigation'

export default function SearchOverlay({open, openSearch, query}: {query?: string; open: boolean, openSearch: (val: boolean)=> void}) {
  const [autoSuggest, setAutoSuggest] = useState<Array<string>>([])
  const router = useRouter()
  function updateAutoSuggest(values: Array<string>){
    setAutoSuggest(values)
  }

  return (
    <div className={`py-3  flex flex-col bg-white min-h-screen fixed z-40 inset-0 ${open? "block": "hidden"} `}>
      <div className='flex shadow-md py-3 px-3 justify-between items-center gap-3'>
        <ArrowLeft onClick={()=>openSearch(false)}/>
        <div className='bg-gray-100 rounded-lg flex-grow'>
          <SearchInput updateAutoSuggest={updateAutoSuggest} openSearch={openSearch} query={query ?? ""} isOverlayOpen={open}/>
        </div>
      </div>
      <div className='flex-grow pt-3'>
        <p className='px-4 py-4 text-gray-500 text-xs font-medium capitalize'>
          suggestions
        </p>
        {autoSuggest.map((item, index)=> 
        <p onClick={()=>  router.push(`/search?query=${item}`)} className='px-4 py-4 hover:bg-gray-100 transition-all duration-700 ease-in-out font-medium text-sm capitalize' key={index}>
          {item}
        </p>
        )}
      </div>
    </div>
  )
}
