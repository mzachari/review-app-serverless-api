import { success, failure } from "../../libs/response-lib";
import reviewService from "./reviewService";
import { generateSocketMessage } from "../../libs/apiGatewayManager";

export async function getProductReviews(event, context) {
  const productId = event.pathParameters.productId;

  try {
    const data = await reviewService.getProductReviews(productId);
    return success(data);
  } catch (error) {
    console.log("Failed to fetch product reviews: ", error);
    return failure("Internal Server Error");
  }
}

export async function addProductReview(event, context) {
  const productId = event.pathParameters.productId;
  const { rating, reviewText } = JSON.parse(event.body);
  try {
    const data = await reviewService.addProductReview(
      productId,
      rating,
      reviewText
    );
    return success(data);
  } catch (error) {
    console.log("Failed to fetch product reviews: ", error);
    return failure("Internal Server Error");
  }
}

export async function handleSocketConnect(event, context) {
  try {
    const connectionId = event.requestContext.connectionId;
    await reviewService.addSocketConnection(connectionId);
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*",
      },
      body: "Socket successfully registered.",
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*",
      },
      body: "Unable to register socket.",
    };
  }
}

export async function handleSocketDisconnect(event, context) {
  try {
    const connectionId = event.requestContext.connectionId;
    await reviewService.removeSocketConnection(connectionId);
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*",
      },
      body: "Socket successfully terminated.",
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*",
      },
      body: "Unable to terminate socket.",
    };
  }
}

export async function defaultSocketHandler(event, context) {
  try {
    const data = JSON.parse(event.body);
    const allConnections = await reviewService.getAllConnections();
    console.log("allConnections", allConnections);

    for (const connection of allConnections) {
      await generateSocketMessage(
        connection.connectionId,
        JSON.stringify(data)
      );
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*",
      },
      body: "Default socket response.",
    };
  } catch (err) {
    console.error("Unable to generate default response", err);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*",
      },
      body: "Default socket response error.",
    };
  }
}
