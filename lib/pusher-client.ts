import Pusher from "pusher-js";

export const pusherClient = new Pusher(process.env.NEXT_PUBLIC_pusher_key!, {
  cluster: process.env.NEXT_PUBLIC_pusher_cluster!,
});
