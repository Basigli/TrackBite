import cron, {ScheduledTask} from 'node-cron';
import { UserModel } from '../storage/UserSchema';
import { isUserOnline, sendNotification } from '../ws-server';

export class NotificationScheduler {
  private tasks: ScheduledTask[] = [];

  start() {
    // Meal reminder - 3 times a day (8 AM, 1 PM, 7 PM)
    this.tasks.push(
      // cron.schedule('0 8,13,19 * * *', () => {
      cron.schedule('* * * * *', () => {
        this.sendMealReminders();
      })
    );
    console.log('Notification scheduler started');
  }

  stop() {
    this.tasks.forEach(task => task.stop());
    console.log('Notification scheduler stopped');
  }

  private async sendMealReminders() {
    try {
      console.log('Sending meal reminders...');
      const users = await UserModel.find();

      for (const user of users) {
        // Only send if user is online (has active socket connection)
        if (isUserOnline(user._id.toString())) {
          sendNotification(user._id.toString(), {
            type: 'MEAL_REMINDER',
            title: 'Meal Reminder',
          });
        }
      }
    } catch (error) {
      console.error('Error sending meal reminders:', error);
    }
  }
}