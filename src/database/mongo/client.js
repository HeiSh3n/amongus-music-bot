import { MongoClient } from 'mongodb';

const uri = process.env.DB_URL || `mongodb://${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 27017}`;
const client = new MongoClient(uri);
 
export default client; 