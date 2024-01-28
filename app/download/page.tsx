"use client";
import { useEffect, useState } from 'react';
import {useSocket, IContextSocket} from '../../contexts/socketContext';
import PhotoGallery from '@/components/PhotoGallery';

const getSearch = ()=>{
  if (typeof window !== "undefined") {
    // Client-side-only code
    let search = window.location.search.substring(1);
    let searchObj = JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g,'":"') + '"}', function(key, value) { return key===""?value:decodeURIComponent(value) })
    return searchObj
  }
  
}

export default function Download() {
  const ws: IContextSocket | null = useSocket();

  const [id, setId] = useState(undefined)
  

  useEffect(()=>{
    if(id != undefined){
      const pair = { "action": "getDownload", "downloadId": id }
      ws?.onConnect(pair)
    }else{
      setId(getSearch().downloadId)
    }
    
  },[id])

    return (
      <>
    {ws?.photosToDownload && ws?.photosToDownload.length!= 0 ? 
      <PhotoGallery photos={ws.photosToDownload}/> 
      : 
      <p>Esperando fotos</p>}
      
    </>
    );
  }