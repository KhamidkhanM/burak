// shared small utilities/constants used across the app
export const MORGAN_FORMAT = `:method :url :res[content-length] :response-time [:status] \n`; // log format for morgan

import mongoose from 'mongoose';
// converts a string id (e.g. from req.params or req.body) into a real Mongoose ObjectId,
// but leaves it alone if it's already an ObjectId
export const shapeIntoMongooseObjectId = (target: any) => {
  return typeof target === 'string' ? new mongoose.Types.ObjectId(target) : target;
};