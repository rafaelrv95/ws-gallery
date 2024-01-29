"use client";
import { useEffect, useState } from "react";
import { useSocket, IContextSocket } from '../contexts/socketContext'
import { DialogTitle, Dialog, DialogContent } from "@mui/material";
import { useQRCode } from "next-qrcode";
export interface SimpleDialogProps {
    open: boolean;
    closeDialog: () => void;
}

const getBaseUrl = ()=>{
    if (typeof window !== "undefined") {
      // Client-side-only code
      return window.location.origin
    }
    
  }
export default function ShowQr(props: SimpleDialogProps) {
    const ws: IContextSocket | null = useSocket();

    const { open, closeDialog } = props;
    const { Canvas } = useQRCode();

    return (
        <>
            <Dialog onClose={closeDialog} open={open}>
                <DialogTitle>Scan QR</DialogTitle>
                <DialogContent>
                    {ws?.getDownloadId != "" ?
                        <div>
                            <p>{ws?.getDownloadId}</p>
                            <Canvas
                                text={`${getBaseUrl()}/download?downloadId=${ws?.getDownloadId}`}
                                options={{
                                    errorCorrectionLevel: 'M',
                                    margin: 3,
                                    scale: 4,
                                    width: 200,
                                    color: {
                                        dark: '#000000',
                                        light: '#fafafa',
                                    },
                                }}
                            />
                        </div>
                        :
                        <p>CARGANDO</p>
                    }
                </DialogContent>

            </Dialog>

        </>
    );
}
