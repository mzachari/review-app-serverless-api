import { success, failure } from '../../libs/response-lib';
import productService from './productService';


export async function getProduct(event, context){
    const productId = event.pathParameters.productId;
    const fetchReviews = event.queryStringParameters.fetchReviews;

    try {
        const data = await productService.getProduct(productId, fetchReviews);
        return success(data);
      } catch (error) {
        console.log("Failed to fetch product details: ", error);
        return failure("Internal Server Error");
      }
}