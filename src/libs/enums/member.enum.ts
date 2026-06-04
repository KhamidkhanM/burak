export enum MemberType {
    USER = "USER",
    RESTAURANT = "RESTAURANT",
    ADMIN = "ADMIN"
}

export enum MemberStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "BLOCK",
    DELETE = "DELETE"
}

export interface LogInput {
  memberNick: string;
  memberPassword: string;
}