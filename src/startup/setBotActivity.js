import { ActivityType } from 'discord.js';

export default function setBotActivity(client) {
  const activities = [
    { name: 'AMONGUS!', type: ActivityType.Playing },
    { name: 'AMONGUS!', type: ActivityType.Watching },
    { name: 'AMONGUS!', type: ActivityType.Listening },
    { name: 'AMONGUS!', type: ActivityType.Competing },
  ];
  let i = 0;
  function updateActivity() {
    const activity = activities[i % activities.length];
    client.user.setActivity(activity.name, { type: activity.type });
    i++;
  }
  updateActivity();
  setInterval(updateActivity, 10 * 60 * 1000);
} 