// Business logic for members: signup, login, password hashing, user management.
// Talks to MongoDB through MemberModel; controllers call these methods, never the DB directly.
import MemberModel from "../schema/Member.model"; // the Mongoose model/collection
import { LogInput, Member, MemberInput, MemberUpdateInput } from "../libs/types/member"; // typed shapes
import Errors, { HttpCode, Message } from "../libs/types/errors"; // custom error class + codes/messages
import { MemberStatus, MemberType } from "../libs/enums/member.enum"; // account type/status enums
import * as bcrypt from "bcryptjs"; // password hashing library
import { shapeIntoMongooseObjectId } from "../libs/config"; // string -> ObjectId helper

class MemberService {

  private readonly memberModel; // reference to the Mongoose model, set once in the constructor

  constructor() {
    this.memberModel = MemberModel; // assign the imported model so methods can use `this.memberModel`
  }

  /** SPA */

  // creates a regular USER account (used by the public/SPA signup API)
  public async signup(input: MemberInput): Promise<Member> {
    const salt = await bcrypt.genSalt(); // generate a random salt for hashing
    input.memberPassword = await bcrypt.hash(input.memberPassword, salt); // never store plain-text passwords

    try {
      const result = await this.memberModel.create(input); // insert the new member document
      result.memberPassword = ""; // hide the hash before sending the response back
      return result.toJSON(); // convert the Mongoose document into a plain object

    } catch (err) {
      console.error("Error, model:signup", err); // log the real DB error (e.g. duplicate key)
      throw new Errors(HttpCode.BAD_REQUEST, Message.USED_NICK_PHONE); // report a friendly error instead
    }
  }

  // verifies a regular USER's credentials (used by the public/SPA login API)
  public async login(input: LogInput): Promise<Member> {
    //TODO: consider member status later, if needed
    const member = await this.memberModel
      .findOne(
        { memberNick: input.memberNick, memberStatus: { $ne: MemberStatus.DELETE } }, //Filter. $ne = not equal
        { memberNick: 1, memberPassword: 1, memberStatus: 1 } //Projection: only fetch these fields
      )
      .exec(); // run the query

    if (!member) throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK); // no account with that nickname
    else if (member.memberStatus === MemberStatus.BLOCK) { // account exists but is blocked
      throw new Errors(HttpCode.FORBIDDEN, Message.BLOCKED_USER) // refuse login
    }

    const isMatch = await bcrypt.compare(input.memberPassword, member.memberPassword); // compare plain password vs stored hash
    console.log("isMatch:", isMatch); // debug log

    if (!isMatch) {
      throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD); // password didn't match
    }

    return await this.memberModel.findOne({ _id: member._id }).lean().exec(); // fetch the full member document to return
  }

  // returns the fresh member data for the logged-in member (used by GET /member/detail)
  public async getMemberDetail(member: Member): Promise<Member> {
    const memberId = shapeIntoMongooseObjectId(member._id); // the id from the decoded token, made into an ObjectId
    const result = await this.memberModel
      .findOne({ _id: memberId, memberStatus: MemberStatus.ACTIVE }) // must exist AND still be active
      .exec(); // run the query
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND); // deleted/blocked since login
    return result; // hand the fresh member document back
  }

  public async updateMember(
    member: Member,
    input: MemberUpdateInput,
  ): Promise<Member> {
    const memberId = shapeIntoMongooseObjectId(member._id);
    const result = await this.memberModel
      .findOneAndUpdate({ _id: memberId }, input, { new: true })
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);

    return result;
  }

  public async getTopUsers(): Promise<Member[]> {
    const result = await this.memberModel
      .find({ memberStatus: MemberStatus.ACTIVE, memberPoints: { $gt: 1 } })
      .sort({ memberPoints: -1 })
      .limit(4)
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result;
  }

  /** SSR */

  // creates a RESTAURANT account (used by the admin panel signup form)
  public async processSignup(input: MemberInput): Promise<Member> {
    // const exist = await this.memberModel
    //   .findOne({ memberType: MemberType.RESTAURANT })
    //   .exec();
    // console.log("exist:", exist);
    // if (exist) throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);

    // console.log("before:", input.memberPassword);
    const salt = await bcrypt.genSalt(); // generate a random salt for hashing
    input.memberPassword = await bcrypt.hash(input.memberPassword, salt); // hash the password before saving
    // console.log("after:", input.memberPassword);

    try {
      const result = await this.memberModel.create(input); // insert the new restaurant member
      result.memberPassword = ""; // hide the hash before returning it
      return result;
    } catch (err) {
      console.log("Error, model:processSignup", err); // log the real DB error
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED); // report a friendly error instead
    }
  }

  // verifies a RESTAURANT member's credentials (used by the admin panel login form)
  public async processLogin(input: LogInput): Promise<Member> {
    const member = await this.memberModel
      .findOne(
        { memberNick: input.memberNick }, // filter: match by nickname
        { memberNick: 1, memberPassword: 1, memberStatus: 1 } // projection: only fetch these fields
      )
      .exec(); // run the query

    if (!member) throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK); // no account with that nickname
    else if (member.memberStatus === MemberStatus.BLOCK) { // account exists but is blocked
      throw new Errors(HttpCode.FORBIDDEN, Message.BLOCKED_USER); // refuse login
    }

    const isMatch = await bcrypt.compare(input.memberPassword, member.memberPassword); // compare plain password vs stored hash
    // const isMatch = member.memberPassword === input.memberPassword;
    console.log("isMatch:", isMatch); // debug log

    if (!isMatch) {
      throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD); // password didn't match
    }

    const result = await this.memberModel.findOne({ _id: member._id }).lean().exec(); // fetch the full member document
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK); // safety check, should rarely happen
    return result;
  }


  // returns every regular USER (for the admin "Users" page) — restaurant members are excluded
  public async getUsers(): Promise<Member[]> {
    const result = await this.memberModel.find({ memberType: MemberType.USER }).exec(); // fetch all USER-type accounts

    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND); // (find() never actually returns null, but kept as a safety check)
    return result;
  }

  // updates one user's data (e.g. memberStatus to block/unblock) by _id
  public async updateChosenUser(input: MemberUpdateInput): Promise<Member> {
    input._id = shapeIntoMongooseObjectId(input._id); // convert string id from the request into a real ObjectId
    const result = await this.memberModel.findByIdAndUpdate({ _id: input._id }, input, { new: true }).exec(); // {new:true} returns the updated doc

    if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED); // no document found to update
    return result;
  }

}

export default MemberService; // exported so controllers can `new MemberService()`
