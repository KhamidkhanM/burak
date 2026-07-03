// Auth service: creates JWT tokens so the SPA/React client can stay logged in
// without server-side sessions (token-based authentication).
import { AUTH_TIMER } from "../libs/config"; // token lifetime in hours
import Errors, { HttpCode, Message } from "../libs/types/errors"; // custom error class + codes/messages
import { Member } from "../libs/types/member"; // the data we put inside the token
import jwt from "jsonwebtoken"; // library that signs/verifies JWT tokens

class AuthService {
  constructor() {} // nothing to set up

  // creates a signed JWT that contains the member's data as its payload
  public async createToken(payload: Member) {
    return new Promise((resolve, reject) => { // wrap the callback-style jwt.sign in a Promise
      const duration = `${AUTH_TIMER}h`; // e.g. "24h" — token expires after this
      jwt.sign(
        payload, // the data stored inside the token (the member object)
        process.env.SECRET_TOKEN as string, // secret key from .env used to sign the token
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
}

export default AuthService; // exported so controllers can `new AuthService()`
