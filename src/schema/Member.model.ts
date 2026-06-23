// Mongoose schema/model for the "members" collection (both regular users and restaurant owners).
import mongoose, { Schema } from 'mongoose'; // Mongoose itself + Schema constructor
import { MemberStatus, MemberType } from '../libs/enums/member.enum'; // allowed enum values for type/status fields

const MemberSchema = new Schema({ // defines the shape/validation rules for member documents
    memberType: {
        type: String, // stored as a string
        enum: MemberType, // USER / RESTAURANT / ADMIN
        default: MemberType.USER // new accounts default to a regular user
    },

    memberStatus: {
        type: String, // stored as a string
        enum: MemberStatus, // ACTIVE / BLOCK / DELETE
        default: MemberStatus.ACTIVE // new accounts start active
    },

    memberNick: {
        type: String, // login nickname
        index: { unique: true, sparse: true } // username must be unique (sparse allows it to be missing)
    },

    memberPhone: {
        type: String, // phone number
        index: { unique: true, sparse: true }, // must be unique, sparse allows missing
        required: true, // must be provided
        },

    memberPassword: {
        type: String, // stores the hashed password, never plain text
        select: false, // never returned by default queries, keeps the hash out of normal responses
        required: true, // must be provided
        },

    memberAddress: {
        type: String, // optional free-text address
        },

    memberDesc: {
        type: String, // optional free-text description/bio
        },

    memberImage: {
        type: String, // file path to the uploaded profile/restaurant image
        },

    memberPoints: {
        type: Number, // loyalty points counter
        default: 0, // starts at zero
        },
}
, { timestamps: true } // adds createdAt / updatedAt automatically

);

export default mongoose.model('Member', MemberSchema); // registers the 'members' collection model
