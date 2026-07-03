// HTTP status codes used in API/JSON responses
export enum HttpCode {
  OK = 200, // request succeeded
  CREATED = 201, // a new resource was created
  NOT_MODIFIED = 304, // update found nothing to change
  BAD_REQUEST = 400, // invalid input from the client
  UNAUTHORIZED = 401, // wrong credentials
  FORBIDDEN = 403, // valid login, but not allowed (e.g. blocked)
  NOT_FOUND = 404, // resource doesn't exist
  INTERNAL_SERVER_ERROR = 500, // unexpected server error
}

// human-readable error messages, paired with HttpCode when throwing an Errors instance
export enum Message {
  SOMETHING_WENT_WRONG = "Something went wrong!", // generic fallback message
  NO_DATA_FOUND = "No data is found!", // empty query result
  CREATE_FAILED = "Create is failed!", // insert failed
  UPDATE_FAILED = "Update is failed!", // update failed

  USED_NICK_PHONE = "This nickname or phone number is already used!", // duplicate key on signup
  TOKEN_CREATION_FAILED = "Token creation error!", // jwt.sign failed
  NO_MEMBER_NICK = "No member with this nickname is found!", // login: nickname not found
  BLOCKED_USER = "You have been blocked, contact restaurant!", // login: account is blocked
  WRONG_PASSWORD = "Wrong password, please try again!", // login: password mismatch
  NOT_AUTHENTICATED = "You are not authenticated!", // not logged in / wrong account type
}

// custom error class: every expected/handled error in the app should be thrown as `new Errors(code, message)`
// so catch blocks can check `err instanceof Errors` and respond with the right status + message.
class Errors extends Error {
  public code: HttpCode; // the HTTP status to respond with
  public message: Message; // the message to show the user

  // fallback used when something unexpected (not an Errors instance) is caught
  static standard = {
    code: HttpCode.INTERNAL_SERVER_ERROR, // default to 500
    message: Message.SOMETHING_WENT_WRONG, // default generic message
  }

  constructor(statusCode: HttpCode, statusMessage: Message) {
    super(); // call the base Error constructor
    this.code = statusCode; // store the status code on the instance
    this.message = statusMessage; // store the message on the instance
  }
}

export default Errors; // exported so controllers/services can `throw new Errors(...)`
