/* eslint-disable camelcase */
/* eslint-disable import/no-anonymous-default-export */
import axios, { AxiosResponse } from "axios";
import {
  APIGuildForumChannel,
  APIThreadChannel,
  ButtonStyle,
  ChannelType,
  ComponentType,
  RESTPostAPIGuildForumThreadsJSONBody,
} from "discord-api-types/v10";
import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

import { ButtonCustomId, DISCORD_API_URL } from "../../../constants";
import {
  CreateThreadApiRequestBody,
  CreateThreadResponse,
} from "../../../types/type";

export default async (
  req: NextApiRequest,
  res: NextApiResponse<CreateThreadResponse>
) => {
  const token = await getToken({
    req,
    secret: process.env.NEXT_PUBLIC_SECRET,
  });

  if (!token || !token?.accessToken) {
    return res.status(401);
  }
  try {
    const { body } = req;

    const {
      message,
      embedMessage,
      tagName,
      senderAvatarURL,
      senderName,
      channelId,
      threadName,
      ThreadAutoArchiveDuration,
      enableButton,
    } = body as CreateThreadApiRequestBody;

    const myAxios = axios.create({
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
    });

    if (!message && !embedMessage && !channelId) {
      res.status(400).end();
    }

    // Fetch forum Obj is to fetch tag ID
    const forumResponse = await myAxios.get<APIGuildForumChannel>(
      `${DISCORD_API_URL}/channels/${channelId}`
    );

    if (forumResponse.data.type !== ChannelType.GuildForum) {
      res.status(404).end();
    }
    // Find tag --- `Chat` ID, used in creating post in forum
    // Only post with specific tags can be captured by the bot
    const tags = forumResponse.data.available_tags.filter(
      (tag) => tag.name === tagName
    );

    if (tags.length === 0) {
      res.status(404);
    }
    const chatTagId = tags[0].id;

    const postResponse = await myAxios.post<
      APIThreadChannel,
      AxiosResponse<APIThreadChannel>,
      RESTPostAPIGuildForumThreadsJSONBody
    >(`${DISCORD_API_URL}/channels/${channelId}/threads`, {
      name: threadName,
      auto_archive_duration: ThreadAutoArchiveDuration,
      applied_tags: [chatTagId],
      message: {
        content: message,
        embeds: [
          {
            author: {
              name: senderName,
              icon_url: senderAvatarURL,
            },
            description: embedMessage,
          },
        ],
        components: enableButton
          ? [
              {
                type: ComponentType.ActionRow,
                components: [
                  {
                    custom_id: ButtonCustomId.AgreeToConnect,
                    label: "Let's connect",
                    style: ButtonStyle.Success,
                    type: ComponentType.Button,
                  },
                  {
                    custom_id: ButtonCustomId.NoInterest,
                    label: "No Interest",
                    style: ButtonStyle.Primary,
                    type: ComponentType.Button,
                  },
                  {
                    custom_id: ButtonCustomId.RefuseConnect,
                    label: "Don't notify me",
                    style: ButtonStyle.Danger,
                    type: ComponentType.Button,
                  },
                ],
              },
            ]
          : [],
      },
    });

    res.status(200).send({
      threadId: postResponse.data.id,
    });
  } catch (error) {
    console.log(error);
    res.status(400).end();
  }
};
