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
  peerID: string;
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
  const [peers, setPeers] = React.useState<PeerObj[]>([]);
  let socket: WebSocket;

  const handleStopVideoCall = async () => {
    // すべてのpeer接続を切断
    // answerdPeers.forEach((peerObj) => {
    //   peerObj.peer.destroy();
    // });
    // answerdPeers = [];
    // setPeers([]);
  };

  async function getCameraStream() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      return stream;
    } catch (error) {
      console.error("Error accessing camera:", error);
      return null;
    }
  }

  const handleClickCameraButton = async () => {
    const cameraStream = await getCameraStream();
    if (cameraStream && userVideo.current) {
      userVideo.current.srcObject = cameraStream;
      console.log("---camera add stream---");
      console.log("peers ref: ", peersRef.current);
      console.log("data: ", peersRef);

      const addStreamToPeers = () => {
        peers.forEach((peerObj) => {
          console.log("--peerobj start camera--");
          cameraStream.getTracks().forEach((track) => {
            console.log("peerObj: ", peerObj);
            peerObj.peer.addTrack(track, cameraStream);
          });
        });
      };
      await addStreamToPeers();
      peersRef.current = [...peers];
      // setPeers([...peersRef.current]);
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

  // const removeMedia = (stream: MediaStream) => {
  //   peers?.forEach((peerObj) => {
  //     peerObj.peer.removeStream(stream);
  //   });
  //   if (userVideo.current) {
  //     userVideo.current.srcObject = stream;
  //   }
  // };

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
    if (socket) {
      handleStopVideoCall();
      socket.close();
    }
    // WebSocket connection
    if (chatRoomId) {
      socket = new WebSocket(`ws://${ENV}:8000/ws/webrtc/${chatRoomId}/`);
      socket.onopen = () => {
        console.log("Connected to WebSocke by videocall");
        socket.send(
          JSON.stringify({
            type: "join-room",
          })
        );
      };

      socket.onmessage = (message) => {
        const payload = JSON.parse(message.data);

        if (payload.type === "user-joined") {
          const peerId = payload.callerID; // 呼び出し元ID
          const currentUserID = payload.currentUserID;
          console.log("\n\n----- onmessage [user-joined] -----");
          console.log("peerId: ", peerId);
          console.log("currentUserID: ", currentUserID);
          if (peerId !== currentUserID) {
            // 自分自身が入室した場合以外にofferを作成
            const peer = createPeer(peerId, currentUserID, true);
            // const isExistPeerByAnswerPeers = answerdPeers.some(
            //   (peer) => peer.peerID === peerId
            // );
            // if (!isExistPeerByAnswerPeers) {
            //   answerdPeers.push(peer);
            // }
            const newPeers = [...peersRef.current];
            const index = newPeers.findIndex(
              (peerObj) => peerObj.peerID === peerId
            );
            if (index !== -1) {
              newPeers[index] = peer;
              peersRef.current = newPeers;
              // setPeers(newPeers);
            } else {
              // setPeers((prev) => [...prev, peer]);
              peersRef.current = [...peersRef.current, peer];
            }
          }
        } else if (payload.type === "offer") {
          console.log("\n\n----- onmessage [offer] -----");
          const desc = new RTCSessionDescription(payload.sdp);
          console.log("sdp: ", desc);
          const currentUserID = payload.currentUserID;
          const peerId = payload.callerID;
          console.log("peerId: ", peerId);
          console.log("currentUserID: ", currentUserID);
          const isExistPeer = peersRef.current.some(
            (peerObj) => peerObj.peerID === peerId
          );
          console.log("peers ref: ", peersRef.current);
          console.log("isExistPeer: ", isExistPeer);
          const newPeers = [...peersRef.current];
          const index = newPeers.findIndex(
            (peerObj) => peerObj.peerID === peerId
          );
          if (index !== -1) {
            // 存在してたらsdpを更新する
            // const newPeers = [...peers];
            // newPeers[index] = createPeer(peerId, currentUserID);
            newPeers[index].peer.signal(desc);
            peersRef.current = newPeers;
            // setPeers(newPeers);
          } else if (desc && peerId !== currentUserID) {
            console.log("onmessage offer process");
            // 自分自身からofferを受けて、自分自身にanswerを送ることはない
            const peerObj = createPeer(peerId, currentUserID);
            peerObj.peer.signal(desc);
            const newPeers = [...peersRef.current, peerObj];
            peersRef.current = newPeers;
            // setPeers(newPeers);
          }
        } else if (payload.type === "answer") {
          console.log("\n\n----- onmessage [answer] -----");
          const desc = new RTCSessionDescription(payload.sdp);
          console.log("sdp: ", desc);
          const currentUserID = payload.currentUserID;
          const peerId = payload.callerID;
          console.log("peerId: ", peerId);
          console.log("currentUserID: ", currentUserID);
          // console.log("answerdPeers", answerdPeers);
          const newPeers = [...peersRef.current];
          const index = newPeers.findIndex(
            (peerObj) => peerObj.peerID === peerId
          );
          if (index !== -1) {
            console.log("--- update answer ---");
            // 存在してたらsdpを更新する
            newPeers[index].peer.signal(desc);
            peersRef.current = newPeers;
            // setPeers(newPeers);
          } else if (desc && peerId !== currentUserID) {
            console.log("onmessage answer process");
            const peerObj = createPeer(peerId, currentUserID);
            peerObj.peer.signal(desc);
            const newPeers = [...peersRef.current, peerObj];
            peersRef.current = newPeers;
            // setPeers(newPeers);
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
  }, [chatRoomId]);

  const createPeer = (
    peerID: string,
    id: string,
    initiator: boolean = false
  ): PeerObj => {
    const peer = new Peer({
      initiator: initiator,
      trickle: false,
    });

    peer.on("signal", (data: SignalData) => {
      if (data.type === "offer") {
        console.log("\n\ncreate peer [ --- offer --- ]");
        console.log("peerId: ", peerID);
        console.log("callerId: ", id);
        console.log("data: ", data);
        socket.send(
          JSON.stringify({
            type: "offer",
            sdp: data,
            callerID: id,
            peerID: peerID,
          })
        );
      } else if (data.type === "answer") {
        console.log("\n\ncreate peer [ --- answer --- ]");
        console.log("peerId: ", peerID);
        console.log("callerId: ", id);
        console.log("data: ", data);
        socket.send(
          JSON.stringify({
            type: "answer",
            sdp: data,
            callerID: id,
            peerID: peerID,
          })
        );
      } else if (data.type === "candidate") {
        console.log("candidate");
      }
    });

    peer.on("connect", () => {
      console.log("---connect peer---");
      const peerObj: PeerObj = {
        peer,
        peerID,
      };
      // setPeers((prevPeers) => {
      // console.log("peers: ", peers);
      console.log("peers ref: ", peersRef.current);
      const index = peersRef.current.findIndex((p) => p.peerID === peerID);
      if (index !== -1) {
        const newPeers = [...peersRef.current];
        newPeers[index] = peerObj;
        peersRef.current = newPeers;
      } else {
        peersRef.current = [...peersRef.current, peerObj];
      }
      // });
      setPeers([...peersRef.current]);
    });

    peer.on("stream", (stream: MediaStream) => {
      console.log("\n\n\n---stream peer---");
      const peerObj: PeerObj = {
        peer,
        peerID,
        stream,
      };
      // setPeers((prevPeers) => {
      const index = peersRef.current.findIndex((p) => p.peerID === peerID);
      if (index !== -1) {
        const newPeers = [...peersRef.current];
        newPeers[index] = peerObj;
        peersRef.current = newPeers;
      } else {
        peersRef.current = [...peersRef.current, peerObj];
      }
      // });
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

    return { peerID, peer };
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
    console.log("videocontent peer: ", peer);
  }, [peer]);

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
