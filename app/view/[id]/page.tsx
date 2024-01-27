"use client";

import { useEffect, useState } from 'react';
import WebSocketConnection from "@/websocket/websocket";
import PhotoGallery from '@/components/PhotoGallery';
import { useParams } from 'next/navigation';
export const dynamic = "force-dynamic";

const getSearch = (name: any)=>{
  if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
     return decodeURIComponent(name[1]);
}

export default function View() {
    const params = useParams<{id: string}>()

  const [firstPhotos, setFirstPhotos] = useState<string[]>([]);
  const pair = { "action": "pair", "viewId": params.id }

  useEffect(() => {
    const onMessageReceived = (message: string) => {
      let arrPhotos = JSON.parse(message)
      if(arrPhotos.action === "firstPhotos")setFirstPhotos(arrPhotos.photos)
      if(arrPhotos.action === "newPhoto"){
        let tmp = firstPhotos
        tmp.push(arrPhotos.photo)
        setFirstPhotos(tmp)
      }
    };
    const webSocketUrl = 'wss://4dhzwstr2b.execute-api.us-east-1.amazonaws.com/dev/';
    //const webSocketUrl = "wss://socketsbay.com/wss/v2/1/demo/"
    WebSocketConnection.connect(webSocketUrl, pair);
    WebSocketConnection.addMessageListener(onMessageReceived);
    return () => {
      WebSocketConnection.removeMessageListener(onMessageReceived);
    };
    
  }, []);


  return (
    <>
    {firstPhotos.length!= 0 ? 
      <PhotoGallery photos={firstPhotos}/> 
      : 
      <p>Esperando fotos</p>}
      
    </>
  );
}
