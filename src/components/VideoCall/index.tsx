import React from "react";
import Peer, { SignalData } from "simple-peer";
import { makeStyles } from "@material-ui/core";
import { CallEnd, Call } from "@material-ui/icons";
import { ButtonWithIcon } from "components/ButtonWithIcon";
import { ENV } from "api/api";
import { createChatRoom } from "api/apiChat";
import { UserContext } from "contexts/UserContext";
import { baseStyle, borderRadius } from "theme";
import VideocamIcon from "@material-ui/icons/Videocam";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";

interface Props {
  userIdsByVideoCall: string[];
}

interface PeerObj {
  peer: Peer.Instance;
  initiator: boolean;
  peerID: string;
  currentUserId: string;
  stream?: MediaStream;
}

export const VideoCall = ({ userIdsByVideoCall }: Props) => {
  const classes = useStyles();
  const { user } = React.useContext(UserContext);
  const [chatRoomId, setChatRoomId] = React.useState("");
  const userVideo = React.useRef<HTMLVideoElement>(null);
  const peersRef = React.useRef<PeerObj[]>([]);
  const [isCameraOn, setIsCameraOn] = React.useState(false); // カメラオンならtrue
  const [isUnMute, setIsUnMute] = React.useState(false); // マイクオンならtrue
  const [streamByMyPeer, setStreamByMyPeer] =
    React.useState<MediaStream | null>(null);
  const [peers, setPeers] = React.useState<PeerObj[]>([]);
  // let socket: WebSocket;
  const [isUpdatingSDP, setIsUpdatingSDP] = React.useState(false);
  const [socket, setSocket] = React.useState<WebSocket | null>(null);

  const handleStopVideoCall = async () => {
    // すべてのpeer接続を切断
    // answerdPeers.forEach((peerObj) => {
    //   peerObj.peer.destroy();
    // });
    // answerdPeers = [];
    // setPeers([]);
  };

  async function getStream({
    video = false,
    audio = false,
  }: {
    video: boolean;
    audio: boolean;
  }) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video,
        audio,
      });
      return stream;
    } catch (error) {
      console.error("Error accessing camera:", error);
      return null;
    }
  }

  const addStreamToPeers = (stream: MediaStream) => {
    peers.forEach((peerObj) => {
      console.log("--peerobj start camera--");
      stream.getTracks().forEach((track) => {
        console.log("peerObj: ", peerObj);
        peerObj.peer.addTrack(track, stream);
      });
    });
  };

  const handleClickCameraButton = async () => {
    const stream = await getStream({ video: true, audio: isUnMute });
    setStreamByMyPeer(stream);
    if (stream && userVideo.current) {
      userVideo.current.srcObject = stream;
      console.log("---camera add stream---");
      console.log("peers ref: ", peersRef.current);
      console.log("data: ", peersRef);

      await addStreamToPeers(stream);

      // let allInitiatorsFalse = true;
      // allInitiatorsFalse = !peersRef.current.some((peerObj) => {
      //   return peerObj.initiator === true;
      // });
      // console.log("allInitiatorsFalse: ", allInitiatorsFalse);
      // if (allInitiatorsFalse) {
      //   socket?.send(
      //     JSON.stringify({
      //       type: "update_sdp",
      //     })
      //   );
      // }
    }
    setIsCameraOn(true);
  };

  const handleClickMicButton = () => {
    // if (isUnMute) {
    //   navigator.mediaDevices
    //     .getUserMedia({
    //       audio: true,
    //     })
    //     .then(removeMedia);
    // } else {
    //   navigator.mediaDevices
    //     .getUserMedia({
    //       audio: true,
    //     })
    //     .then(addMedia);
    // }
    // setIsUnMute((prev) => !prev);
  };

  React.useEffect(() => {
    if (chatRoomId) {
      const newSocket = new WebSocket(
        `ws://${ENV}:8000/ws/webrtc/${chatRoomId}/`
      );
      setSocket(newSocket);
    }
  }, [chatRoomId]);

  React.useEffect(() => {
    console.log("peersrefcurrent: ", peersRef.current);
  }, [peersRef.current]);

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
    // if (socket) {
    //   handleStopVideoCall();
    //   socket.close();
    // }
    // WebSocket connection
    if (socket) {
      socket.onopen = () => {
        console.log("Connected to WebSocke by videocall");
        socket.send(
          JSON.stringify({
            type: "join-room",
          })
        );
      };

      socket.onmessage = async (message) => {
        const payload = JSON.parse(message.data);
        console.log(`\n\n----- onmessage [${payload.type}] -----`);

        if (payload.type === "user-joined") {
          const peerId = payload.callerID; // 呼び出し元ID
          const currentUserID = payload.currentUserID;
          console.log("peerId: ", peerId);
          console.log("currentUserID: ", currentUserID);
          const index = peersRef.current.findIndex(
            (peerObj) => peerObj.peerID === peerId
          );
          console.log("peersref: ", peersRef.current);
          console.log("index: ", index);
          if (index === -1 && peerId !== currentUserID) {
            const peerObj = createPeer(peerId, currentUserID, true); // offerを作成
            peersRef.current = [...peersRef.current, peerObj];
          } else if (index !== -1 && peerId !== currentUserID) {
            const peerObj = createPeer(peerId, currentUserID, true); // offerを作成
            peersRef.current[index] = peerObj;
          }
        } else if (payload.type === "offer") {
          const sdp = new RTCSessionDescription(payload.sdp);
          console.log("sdp: ", sdp);
          const currentUserID = payload.currentUserID;
          const peerId = payload.callerID;
          console.log("peerId: ", peerId);
          console.log("currentUserID: ", currentUserID);
          const index = peersRef.current.findIndex(
            (peerObj) => peerObj.peerID === peerId
          );
          console.log("peersref: ", peersRef.current);
          console.log("index: ", index);
          if (sdp && index === -1 && peerId !== currentUserID) {
            const peerObj = createPeer(peerId, currentUserID); // answer作成
            peerObj.peer.signal(sdp);
            peersRef.current = [...peersRef.current, peerObj];
          } else if (sdp && index !== -1 && peerId !== currentUserID) {
            const peerObj = peersRef.current[index];
            peerObj.peer.signal(sdp);
          }
        } else if (payload.type === "answer") {
          const sdp = new RTCSessionDescription(payload.sdp);
          const currentUserID = payload.currentUserID;
          const peerId = payload.callerID;
          console.log("peerId: ", peerId);
          console.log("currentUserID: ", currentUserID);
          const index = peersRef.current.findIndex(
            (peerObj) => peerObj.peerID === peerId
          );
          console.log("peersref: ", peersRef.current);
          console.log("index: ", index);
          if (sdp && index === -1 && peerId !== currentUserID) {
            const peerObj = createPeer(peerId, currentUserID);
            peerObj.peer.signal(sdp);
            peersRef.current[index] = peerObj;
          } else if (sdp && index !== -1 && peerId !== currentUserID) {
            const peerObj = peersRef.current[index];
            peerObj.peer.signal(sdp);
          }
        }
      };

      socket.onclose = () => {
        handleStopVideoCall();
        console.log("close socket");
        console.log("WebSocket disconnected");
      };

      return () => {
        // Clean up the WebSocket connection when the component is unmounted
        handleStopVideoCall();
        if (socket) {
          socket.close();
        }
      };
    }
  }, [socket, isUpdatingSDP]);

  const createPeer = (
    peerID: string,
    currentUserId: string,
    initiator: boolean = false
  ): PeerObj => {
    const peer = new Peer({
      initiator: initiator,
      trickle: false,
    });

    peer.on("signal", (data: SignalData) => {
      console.log("signal はっかしてるよ！！！");
      console.log("data: ", data);
      if (data.type === "offer") {
        console.log("\n\ncreate peer [ --- offer --- ]");
        console.log("peerId: ", peerID);
        console.log("callerId: ", currentUserId);
        console.log("data: ", data);
        socket?.send(
          JSON.stringify({
            type: "offer",
            sdp: data,
            callerID: currentUserId,
            peerID: peerID,
          })
        );
      } else if (data.type === "answer") {
        console.log("\n\ncreate peer [ --- answer --- ]");
        console.log("peerId: ", peerID);
        console.log("callerId: ", currentUserId);
        console.log("data: ", data);
        socket?.send(
          JSON.stringify({
            type: "answer",
            sdp: data,
            callerID: currentUserId,
            peerID: peerID,
          })
        );
      }
    });

    peer.on("connect", () => {
      console.log("---connect peer---");
      const peerObj: PeerObj = {
        peer,
        initiator,
        peerID,
        currentUserId,
      };
      const index = peersRef.current.findIndex((p) => p.peerID === peerID);
      if (index !== -1) {
        peersRef.current[index] = peerObj;
      } else {
        peersRef.current = [...peersRef.current, peerObj];
      }
      setPeers([...peersRef.current]);
    });

    peer.on("stream", (stream: MediaStream) => {
      console.log("\n\n\n---stream peer---");
      const peerObj: PeerObj = {
        peer,
        initiator,
        peerID,
        currentUserId,
        stream,
      };
      const index = peersRef.current.findIndex((p) => p.peerID === peerID);
      if (index !== -1) {
        peersRef.current[index] = peerObj;
      } else {
        peersRef.current = [...peersRef.current, peerObj];
      }
      setPeers([...peersRef.current]);
    });

    peer.on("track", () => {
      console.log("\n\n\n---track---");
    });

    peer.on("close", () => {
      console.log("---close peer---");
      // const index = peers.findIndex((p) => p.peerID === peerID);
      // if (index !== -1) {
      //   const newPeers = [...peers];
      //   newPeers.splice(index, 1);
      //   setPeers(newPeers);
      // }
    });

    peer.on("error", () => {
      console.log("---error peer---");
    });

    return { peerID, currentUserId, peer, initiator };
  };

  return (
    <div className={classes.videoAreaWrap}>
      <div className={classes.videoArea}>
        <VideoContnet userVideo={userVideo} />
        {peers.map((peer, key) => {
          return <VideoContnet key={key} peer={peer} />;
        })}
      </div>
      <div className={classes.buttonArea}>
        <ButtonWithIcon
          className={classes.callEndButton}
          variant="outlined"
          color="secondary"
          icon={<CallEnd />}
          description="終了する"
          onClick={async () => await handleStopVideoCall()}
          disabled={false}
        />
        <ButtonWithIcon
          className={classes.cameraButton}
          variant={isCameraOn ? "outlined" : "contained"}
          icon={isCameraOn ? <VideocamOffIcon /> : <VideocamIcon />}
          description={`カメラ - ${isCameraOn ? "off" : "on"}`}
          onClick={handleClickCameraButton}
          disabled={false}
        />
        <ButtonWithIcon
          className={classes.micButton}
          variant={isUnMute ? "outlined" : "contained"}
          icon={isUnMute ? <MicOffIcon /> : <MicIcon />}
          description={`マイク - ${isUnMute ? "off" : "on"}`}
          onClick={handleClickMicButton}
          disabled={false}
        />
      </div>
    </div>
  );
};

