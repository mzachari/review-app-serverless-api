export function success(body) {
    console.log("RESPONSE", buildResponse(200, body,"success"));
    return buildResponse(200, body,"success");
}
export function failure(body) {
    return buildResponse(500, body,"failure");
}

function buildResponse(statusCode, body,message) {
    var responseBody ={"data":body,"message":message,"status":statusCode};
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify(responseBody)
    };
}