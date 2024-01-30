"use client";

import { useEffect, useState } from 'react';
import PhotoGallery from '@/components/PhotoGallery';
import { useSocket, IContextSocket } from '../../contexts/socketContext'
import ShowQr from '@/components/ShowQr';
import { IPhoto } from '@/interfaces/globalInterface';
export const dynamic = "force-dynamic";
import { getSearch } from '@/utils/queryParams';
import { Fab } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

export default function View() {

  const ws: IContextSocket | null = useSocket();
  const [id, setId] = useState(undefined)
  const [selectedPhotos, setSelectedPhotos] = useState<IPhoto[]>([]);
  const [showDialogQr, setShowDialogQr] = useState<boolean>(false);
  const [isClosed, setIsClosed] = useState<boolean>(false);

  const closeDialog = () => {
    ws?.clearGetDownloadId()
    setIsClosed(true)
    setShowDialogQr(false)
    setSelectedPhotos((prev: any)=>[...prev].map(p => ({ ...p, isSelected: false })))
  }
  const updateSelectedPhotos = (obj: IPhoto[]) => {
    setSelectedPhotos(obj)
  }

  const createDownload = () => {

    let arr = selectedPhotos.filter(item => item.isSelected).map(item => item.src);
    ws?.createDownload(JSON.stringify({ "action": "createDownload", "photos": arr }))
    setShowDialogQr(true)
    //console.log(arr)
  }


  useEffect(() => {
    if (id != undefined) {
      const pair = { "action": "pair", "viewId": id }
      ws?.onConnect(pair)
    } else {
      setId(getSearch().viewId)
    }

  }, [id])

  const countSelected = () => {
    return selectedPhotos.reduce((count, obj: IPhoto) => {
      return count + (obj.isSelected ? 1 : 0);
    }, 0);
  }


  return (
    <>
      {countSelected() != 0? 
      <Fab onClick={() => { createDownload() }} style={{ position: "fixed", bottom: 0, right: 0, margin:10}} color="primary" aria-label="add">
          <DownloadIcon />
        </Fab>
        :
        <div></div>}
      <ShowQr open={showDialogQr} closeDialog={closeDialog} />
      {ws?.firstPhotos && ws?.firstPhotos.length != 0 ?
        <PhotoGallery photos={ws.firstPhotos} enableSelect={true} updateSelectedPhotos={updateSelectedPhotos} isClosed={isClosed} setIsClosed={setIsClosed}/>
        :
        <Stack sx={{ width: '100%' }} spacing={2}>
            <Alert severity="info">Waiting for photos</Alert>
        </Stack>
        }

    </>
  );
}
