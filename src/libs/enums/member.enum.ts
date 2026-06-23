// who a member account belongs to: a regular site user, a restaurant owner, or an admin
export enum MemberType {
    USER = "USER",
    RESTAURANT = "RESTAURANT",
    ADMIN = "ADMIN"
}

// account status; used (or meant to be used) to block accounts
export enum MemberStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    DELETE = "DELETE",
    BLOCK = "BLOCK"
}

