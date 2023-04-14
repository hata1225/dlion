import { makeStyles } from "@material-ui/core";
import { ChatRoomListArea } from "components/Chat/ChatRoomListArea";
import { ChatArea } from "components/Chat/ChatArea";
import { useParams } from "react-router-dom";
import { Layout } from "components/Layout";

export const ChatPage = () => {
  const { id } = useParams(); // ChatRoomのid
  const classes = useStyles();

  return (
    <Layout>
      <div className={classes.chatPage}>
        {id ? <ChatArea chatRoomId={id} /> : <ChatRoomListArea />}
      </div>
    </Layout>
  );
};

const useStyles = makeStyles({
  chatPage: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
});
