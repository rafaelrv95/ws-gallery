"use client";

import { useEffect, useState } from 'react';
import { Lightbox } from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Gallery } from 'react-grid-gallery';
export const dynamic = "force-dynamic";

interface IPhoto{
  src: string;
  isSelected: boolean;
}

export default function PhotoGallery(props:{photos: string[]}) {
  const {photos} = props
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
  const [photosObj, setPhotosObj] = useState<IPhoto[]>(galleryObj(photos));
  const handleSelect = (index: number) => {
    console.log(index, 'selected')
    const nextPhoto = photosObj.map((photo, i) =>
      i === index ? { ...photo, isSelected: !photo.isSelected } : photo
    );
    setPhotosObj(nextPhoto);
  };

  const slides = photosObj.map(({ src } ) => ({
    src: src,
  }));

  return (
    <>
      <Gallery
        //@ts-ignore
        images={photosObj}
        onClick={handleClick}
        onSelect={handleSelect}
        enableLightbox = {true}
        enableImageSelection={true} />
      <Lightbox
        slides={slides}
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
      />
    </>
  );
};
