"use client";
import { useEffect, useState } from "react";
import { useSocket, IContextSocket } from '../contexts/socketContext'
import { DialogTitle, Dialog, DialogContent, DialogActions, Button } from "@mui/material";
import { useQRCode } from "next-qrcode";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
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
                        <Box sx={{ display: 'block' }}>
                            <CircularProgress style={{margin: 10, height: 100, width: 100}} />
                        </Box>
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog}>Close</Button>
                </DialogActions>

            </Dialog>

        </>
    );
}
