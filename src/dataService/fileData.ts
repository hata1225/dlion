import { ENV } from "api/api";
import { UserContext } from "contexts/UserContext";
import React from "react";
import { FileData } from "types/fileData";

export const useWSFileData = (fileDataId?: string) => {
  const [fileData, setFileData] = React.useState<FileData>();
  const { user } = React.useContext(UserContext);

  React.useEffect(() => {
    if (fileDataId && user?.token) {
      const ws = new WebSocket(`ws://${ENV}:8000/ws/filedata/${fileDataId}/`);

      ws.onopen = () => {
        console.log("WebSocket connected");
        ws.send(JSON.stringify({ action: "fetch_file_data", token: user.token }));
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Message from server:", data);

        if (data.type === "file_data" || data.type === "file_data_update") {
          setFileData(data.data);
        }
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected");
      };

      return () => {
        ws.close();
      };
    }
  }, [fileDataId, user]);
  return { fileData };
};
