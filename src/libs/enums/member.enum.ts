// who a member account belongs to: a regular site user, a restaurant owner, or an admin
export enum MemberType {
    USER = "USER", // regular customer account, created via public signup
    RESTAURANT = "RESTAURANT", // restaurant owner/admin account, created via admin signup
    ADMIN = "ADMIN" // top-level admin account
}

// account status; used to block/unblock or soft-delete accounts
export enum MemberStatus {
    ACTIVE = "ACTIVE", // normal, can log in
    INACTIVE = "INACTIVE", // not currently used to block login, just a status
    DELETE = "DELETE", // soft-deleted, excluded from login lookups
    BLOCK = "BLOCK" // blocked by admin, login is refused
}
