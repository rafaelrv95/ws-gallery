"use client";

import { useEffect, useState } from 'react';
import { Lightbox } from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Gallery } from 'react-grid-gallery';
export const dynamic = "force-dynamic";
import {useSocket, IContextSocket} from '../contexts/socketContext';

import { IPhoto } from '@/interfaces/globalInterface';



export default function PhotoGallery(props:{photos: string[], enableSelect: boolean, updateSelectedPhotos?: (value: IPhoto[]) => void;}) {
  const ws: IContextSocket | null = useSocket();
  const {photos, enableSelect, updateSelectedPhotos} = props
  const galleryObj= (photos: string[]) => {
    return photos.map(photo => {
      return {
        src: photo,
        isSelected: false,
        //width: undefined,
        //height: undefined
      }
    })
  }

  const [index, setIndex] = useState(-1);
  const handleClick = (index: number) => setIndex(index);
  const [photosObj, setPhotosObj] = useState<IPhoto[]>([]);
  const handleSelect = (index: number) => {
    console.log(index, 'selected')
    const nextPhoto = photosObj.map((photo, i) =>
      i === index ? { ...photo, isSelected: !photo.isSelected } : photo
    );
    setPhotosObj(nextPhoto);
    if(updateSelectedPhotos)updateSelectedPhotos(nextPhoto)
  };

  const slides = photosObj.map(({ src } ) => ({
    src: src,
  }));

  useEffect(()=>{
    if(photos.length ==0)return
    if(photosObj.length == 0){
      setPhotosObj(galleryObj(photos))
    }
    
  },[photos])

  useEffect(()=>{
    if(ws?.newPhoto != "" && ws?.newPhoto){
      setPhotosObj((prev)=>[{src: ws?.newPhoto, isSelected: false}, ...prev])
      ws?.clearNewPhoto()
    }
  },[ws?.newPhoto])

  return (
    <>
      <Gallery
        //@ts-ignore
        images={photosObj}
        onClick={handleClick}
        onSelect={handleSelect}
        enableLightbox = {true}
        enableImageSelection={enableSelect} />
      <Lightbox
        slides={slides}
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
      />
    </>
  );
};
