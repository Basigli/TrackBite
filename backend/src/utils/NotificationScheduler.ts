import cron, {ScheduledTask} from 'node-cron';
import { UserModel } from '../storage/UserSchema';
import { DailyIntakeModel } from '../storage/DailyIntakeSchema';
import { DietModel } from '../storage/DietSchema';
import { isUserOnline, sendNotification } from '../ws-server';

export class NotificationScheduler {
  private tasks: ScheduledTask[] = [];

  start() {
    // Meal reminder - 3 times a day (8 AM, 1 PM, 7 PM)
    this.tasks.push(
      // cron.schedule('0 8,13,19 * * *', () => {
      cron.schedule('* * * * *', () => {
        this.sendCaloeriesReminders();
      })
    );
    console.log('Notification scheduler started');
  }

  stop() {
    this.tasks.forEach(task => task.stop());
    console.log('Notification scheduler stopped');
  }

  private async sendCaloeriesReminders() {
    try {
      console.log('Sending meal reminders...');
      const users = await UserModel.find();
      for (const user of users) {
        // Only send if user is online (has active socket connection)
        if (isUserOnline(user._id.toString())) {
          const dailyIntake = await DailyIntakeModel.findOne({ userId: user._id });
          if (!dailyIntake) {
            continue; // No daily intake data
          }
          if (!user.activeDietId || user.activeDietId.length === 0) {
            continue; // No active diet
          }
          const diet = await DietModel.findById(user.activeDietId);
          if (!diet) {
            continue; // No active diet
          }
          const caloriesConsumed = dailyIntake.totalCalories;
          const calorieLimit = diet.caloriesAmount;
          const remainingCalories = calorieLimit - caloriesConsumed;

          if (remainingCalories <= 0) {
            continue; // No remaining calories
          }
          const message = `You have ${remainingCalories.toFixed(0)} calories remaining for today. Keep it up!`;
          sendNotification(user._id.toString(), {
            type: 'Meal Reminder',
            message: message
          });
        }
      }
    } catch (error) {
      console.error('Error sending meal reminders:', error);
    }
  }
}