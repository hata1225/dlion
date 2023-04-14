import React from "react";
import Peer from "simple-peer";
import { Button, makeStyles } from "@material-ui/core";
import { CallEnd, Call } from "@material-ui/icons";
import { ButtonWithIcon } from "components/ButtonWithIcon";
import { ENV } from "api/api";
import { v4 as uuidv4 } from "uuid";
import { createChatRoom } from "api/apiChat";
import { UserContext } from "contexts/UserContext";
import { baseStyle } from "theme";
import { VideoCallModalContext } from "contexts/VideoCallModalContext";

interface Props {
  userIdsByVideoCall: string[];
}

interface PeerData {
  peerID: string;
  peer: Peer.Instance;
}

export const VideoCall = ({ userIdsByVideoCall }: Props) => {
  const classes = useStyles();
  const { user } = React.useContext(UserContext);
  const { handleCloseVideoCallModal } = React.useContext(VideoCallModalContext);
  const [chatRoomId, setChatRoomId] = React.useState("");
  const [peers, setPeers] = React.useState<Peer.Instance[]>([]);
  const [localStream, setLocalStream] = React.useState<MediaStream | null>(
    null
  );
  const userVideo = React.useRef<HTMLVideoElement>(null);
  const peersRef = React.useRef<PeerData[]>([]);
  // const partnerVideo = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    const f = async () => {
      if (userIdsByVideoCall.length >= 2) {
        const chatRoom = await createChatRoom(user.token, userIdsByVideoCall);
        setChatRoomId(chatRoom.id);
      }
    };
    f();
  }, [userIdsByVideoCall]);

  React.useEffect(() => {
    if (chatRoomId) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          if (userVideo.current) {
            userVideo.current.srcObject = stream;
          }
          const ws = new WebSocket(
            `ws://localhost:8000/ws/webrtc/${chatRoomId}/`
          );
          ws.onopen = () => {
            console.log("Connected to Websocket server");
          };
          ws.onmessage = (message) => {
            const data = JSON.parse(message.data);
            const signal = data.message;
            const { signal: receivedSignal, callerID } = signal;

            if (receivedSignal) {
              const peer = addPeer(receivedSignal, callerID, stream);
              peersRef.current.push({
                peerID: callerID,
                peer,
              });
              setPeers((peers) => [...peers, peer]);
            } else {
              const item = peersRef.current.find((p) => p.peerID === callerID);
              if (item) {
                item.peer.signal(signal);
              }
            }
          };

          ws.onclose = () => {
            console.log("Disconnected from Websocket server");
          };

          const addPeer = (
            incomingSignal: Peer.SignalData,
            callerID: string,
            stream: MediaStream
          ) => {
            const peer = new Peer({
              initiator: false,
              trickle: false,
              stream,
            });

            peer.on("signal", (signal) => {
              ws.send(
                JSON.stringify({
                  message: { signal, callerID: user.id },
                  action: "webrtc_signal",
                })
              );
            });

            peer.signal(incomingSignal);

            return peer;
          };
        });
    }
  }, [chatRoomId]);

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
        {peers?.map((peer, key) => {
          return <VideoContnet key={key} peer={peer} />;
        })}
      </div>
      <div>
        <ButtonWithIcon
          className={classes.callEndButton}
          variant="contained"
          icon={<CallEnd />}
          description="終了する"
          // onClick={endCall}
        />
      </div>
    </div>
  );
};

interface VideoProps {
  peer: Peer.Instance;
}
const VideoContnet = ({ peer }: VideoProps) => {
  const ref = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    peer.on("stream", (stream) => {
      if (ref.current) {
        ref.current.srcObject = stream;
      }
    });
  }, []);

  return <video ref={ref} autoPlay />;
};

const useStyles = makeStyles({
  videoAreaWrap: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    gap: "30px",
  },
  video: {
    width: "50%",
    aspectRatio: "16 / 9",
  },
  videoArea: {
    display: "flex",
    width: "100%",
  },
  callEndButton: {
    width: baseStyle.button.width.main,
  },
});
