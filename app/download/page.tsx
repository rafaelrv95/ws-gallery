"use client";
import { useEffect, useState } from 'react';
import {useSocket, IContextSocket} from '../../contexts/socketContext';
import PhotoGallery from '@/components/PhotoGallery';
import { getSearch } from '@/utils/queryParams';

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
      <PhotoGallery photos={ws.photosToDownload} enableSelect = {false}/> 
      : 
      <p>Esperando fotos</p>}
      
    </>
    );
  }