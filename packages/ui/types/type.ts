/* eslint-disable no-unused-vars */
// todo we should combine this file to /Users/myz1237/Desktop/eden/eden-app-2-FrontEnd/apps/alpha/types/type.ts
import {
  APIGuild,
  APIGuildMember,
  ThreadAutoArchiveDuration,
} from "discord-api-types/v10";

export interface CreateThreadResponse {
  threadId: string;
}

export interface FetchGuildMembersResponse {
  members: Array<APIGuildMember>;
}

export interface FetchMutualGuildsResponse {
  guilds: Array<APIGuild>;
}

export interface CreateDMApiRequestBody {
  recipientId: string;
  message: string;
}

export interface CreateDMApiResponse {
  status: string;
}

export interface CreateThreadApiRequestBody {
  message: string;
  embedMessage: string;
  senderName: string;
  senderAvatarURL: string;
  channelId: string;
  tagName?: string;
  threadName: string;
  ThreadAutoArchiveDuration: ThreadAutoArchiveDuration;
  enableButton?: boolean;
}

export interface CreateMessageApiRequestBody {
  message: string;
  thread: string;
  embedMessage?: string;
  senderName?: string;
  senderAvatarURL?: string;
  channelId?: string;
  threadName?: string;
  ThreadAutoArchiveDuration?: ThreadAutoArchiveDuration;
}
