import {
  ChannelHeader,
  ChannelHeaderProps,
  useChannelActionContext,
  useChannelStateContext,
} from "stream-chat-react";
import { UserResource } from "@clerk/types";
import { Bell, BellOff } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export default function CustomChannelHeader(props: ChannelHeaderProps) {
  const { user } = useUser();
  const {
    channel: { id: chanelId },
  } = useChannelStateContext();
  return (
    <div className="flex items-center justify-between gap-3 bg-white dark:bg-[#17191c]">
      <ChannelHeader {...props} />
      {user && chanelId && (
        <ChannelNotificationToggleButton user={user} channelId={chanelId} />
      )}
    </div>
  );
}

interface ChannelNotificationToggleButtonProps {
  user: UserResource;
  channelId: string;
}

function ChannelNotificationToggleButton({
  user,
  channelId,
}: ChannelNotificationToggleButtonProps) {
  const { addNotification } = useChannelActionContext();

  const mutedChannels = user.unsafeMetadata.mutedChannels || [];

  const channelMuted = mutedChannels.includes(channelId);

  async function setChannelMuted(channelId: string, muted: boolean) {
    try {
      let mutedChannelsUpdate: string[];

      if (muted) {
        mutedChannelsUpdate = [...mutedChannels, channelId];
      } else {
        mutedChannelsUpdate = mutedChannels.filter((id) => id !== channelId);
      }

      await user.update({
        unsafeMetadata: {
          mutedChannels: mutedChannelsUpdate,
        },
      });
      addNotification(
        `Channel notifications ${muted ? "muted" : "unmuted"}`,
        "success"
      );
    } catch (error) {
      console.error(error);
      addNotification(`Something went wrong, please try again`, "error");
    }
  }

  return (
    <div className="me-6 ">
      {!channelMuted ? (
        <span title="Mute channel notification">
          <BellOff
            className="cursor-pointer"
            onClick={() => setChannelMuted(channelId, true)}
          />
        </span>
      ) : (
        <span title="Unmute channel notification">
          <Bell
            className="cursor-pointer"
            onClick={() => setChannelMuted(channelId, false)}
          />
        </span>
      )}
    </div>
  );
}
