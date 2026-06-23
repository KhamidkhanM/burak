// HTTP status codes used in API/JSON responses
export enum HttpCode {
  OK = 200,
  CREATED = 201,
  NOT_MODIFIED = 304,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

// human-readable error messages, paired with HttpCode when throwing an Errors instance
export enum Message {
  SOMETHING_WENT_WRONG = "Something went wrong!",
  NO_DATA_FOUND = "No data is found!",
  CREATE_FAILED = "Create is failed!",
  UPDATE_FAILED = "Update is failed!",

  USED_NICK_PHONE = "This nickname or phone number is already used!",
  NO_MEMBER_NICK = "No member with this nickname is found!",
  BLOCKED_USER = "You have been blocked, contact restaurant!",
  WRONG_PASSWORD = "Wrong password, please try again!",
  NOT_AUTHENTICATED = "You are not authenticated!",
}

// custom error class: every expected/handled error in the app should be thrown as `new Errors(code, message)`
// so catch blocks can check `err instanceof Errors` and respond with the right status + message.
class Errors extends Error {
  public code: HttpCode;
  public message: Message;

  // fallback used when something unexpected (not an Errors instance) is caught
  static standard = {
    code: HttpCode.INTERNAL_SERVER_ERROR,
    message: Message.SOMETHING_WENT_WRONG,
  }

  constructor(statusCode: HttpCode, statusMessage: Message) {
    super();
    this.code = statusCode;
    this.message = statusMessage;
  }
}

export default Errors;