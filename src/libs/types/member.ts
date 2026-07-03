// TypeScript shapes for member-related data, used across controllers/services for type safety.
import { ObjectId } from "mongoose"; // Mongo's document id type
import { MemberStatus, MemberType } from "../enums/member.enum"; // account type/status enums
import { Request } from "express"; // base Express request type to extend
import session, { Session } from "express-session"; // session typing

// a full member document as stored/returned from MongoDB
export interface Member {
  _id: ObjectId; // Mongo document id
  memberType: MemberType; // USER / RESTAURANT / ADMIN
  memberStatus: MemberStatus; // ACTIVE / INACTIVE / DELETE / BLOCK
  memberNick: string; // login nickname, unique
  memberPhone: string; // phone number, unique
  memberPassword?: string; // hashed password, optional because it's hidden in some responses
  memberAddress?: string; // optional address
  memberDesc?: string; // optional description/bio
  memberImage?: string; // optional profile image filename
  memberPoints: number; // loyalty points
  createdAt: Date; // auto-set by Mongoose timestamps
  updatedAt: Date; // auto-set by Mongoose timestamps
}

// fields required/allowed when creating a new member (signup)
export interface MemberInput {
  memberType?: MemberType; // defaults to USER if not given
  memberStatus?: MemberStatus; // defaults to ACTIVE if not given
  memberNick: string; // required login nickname
  memberPhone: string; // required phone number
  memberPassword: string; // required plain password (hashed before saving)
  memberAddress?: string; // optional
  memberDesc?: string; // optional
  memberImage?: string; // optional
  memberPoints?: number; // optional, defaults in schema
}

// fields required for login
export interface LogInput {
  memberNick: string; // nickname to look up
  memberPassword: string; // plain password to compare against the hash
}

// fields allowed when editing an existing member (_id is required, everything else optional)
export interface MemberUpdateInput {
  _id: ObjectId; // which member to update
  memberStatus?: MemberStatus; // e.g. block/unblock
  memberNick?: string; // change nickname
  memberPhone?: string; // change phone
  memberPassword?: string; // change password
  memberAddress?: string; // change address
  memberDesc?: string; // change description
  memberImage?: string; // change image
}

// extends Express's Request for token-authenticated SPA routes:
// req.member is set by the verifyAuth/retrieveAuth middleware after decoding the JWT
export interface ExtendedRequest extends Request {
  member: Member; // the member decoded from the accessToken cookie
  file: Express.Multer.File; // single uploaded file (multer)
  files: Express.Multer.File[]; // multiple uploaded files (multer)
}

// extends Express's Request with the extra fields used in admin routes:
// the logged-in member, a typed session, and multer's uploaded file(s)
export interface AdminRequest extends Request {
    member: Member; // currently logged-in restaurant member, set by verifyRestaurant
    session: Session & { member: Member }; // session typed to include the member
    file: Express.Multer.File; // single uploaded file (multer)
    files: Express.Multer.File[]; // multiple uploaded files (multer)
}
