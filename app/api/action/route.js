// Update a document

import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";


export async function POST(request) {


// Replace the uri string with your MongoDB deployment's connection string
const uri="mongodb+srv://imranstock:mongostock@cluster0.jn5kyhq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

const client = new MongoClient(uri);
    let {action,slug,initialquantity}=await request.json()
    console.log(action,slug,initialquantity)
  try {
    const database = client.db("stock");
    const movies = database.collection("products");

    // Create a filter for movies with the title "Random Harvest"
    const filter = { slug:slug };

    // Specify the update to set a value for the plot field
    let newquantity=action=="plus"?parseInt(initialquantity)+1:parseInt(initialquantity)-1
    const updateDoc = {
      $set: {
        quantity: newquantity
      },
    };

    // Update the first document that matches the filter
    const result = await movies.updateOne(filter, updateDoc, "");
    
    // Print the number of matching and modified documents
    console.log(
      `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
    );
    return NextResponse.json({success:true,message:result})
  } finally {
    // Close the connection after the operation completes
    await client.close();
  }
}
// Run the program and print any thrown errors

