import {
    createContext,
    useEffect,
    useState,
    useContext,
} from "react";
import { getSearch } from "@/utils/queryParams";

export interface IContextSocket {
    socket: any;
    onConnect: (pair: any) => void;
    destroy: () => void;
    firstPhotos: string[];
    newPhoto: string;
    clearNewPhoto: () => void;
    photosToDownload: string[];
    createDownload: (arg: {}) => void;
    getDownloadId: string;
    clearGetDownloadId: () => void;

}

const SocketIoContext = createContext<IContextSocket | null>(null);

export function useSocket() {
    return useContext(SocketIoContext);
}

export default function ContextSocket(props: any) {

    const [socket, setSocket] = useState<any | null>(null);
    const [firstPhotos, setFirstPhotos] = useState<string[]>([]);
    const [photosToDownload, setPhotosToDownload] = useState<string[]>([]);
    const [newPhoto, setNewPhoto] = useState<string>("");
    const [pair, setPair] = useState({})
    const [isOpen, setIsOpen] = useState<boolean | null>(null);
    const [getDownloadId, setGetDownloadId] = useState<string>("");

    const handleempty = () =>{
        return firstPhotos.length
    }

    const connect = () => {
        setSocket(null);
        let newSocket = new WebSocket("wss://4dhzwstr2b.execute-api.us-east-1.amazonaws.com/dev/")
        setSocket(newSocket)
        setIsOpen(null)
    }

    useEffect(() => {
        connect()
        return () => {
            socket?.close();
            setSocket(null);
            setIsOpen(null)
        };
    }, []);

    useEffect(() => {
       let pingpong: any;
        if (socket && pair) {
            socket.onopen = () => {
                setIsOpen(true)
                onConnect(pair)
                socket.send(JSON.stringify(pair));
                //console.log("pair")
            }
            socket.onclose = (event: any) => {
                console.log('Disconnected from WebSocket server');
                setTimeout(() => {
                    setIsOpen(false)
                }, 2000);
            };
            socket.onmessage = (event: any) => {
                let tmp = JSON.parse(event.data)
                if (tmp.action === "firstPhotos") setFirstPhotos(tmp.photos)
                //if (tmp.action === "newPhoto" ) setNewPhoto(tmp.photoUrl)
                if (tmp.action === "newPhoto" && firstPhotos .length == 0) {
                    setFirstPhotos((prev) => [...prev, tmp.photoUrl])
                }
                if (tmp.action === "newPhoto" && firstPhotos .length > 0) {
                    setNewPhoto(tmp.photoUrl)
                }
                if(tmp.action === "photosToDownload")setPhotosToDownload(tmp.photos)
                if(tmp.action === "showQr")setGetDownloadId(tmp.downloadId)
                console.log('ReceivedXX:', event.data);

            };
            pingpong = setInterval(() => {
                console.log("send ping")
                socket.send(JSON.stringify({"action": "ping", "viewId": getSearch().viewId}));
            }, 10000);

        }
        return () => clearInterval(pingpong)
    }, [socket, pair, firstPhotos]);

    useEffect(()=>{
        if(isOpen != null && isOpen == false){
            connect()
        }
    }, [isOpen])

    function onConnect(pair: {}) {
        setPair(pair)
        
    }

    function destroy() {
        socket?.close();
        setSocket(null);
    }

    function createDownload(download: {}){
        if(socket){
            socket.send(download)
        }
    }

    const clearNewPhoto =()=>{setNewPhoto("")}
    const clearGetDownloadId =()=>{setGetDownloadId("")}


    return (
        <SocketIoContext.Provider
            value={{
                socket,
                onConnect,
                destroy,
                firstPhotos,
                newPhoto,
                clearNewPhoto,
                photosToDownload,
                createDownload,
                getDownloadId,
                clearGetDownloadId

            }}
        >
            {props.children}
        </SocketIoContext.Provider>
    );
}