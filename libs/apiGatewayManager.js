import AWS from "./aws-sdk";
import reviewService from "../services/reviews/reviewService";

const CONNECTOR_OPTS = {
  endpoint: process.env.WEBSOCKET_API_ENDPOINT,
};
const apiConnector = new AWS.ApiGatewayManagementApi(CONNECTOR_OPTS);

export const generateSocketMessage = async (connectionId, data) => {
  console.log("CONNECTOR_OPTS", CONNECTOR_OPTS);
  try {
    return await apiConnector
      .postToConnection({
        ConnectionId: connectionId,
        Data: data,
      })
      .promise();
  } catch (error) {
    console.error("Unable to generate socket message", error);
    if (error.statusCode === 410) {
      console.log(`Removing stale connector ${connectionId}`);
      await reviewService.removeSocketConnection(connectionId);
    }
  }
};
