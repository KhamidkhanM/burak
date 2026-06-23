// Mongoose schema/model for the "members" collection (both regular users and restaurant owners).
import mongoose, { Schema } from 'mongoose';
import { MemberStatus, MemberType } from '../libs/enums/member.enum';

const MemberSchema = new Schema({
    memberType: {
        type: String,
        enum: MemberType, // USER / RESTAURANT / ADMIN
        default: MemberType.USER
    },

    memberStatus: {
        type: String,
        enum: MemberStatus, // ACTIVE / BLOCK / DELETE
        default: MemberStatus.ACTIVE
    },

    memberNick: {
        type: String,
        index: { unique: true, sparse: true } // username must be unique (sparse allows it to be missing)
    },

    memberPhone: {
        type: String,
        index: { unique: true, sparse: true },
        required: true,
        },

    memberPassword: {
        type: String,
        select: false, // never returned by default queries, keeps the hash out of normal responses
        required: true,
        },

    memberAddress: {
        type: String,
        },

    memberDesc: {
        type: String,
        },

    memberImage: {
        type: String, // file path to the uploaded profile/restaurant image
        },

    memberPoints: {
        type: Number,
        default: 0,
        },
}
, { timestamps: true } // adds createdAt / updatedAt automatically

);

export default mongoose.model('Member', MemberSchema);