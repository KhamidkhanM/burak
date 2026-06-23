// TypeScript shapes for member-related data, used across controllers/services for type safety.
import { ObjectId } from "mongoose";
import { MemberStatus, MemberType } from "../enums/member.enum";
import { Request } from "express";
import session, { Session } from "express-session";

// a full member document as stored/returned from MongoDB
export interface Member {
  _id: ObjectId;
  memberType: MemberType;
  memberStatus: MemberStatus;
  memberNick: string;
  memberPhone: string;
  memberPassword?: string;
  memberAddress?: string;
  memberDesc?: string;
  memberImage?: string;
  memberPoints: number;
  createdAt: Date;
  updatedAt: Date;
}

// fields required/allowed when creating a new member (signup)
export interface MemberInput {
  memberType?: MemberType;
  memberStatus?: MemberStatus;
  memberNick: string;
  memberPhone: string;
  memberPassword: string;
  memberAddress?: string;
  memberDesc?: string;
  memberImage?: string;
  memberPoints?: number;
}

// fields required for login
export interface LogInput {
  memberNick: string;
  memberPassword: string;
}

// fields allowed when editing an existing member (_id is required, everything else optional)
export interface MemberUpdateInput {
  _id: ObjectId;
  memberStatus?: MemberStatus;
  memberNick?: string;
  memberPhone?: string;
  memberPassword?: string;
  memberAddress?: string;
  memberDesc?: string;
  memberImage?: string;
}

// extends Express's Request with the extra fields used in admin routes:
// the logged-in member, a typed session, and multer's uploaded file(s)
export interface AdminRequest extends Request {
    member: Member;
    session: Session & { member: Member };
    file: Express.Multer.File;
    files: Express.Multer.File[];
}