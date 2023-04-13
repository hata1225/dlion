import React from "react";
import Peer from "simple-peer";
import { makeStyles } from "@material-ui/core";
import { ENV } from "api/api";
import { v4 as uuidv4 } from "uuid";
import { UserInterface } from "types/User";
import { createChatRoom } from "api/apiChat";
import { UserContext } from "contexts/UserContext";

interface Props {
  usersByVideoCall: UserInterface[];
}

type Peers = Map<string, Peer.Instance>;

export const VideoCall = ({ usersByVideoCall }: Props) => {
  const classes = useStyles();
  const { user } = React.useContext(UserContext);
  const [chatRoomId, setChatRoomId] = React.useState("");
  const [client, setClient] = React.useState<WebSocket>();
  const [peers, setPeers] = React.useState<Peers>(new Map());
  const userVideo = React.useRef<HTMLVideoElement>(null);
  const partnerVideo = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    const f = async () => {
      const userIds = usersByVideoCall?.map((user) => user.id) ?? [];
      const chatRoom = await createChatRoom(user.token, userIds);
      setChatRoomId(chatRoom.id);
    };
    f();
  }, [usersByVideoCall]);

  React.useEffect(() => {
    if (chatRoomId) {
      const ws = new WebSocket(`ws://${ENV}:8000/ws/webrtc/${chatRoomId}/`);
      ws.onopen = () => {
        console.log("WebSocket Client Connected");
        setClient(ws);
      };
      ws.onmessage = (message) => {
        const data = JSON.parse(message.data);
        handleReceiveSignal(data.message);
      };
      return () => {
        ws.close();
      };
    }
  }, [chatRoomId]);

  React.useEffect(() => {
    if (client) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          if (userVideo.current) {
            userVideo.current.srcObject = stream;
          }

          client.onopen = () => {
            const peer = createPeer(stream);
            addPeer(peer);
          };
        });
    }
  }, [client]);

  const createPeer = (stream: MediaStream) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (signal) => {
      sendSignal(signal);
    });
    peer.on("stream", (stream) => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });
    return peer;
  };

  const handleReceiveSignal = (signal: Peer.SignalData) => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: userVideo.current?.srcObject as MediaStream,
    });
    peer.on("signal", (outgoingSignal) => {
      sendSignal(outgoingSignal);
    });
    peer.on("stream", (stream) => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });
    peer.signal(signal);
    addPeer(peer);
  };

  const sendSignal = (signal: Peer.SignalData) => {
    if (client) {
      client.send(
        JSON.stringify({
          message: signal,
          action: "webrtc_signal",
        })
      );
    }
  };

  const addPeer = (peer: Peer.Instance) => {
    const peerId = uuidv4(); // 一意のIDを生成
    setPeers((prevPeers) => {
      const newPeers = new Map(prevPeers);
      newPeers.set(peerId, peer);
      return newPeers;
    });
  };

  return (
    <div className={classes.videoAreaWrap}>
      <div className={classes.videoArea}>
        <video
          className={classes.video}
          playsInline
          muted
          ref={userVideo}
          autoPlay
        />
      </div>
    </div>
  );
};

const useStyles = makeStyles({
  videoAreaWrap: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width: "100%",
    aspectRatio: "16 / 9",
  },
  videoArea: {
    width: "100%",
  },
});
