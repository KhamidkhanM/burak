// Auth service: creates JWT tokens so the SPA/React client can stay logged in
// without server-side sessions (token-based authentication).
import { AUTH_TIMER } from "../libs/config"; // token lifetime in hours
import Errors, { HttpCode, Message } from "../libs/types/errors"; // custom error class + codes/messages
import { Member } from "../libs/types/member"; // the data we put inside the token
import jwt from "jsonwebtoken"; // library that signs/verifies JWT tokens

class AuthService {
  private readonly secretToken; // the signing secret, loaded once from .env
  constructor() {
    this.secretToken = process.env.SECRET_TOKEN as string; // read SECRET_TOKEN from .env
  }

  // creates a signed JWT that contains the member's data as its payload
  public async createToken(payload: Member) {
    return new Promise((resolve, reject) => { // wrap the callback-style jwt.sign in a Promise
      const duration = `${AUTH_TIMER}h`; // e.g. "24h" — token expires after this
      jwt.sign(
        payload, // the data stored inside the token (the member object)
        this.secretToken, // secret key from .env used to sign the token
        { expiresIn: duration }, // token becomes invalid after the duration
        (err, token) => { // callback runs when signing finishes
          if (err)
            reject(
              new Errors(HttpCode.UNAUTHORIZED, Message.TOKEN_CREATION_FAILED), // signing failed
            );
          else resolve(token as string); // success: hand back the signed token string
        },
      );
    });
  }

  // verifies a token's signature + expiry, and returns the member data stored inside it
  public async checkAuth(token: string): Promise<Member> {
    const result: Member = (await jwt.verify(
      token, // the token string from the cookie
      this.secretToken, // must be verified with the same secret it was signed with
    )) as Member; // the decoded payload is the member object we signed earlier
    console.log(`----[AUTH] memberNick: ${result.memberNick}------`); // debug log of who is authenticated
    return result; // hand the member back to the controller
  }
}

export default AuthService; // exported so controllers can `new AuthService()`
