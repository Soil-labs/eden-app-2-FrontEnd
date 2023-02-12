/* eslint-disable no-unused-vars */
// Environments
export const IS_PRODUCTION = process.env.NODE_ENV === "production";
export const IS_DEVELOPMENT = process.env.NODE_ENV === "development";
export const DISCORD_API_URL = "https://discord.com/api/v10";
// VIEW_CHANNEL | SEND_MESSAGES | CREATE_PUBLIC_THREADS
export const DISCORD_VIEW_CHANNEL_PERMISSION = 0x400;
export const DISCORD_SEND_MESSAGES_PERMISSION = 0x800;
export const DISCORD_CREATE_PUBLIC_THREADS_PERMISSION = 0x800000000;
// Button CustomID -- be same to the bot
export enum ButtonCustomId {
  AgreeToConnect = "connect",
  RefuseConnect = "refuse_connect",
  NoInterest = "no_interest",
}
