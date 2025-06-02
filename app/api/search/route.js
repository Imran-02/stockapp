
import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {


// Replace the uri string with your connection string.
// const uri="mongodb+srv://imranstock:mongostock@cluster0.jn5kyhq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const uri="mongodb://localhost:27017/stock"
const client = new MongoClient(uri);
  try {
    const query=request.nextUrl.searchParams.get('query')
    const database = client.db('stock');
    const prostock = database.collection('products');
    const productstock = await prostock.aggregate([
        {
          $match: {
            slug: { $regex:query, $options: "i" } //
          }
        }]).toArray()
    return NextResponse.json({productstock,success:true})
  } finally {
    await client.close();
}
}


