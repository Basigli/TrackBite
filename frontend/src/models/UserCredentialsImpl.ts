import type { UserCredentials } from "./UserCredentials";

export class UserCredentialsImpl implements UserCredentials {
  constructor(
    public _id: string,
    public nickname: string,
    public passwordHash: string
  ) {}
}

