"use client";

import { useEffect, useState } from 'react';
import PhotoGallery from '@/components/PhotoGallery';
import {useSocket, IContextSocket} from '../../contexts/socketContext'
export const dynamic = "force-dynamic";

const getSearch = ()=>{
  if (typeof window !== "undefined") {
    // Client-side-only code
    let search = window.location.search.substring(1);
    let searchObj = JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g,'":"') + '"}', function(key, value) { return key===""?value:decodeURIComponent(value) })
    return searchObj
  }
  
}

export default function View() {
    
  const ws: IContextSocket | null = useSocket();
  const [id, setId] = useState(undefined)
  

  useEffect(()=>{
    if(id != undefined){
      const pair = { "action": "pair", "viewId": id }
      ws?.onConnect(pair)
    }else{
      setId(getSearch().viewId)
    }
    
  },[id])


  useEffect(()=>{
    console.log(ws?.firstPhotos, "useEffect")
  }, [ws?.firstPhotos])
  return (
    <>
    {ws?.firstPhotos && ws?.firstPhotos.length!= 0 ? 
      <PhotoGallery photos={ws.firstPhotos}/> 
      : 
      <p>Esperando fotos</p>}
      
    </>
  );
}
