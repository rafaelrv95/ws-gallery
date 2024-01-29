"use client";

import { useEffect, useState } from 'react';
import PhotoGallery from '@/components/PhotoGallery';
import {useSocket, IContextSocket} from '../../contexts/socketContext'
import ShowQr from '@/components/ShowQr';
import { IPhoto } from '@/interfaces/globalInterface';
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
  const [selectedPhotos, setSelectedPhotos] =  useState<IPhoto[]>([]);
  const [showDialogQr, setShowDialogQr] = useState<boolean>(false);

  const closeDialog = () =>{
    ws?.clearGetDownloadId()
    setShowDialogQr(false)
  }
  const updateSelectedPhotos = (obj: IPhoto[])=>{
    setSelectedPhotos(obj)
  }

  const createDownload = () =>{
    
    let arr = selectedPhotos.filter(item => item.isSelected).map(item => item.src);
    ws?.createDownload(JSON.stringify({"action": "createDownload", "photos": arr}))
    setShowDialogQr(true)
    console.log(arr)
  }
  

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
    <ShowQr open={showDialogQr} closeDialog={closeDialog}/>
    <button onClick={()=>{createDownload()}}>Download</button>
    {ws?.firstPhotos && ws?.firstPhotos.length!= 0 ? 
      <PhotoGallery photos={ws.firstPhotos} enableSelect={true} updateSelectedPhotos={updateSelectedPhotos}/> 
      : 
      <p>Esperando fotos</p>}
      
    </>
  );
}
