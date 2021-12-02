export interface Config {
  /** Bot version number */
  version: string;
  /** Bot accent color in hex */
  color: number;
  /** Bot Token, do not share/post anywhere! */
  token: string;
  // /** Bot ID, is required for larger bots and Discordeno v13. */
  // botId: bigint;
  /** Default prefix, can be change on a guild by guild basis */
  defaultPrefix: string;
  /** A list of User IDs that have special privileges */
  userIds: {
    /** Can do just about anything */
    botOwners: bigint[];
    /** Have access to debug commands */
    botDevs: bigint[];
    /** Have access to special helper commands */
    botSupport: bigint[];
  },
}