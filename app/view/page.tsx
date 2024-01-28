"use client";

import { useEffect, useState } from 'react';
import WebSocketConnection from "@/websocket/websocket";
import PhotoGallery from '@/components/PhotoGallery';
import { useParams } from 'next/navigation';
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
    

  const [firstPhotos, setFirstPhotos] = useState<string[]>([]);
  const [id, setId] = useState(undefined)
  //const pair = { "action": "pair", "viewId": getSearch().viewId }

  useEffect(() => {
    if(id != undefined){
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
      WebSocketConnection.connect(webSocketUrl, { "action": "pair", "viewId": id });
      WebSocketConnection.addMessageListener(onMessageReceived);
      return () => {
        WebSocketConnection.removeMessageListener(onMessageReceived);
      };
    }else{
      setId(getSearch().viewId)
    }
    
  }, [id]);


  return (
    <>
    {firstPhotos.length!= 0 ? 
      <PhotoGallery photos={firstPhotos}/> 
      : 
      <p>Esperando fotos</p>}
      
    </>
  );
}