interface VideoProps {
  peer?: PeerObj;
  userVideo?: React.RefObject<HTMLVideoElement> | null;
}
const VideoContnet = ({ peer, userVideo = null }: VideoProps) => {
  const classes = useStyles();
  let ref = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (peer?.stream && ref.current) {
      ref.current.srcObject = peer.stream;
    }
  }, [peer?.stream, ref]);

  return (
    <div className={classes.videoContentArea}>
      <video
        className={classes.video}
        ref={userVideo ?? ref}
        playsInline
        muted={Boolean(userVideo)}
        autoPlay
      />
    </div>
  );
};

const useStyles = makeStyles({
  videoAreaWrap: {
    width: "100%",
    height: "100%",
    padding: "10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    gap: "30px",
  },
  videoContentArea: {
    width: "50%",
    backgroundColor: baseStyle.color.gray.dark,
    borderRadius: borderRadius.large.main,
  },
  video: {
    width: "100%",
    aspectRatio: "16 / 9",
    objectFit: "cover",
    verticalAlign: "top",
    borderRadius: borderRadius.large.main,
  },
  videoArea: {
    display: "flex",
    width: "100%",
  },
  buttonArea: {
    display: "flex",
    flexDirection: "column",
    gap: baseStyle.gap.main,
  },
  callEndButton: {
    width: baseStyle.button.width.large,
  },
  cameraButton: {
    width: baseStyle.button.width.large,
  },
  micButton: {
    width: baseStyle.button.width.large,
  },
});
