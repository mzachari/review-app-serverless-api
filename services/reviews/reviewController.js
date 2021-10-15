import { success, failure } from '../../libs/response-lib';
import reviewService from './reviewService';


export async function getProductReviews(event, context){
    const productId = event.pathParameters.productId;

    try {
        const data = await reviewService.getProductReviews(productId);
        return success(data);
      } catch (error) {
        console.log("Failed to fetch product reviews: ", error);
        return failure("Internal Server Error");
      }
}