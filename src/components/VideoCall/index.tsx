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
  stream: MediaStream | null;
  tracks: MediaStreamTrack[];
}

export const VideoCall = ({ userIdsByVideoCall }: Props) => {
  const classes = useStyles();
  const { user } = React.useContext(UserContext);
  const [chatRoomId, setChatRoomId] = React.useState("");
  const userVideo = React.useRef<HTMLVideoElement>(null);
  const peersRef = React.useRef<PeerObj[]>([]);
  const [isCameraOn, setIsCameraOn] = React.useState(false); // カメラオンならtrue
  const [isMicOn, setIsMicOn] = React.useState(false); // マイクオンならtrue
  const [streamButton, setStreamButton] = React.useState(false);
  const [peers, setPeers] = React.useState<PeerObj[]>([]);
  const [socket, setSocket] = React.useState<WebSocket | null>(null);

  const handleStopVideoCall = async () => {
    // すべてのpeer接続を切断
    peers.forEach((peerObj) => {
      peerObj.peer.destroy();
    });
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

  const handleClickCameraButton = async () => {
    setIsCameraOn((prev) => !prev);
  };

  const handleClickMicButton = () => {
    setIsMicOn((prev) => !prev);
  };

  const addStreamToPeers = async (stream: MediaStream) => {
    const newPeers = [...peers];
    await newPeers.forEach(async (peerObj) => {
      await stream.getTracks().forEach(async (track) => {
        await peerObj.peer.addTrack(track, stream);
        peerObj.tracks.push(track);
      });
    });
    setPeers(newPeers);
  };

  const removeStreamFromPeers = async () => {
    const newPeers = [...peers];
    await newPeers.forEach(async (peerObj) => {
      const stream = userVideo.current?.srcObject as MediaStream;
      await stream.getTracks().forEach(async (track) => {
        await track.stop();
        await peerObj.peer.removeTrack(track, stream);
      });
      peerObj.tracks = [];
      if (userVideo.current) {
        userVideo.current.srcObject = null;
      }
      socket?.send(
        JSON.stringify({
          type: "stopStream",
          callerID: peerObj.currentUserId,
        })
      );
    });

    setPeers(newPeers);
  };

  React.useEffect(() => {
    console.log("peers: ", peers);
  }, [peers]);

  React.useEffect(() => {
    const f = async () => {
      setStreamButton(true);
      if (isCameraOn || isMicOn) {
        const stream = await getStream({ video: isCameraOn, audio: isMicOn });
        if (stream && userVideo.current) {
          userVideo.current.srcObject = stream;
          await addStreamToPeers(stream);
        }
      } else {
        await removeStreamFromPeers();
      }
      setStreamButton(false);
    };
    f();
  }, [isCameraOn, isMicOn]);

  React.useEffect(() => {
    if (chatRoomId) {
      const newSocket = new WebSocket(
        `ws://${ENV}:8000/ws/webrtc/${chatRoomId}/`
      );
      setSocket(newSocket);
    }
  }, [chatRoomId]);

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
        const currentUserID = payload.currentUserID;
        const peerId = payload.callerID;
        console.log("currentUserId: ", currentUserID);
        console.log("peerId: ", peerId);
        const index = peersRef.current.findIndex(
          (peerObj) => peerObj.peerID === peerId
        );

        if (payload.type === "user-joined") {
          if (index === -1 && peerId !== currentUserID) {
            const peerObj = createPeer(peerId, currentUserID, true); // offerを作成
            peersRef.current = [...peersRef.current, peerObj];
          }
        } else if (payload.type === "offer") {
          const sdp = new RTCSessionDescription(payload.sdp);
          if (sdp && index === -1 && peerId !== currentUserID) {
            const peerObj = createPeer(peerId, currentUserID); // answer作成
            peerObj.peer.signal(sdp);
            peersRef.current = [...peersRef.current, peerObj];
          } else if (sdp && index !== -1 && peerId !== currentUserID) {
            const peerObj = peersRef.current[index];
            peerObj.peer.signal(sdp);
            setPeers(peersRef.current);
          }
        } else if (payload.type === "answer") {
          const sdp = new RTCSessionDescription(payload.sdp);
          if (sdp && index === -1 && peerId !== currentUserID) {
            const peerObj = createPeer(peerId, currentUserID);
            peerObj.peer.signal(sdp);
            peersRef.current[index] = peerObj;
          } else if (sdp && index !== -1 && peerId !== currentUserID) {
            const peerObj = peersRef.current[index];
            peerObj.peer.signal(sdp);
            setPeers(peersRef.current);
          }
        } else if (
          payload.type === "renegotiate" ||
          payload.type === "transceiverRequest"
        ) {
          if (payload.data && index !== -1 && peerId !== currentUserID) {
            const peerObj = peersRef.current[index];
            peerObj.peer.signal(payload.data);
            setPeers(peersRef.current);
          }
        } else if (payload.type === "stopStream") {
          console.log("index: ", index);
          if (index !== -1) {
            const peerObj = peersRef.current[index];
            peerObj.stream = null;
            setPeers(peersRef.current);
          }
        }
      };

      socket.onclose = () => {
        handleStopVideoCall();
        console.log("WebSocket disconnected");
      };

      return () => {
        handleStopVideoCall();
        if (socket) {
          socket.close();
        }
      };
    }
  }, [socket]);

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
      console.log(`\n\nsignal peer [ --- ${data.type} --- ]`);
      console.log("peerId: ", peerID);
      console.log("callerId: ", currentUserId);
      console.log("data: ", data);
      if (data.type === "offer") {
        socket?.send(
          JSON.stringify({
            type: "offer",
            sdp: data,
            callerID: currentUserId,
            peerID: peerID,
          })
        );
      } else if (data.type === "answer") {
        socket?.send(
          JSON.stringify({
            type: "answer",
            sdp: data,
            callerID: currentUserId,
            peerID: peerID,
          })
        );
      } else if (data.type === "renegotiate") {
        socket?.send(
          JSON.stringify({
            type: "renegotiate",
            data: data,
            callerID: currentUserId,
            peerID: peerID,
          })
        );
      } else if (data.type === "transceiverRequest") {
        socket?.send(
          JSON.stringify({
            type: "renegotiate",
            data: data,
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
        stream: null,
        tracks: [],
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
      console.log("---stream peer---");
      const peerObj: PeerObj = {
        peer,
        initiator,
        peerID,
        currentUserId,
        stream,
        tracks: [],
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
      console.log("---track peer---");
    });

    peer.on("close", () => {
      console.log("---close peer---");
    });

    peer.on("error", () => {
      console.log("---error peer---");
    });

    return { peerID, currentUserId, peer, initiator, stream: null, tracks: [] };
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
          disabled={streamButton}
        />
        <ButtonWithIcon
          className={classes.cameraButton}
          variant={isCameraOn ? "outlined" : "contained"}
          icon={isCameraOn ? <VideocamOffIcon /> : <VideocamIcon />}
          description={`カメラ - ${isCameraOn ? "off" : "on"}`}
          onClick={handleClickCameraButton}
          disabled={streamButton}
        />
        <ButtonWithIcon
          className={classes.micButton}
          variant={isMicOn ? "outlined" : "contained"}
          icon={isMicOn ? <MicOffIcon /> : <MicIcon />}
          description={`マイク - ${isMicOn ? "off" : "on"}`}
          onClick={handleClickMicButton}
          disabled={streamButton}
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
    if (peer && ref.current) {
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
