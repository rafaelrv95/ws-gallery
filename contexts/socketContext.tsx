import {
    createContext,
    useEffect,
    useState,
    useContext,
} from "react";

export interface IContextSocket {
    socket: any;
    onConnect: (pair: any) => void;
    destroy: () => void;
    firstPhotos: string[];
}

const SocketIoContext = createContext<IContextSocket | null>(null);

export function useSocket() {
    return useContext(SocketIoContext);
}

export default function ContextSocket(props: any) {

    const [socket, setSocket] = useState<any | null>(null);
    const [firstPhotos, setFirstPhotos] = useState<string[]>([]);
    const [pair, setPair] = useState({})

    const connect = () => {
        setSocket(null);
        let newSocket = new WebSocket("wss://4dhzwstr2b.execute-api.us-east-1.amazonaws.com/dev/")
        setSocket(newSocket)
    }

    useEffect(() => {
        connect()
        return () => {
            socket?.close();
            setSocket(null);
        };
    }, []);

    useEffect(() => {
        if (socket) {
            socket.onclose = (event: any) => {
                console.log('Disconnected from WebSocket server');
                setTimeout(() => {
                    connect()
                    onConnect(pair)
                }, 2000);
            };
            socket.onmessage = (event: any) => {
                let tmp = JSON.parse(event.data)
                if (tmp.action === "firstPhotos") setFirstPhotos(tmp.photos)
                if (tmp.action === "newPhoto") {
                    setFirstPhotos((prev) => [...prev, tmp.photoUrl])
                }

                console.log('ReceivedXX:', event.data);

            };
        }
    }, [socket, pair]);

    function onConnect(pair: {}) {
        setPair(pair)
        if(socket){
            socket.onopen = () => {
                socket.send(JSON.stringify(pair));
            };
        }
        

    }

    function destroy() {
        socket?.close();
        setSocket(null);
    }

    return (
        <SocketIoContext.Provider
            value={{
                socket,
                onConnect,
                destroy,
                firstPhotos
            }}
        >
            {props.children}
        </SocketIoContext.Provider>
    );
}