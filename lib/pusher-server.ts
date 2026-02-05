import Pusher from "pusher";

export const pusherServer = new Pusher({
  appId: process.env.app_id!,
  key: process.env.pusher_key!,
  secret: process.env.pusher_secret!,
  cluster: process.env.pusher_cluster!,
  useTLS: true,
});
