"use client";

import { useEffect, useState } from 'react';
import { Lightbox } from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Gallery } from 'react-grid-gallery';
export const dynamic = "force-dynamic";
import { useSocket, IContextSocket } from '../contexts/socketContext';

import { IPhoto } from '@/interfaces/globalInterface';
import { getSearch } from '@/utils/queryParams';

interface IPhotoGallery{
  photos: string[]; 
  enableSelect: boolean; 
  updateSelectedPhotos?: (value: IPhoto[]) => void;
  isClosed?: boolean;
  setIsClosed?: (args: any) => void;
}

const loadImage = (src: string) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

export default function PhotoGallery(props: IPhotoGallery) {
  const ws: IContextSocket | null = useSocket();
  const { photos, enableSelect, updateSelectedPhotos, isClosed, setIsClosed } = props
  const galleryObj = async (photos: string[]) => {
    let results: any = []
    await Promise.all(photos.map(loadImage)).then(images => {
      
      images.forEach((image: any, i) =>{
        
        results.push({
          src: image.src,
          isSelected: false,
          width: image.width,
          height: image.height
        })
      });
    });
    console.log(results)
    return results
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
    if (updateSelectedPhotos) updateSelectedPhotos(nextPhoto)
  };

  const slides = photosObj.map(({ src }) => ({
    src: src,
  }));

  useEffect(() => {
    const tmp = async (photos: any) =>{
      let tmp = await galleryObj(photos)
      setPhotosObj(tmp)
    }
    if (photos.length == 0) return
    if (photosObj.length == 0) {
      tmp(photos)  
    }

  }, [photos])

  useEffect(() => {
    const getDimensions =async (src:string) => {
      let tmp: any = await loadImage(src)
      setPhotosObj((prev) => [{ src: tmp.src, isSelected: false, width: tmp.width, height: tmp.height }, ...prev])
    }
    if (ws?.newPhoto != "" && ws?.newPhoto) {
      getDimensions(ws.newPhoto)
      ws?.clearNewPhoto()
    }
  }, [ws?.newPhoto])

  useEffect(()=>{
    if(isClosed && setIsClosed){
      setPhotosObj((prev: any)=>[...prev].map(p => ({ ...p, isSelected: 0 })))
      setIsClosed(false)
    }
    
  },[isClosed])

  return (
    <>
      <Gallery
        //@ts-ignore
        images={photosObj}
        onClick={handleClick}
        onSelect={handleSelect}
        enableLightbox={false}
        enableImageSelection={enableSelect} />
      {!getSearch().hasOwnProperty("downloadId") ?
        <Lightbox
          slides={slides}
          open={index >= 0}
          index={index}
          close={() => setIndex(-1)}
        /> : <div></div>}
    </>
  );
};
