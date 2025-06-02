import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {


// Replace the uri string with your connection string.
const uri="mongodb://localhost:27017/stock"
const client = new MongoClient(uri);
  try {
    const database = client.db('stock');
    const prostock = database.collection('products');
    const query = {  };
    const productstock = await prostock.find(query).toArray();
    return NextResponse.json({productstock,success:true})
  } finally {
    await client.close();
}
}
export async function POST(request) {


// Replace the uri string with your connection string.
const uri="mongodb://localhost:27017/stock"
const client = new MongoClient(uri);
let body=await request.json()
  try {
    const database = client.db('stock');
    const prostock = database.collection('products');
    const productstock = await prostock.insertOne(body);
    return NextResponse.json({productstock,success:true})
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
}
}






