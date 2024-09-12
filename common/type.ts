export interface LoginInfo {
    userName: string;
    userId: string; //socketId
    password: string;
}

export interface UserInfo {
    userId: string,
    userName: string,
    connected: boolean,
}