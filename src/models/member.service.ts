import MemberModel from "../schema/Member.model";
import { LogInput, Member, MemberInput } from "../libs/types/member";
import Errors, { HttpCode, Message } from "../libs/types/errors";
import { MemberType } from "../libs/enums/member.enum";
import * as bcrypt from "bcryptjs";

class MemberService {
  private readonly memberModel;

  constructor() {
    this.memberModel = MemberModel;
  }

  /** SPA */

  public async signup(input: MemberInput): Promise<Member> {
    const salt = await bcrypt.genSalt();
    input.memberPassword = await bcrypt.hash(input.memberPassword, salt);

    try {
      const result = await this.memberModel.create(input);
      result.memberPassword = "";
      return result.toJSON();

    } catch (err) {
      console.error("Error, model:signup", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.USED_NICK_PHONE);
    }
  }

  public async login(input: LogInput): Promise<Member> {
    //TODO: consider member status later, if needed
    const member = await this.memberModel
      .findOne(
        { memberNick: input.memberNick },
        { memberNick: 1, memberPassword: 1 }
      )
      .exec();

    if (!member) throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK);

    const isMatch = await bcrypt.compare(input.memberPassword, member.memberPassword);
    console.log("isMatch:", isMatch);

    if (!isMatch) {
      throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD);
    }

    return await this.memberModel.findOne(member._id).lean().exec();
  }

  /** SSR */

    public async processSignup(input: MemberInput): Promise<Member> {
    // const exist = await this.memberModel
    //   .findOne({ memberType: MemberType.RESTAURANT })
    //   .exec();
    // console.log("exist:", exist);
    // if (exist) throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    
    console.log("before:", input.memberPassword);
    const salt = await bcrypt.genSalt();
    input.memberPassword = await bcrypt.hash(input.memberPassword, salt);
    console.log("after:", input.memberPassword);
    
    try {
      const result = await this.memberModel.create(input);
      result.memberPassword = "";
      return result;
    } catch (err) {
      console.log("Error, model:processSignup", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  public async processLogin(input: LogInput): Promise<Member> {
    const member = await this.memberModel
      .findOne(
        { memberNick: input.memberNick },
        { memberNick: 1, memberPassword: 1 }
      )
     

      .exec();

    if (!member) throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK);

    const isMatch = await bcrypt.compare(input.memberPassword, member.memberPassword);
    // const isMatch = member.memberPassword === input.memberPassword;
    console.log("isMatch:", isMatch);

    if (!isMatch) {
         throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD);
    }

    const result = await this.memberModel.findOne({ _id: member._id }).lean().exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK);
    return result;
  }
}

export default MemberService;