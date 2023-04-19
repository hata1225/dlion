import React from "react";
import Peer, { SignalData } from "simple-peer";
import { makeStyles } from "@material-ui/core";
import { CallEnd, Call } from "@material-ui/icons";
import { ButtonWithIcon } from "components/ButtonWithIcon";
import { ENV } from "api/api";
import { createChatRoom } from "api/apiChat";
import { UserContext } from "contexts/UserContext";
import { baseStyle, borderRadius } from "theme";

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
  const [peers, setPeers] = React.useState<PeerObj[]>([]);
  let socket: WebSocket;

  const handleStopVideoCall = async () => {
    // すべてのpeer接続を切断
    peers.forEach((peerData) => {
      peerData.peer.destroy();
    });
    // ユーザービデオとオーディオのストリームを停止
    if (userVideo.current) {
      const stream = userVideo.current.srcObject as MediaStream;
      stream.getTracks().forEach(async (track) => {
        track.stop();
      });
    }
  };

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

        if (payload.type === "all-users") {
          const otherUsers = payload.users;
          const currentUserID = payload.currentUserID;
          otherUsers.forEach((userID: string) => {
            createPeer(userID, currentUserID);
          });
        } else if (payload.type === "user-joined") {
          const peerId = payload.callerID; // 呼び出し元ID
          const currentUserID = payload.currentUserID;
          console.log("----- user-joined -----");
          console.log("userID: ", peerId);
          console.log("currentUserID: ", currentUserID);
          createPeer(peerId, currentUserID, true);
        } else if (payload.type === "offer") {
          const desc = new RTCSessionDescription(payload.sdp);
          const currentUserID = payload.currentUserID;
          const userID = payload.callerID;
          if (desc) {
            const peer = createPeer(userID, currentUserID);
            peer.signal(desc);
          }
        } else if (payload.type === "answer") {
          const peer = peers.find((p) => p.peerID === payload.callerID);
          if (peer) {
            peer.peer.signal(payload.sdp);
          }
        } else if (payload.type === "candidate") {
          const peer = peers.find((p) => p.peerID === payload.callerID);
          if (peer) {
            peer.peer.signal(payload.sdp);
          }
        }
      };

      socket.onclose = () => {
        console.log("WebSocket disconnected");
      };

      return () => {
        // Clean up the WebSocket connection when the component is unmounted
        if (socket) {
          handleStopVideoCall();
          socket.close();
        }
      };
    }
  }, [chatRoomId]);

  const createPeer = (
    peerID: string,
    id: string,
    initiator: boolean = false
  ) => {
    const peer = new Peer({
      initiator: initiator,
      trickle: false,
    });

    peer.on("signal", (data: SignalData) => {
      if (data.type === "offer") {
        socket.send(
          JSON.stringify({
            type: "offer",
            sdp: data,
            callerID: id,
            peerID: peerID,
          })
        );
      } else if (data.type === "answer") {
        socket.send(
          JSON.stringify({
            type: "answer",
            sdp: data,
            callerID: id,
            peerID: peerID,
          })
        );
      } else if (data.type === "candidate") {
        socket.send(
          JSON.stringify({
            type: "candidate",
            sdp: data,
            callerID: id,
            peerID: peerID,
          })
        );
      }
    });

    peer.on("connect", () => {
      console.log("---connect peer---");
      const peerObj: PeerObj = {
        peer,
        peerID,
      };
      setPeers((prev) => [...prev, peerObj]);
    });

    peer.on("stream", (stream: MediaStream) => {
      const peerObj: PeerObj = {
        peer,
        peerID,
        stream,
      };
      setPeers((prev) => [...prev, peerObj]);
    });

    peer.on("close", () => {
      const index = peers.findIndex((p) => p.peerID === peerID);
      if (index !== -1) {
        const newPeers = [...peers];
        newPeers.splice(index, 1);
        setPeers(newPeers);
      }
    });

    return peer;
  };

  return (
    <div className={classes.videoAreaWrap}>
      <div className={classes.videoArea}>
        <VideoContnet userVideo={userVideo} />
        {peers.map((peer, key) => {
          return <VideoContnet key={key} peer={peer} />;
        })}
      </div>
      <div>
        <ButtonWithIcon
          className={classes.callEndButton}
          variant="contained"
          icon={<CallEnd />}
          description="終了する"
          onClick={async () => await handleStopVideoCall()}
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
    } else if (peer && ref.current) {
    }
  }, [peer, ref]);

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
  callEndButton: {
    width: baseStyle.button.width.main,
  },
});
