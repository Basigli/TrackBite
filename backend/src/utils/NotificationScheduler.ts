import cron, {ScheduledTask} from 'node-cron';
import { UserModel } from '../storage/UserSchema';
import { DailyIntakeModel } from '../storage/DailyIntakeSchema';
import { DietModel } from '../storage/DietSchema';
import { isUserOnline, sendNotification } from '../ws-server';

export class NotificationScheduler {
  private tasks: ScheduledTask[] = [];

  start() {
    this.tasks.push(
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
      const now = new Date();
      const dailyIntakes = await DailyIntakeModel.find();
      for (const user of users) {
        // Only send if user is online (has active socket connection)
        if (isUserOnline(user._id.toString())) {
          if (!user.activeDietId || user.activeDietId.length === 0) {
            continue; // No active diet
          }
          const diet = await DietModel.findById(user.activeDietId);
          if (!diet) {
            continue; // No active diet
          }
          const dailyIntake = dailyIntakes.find(di => di.userId.toString() === user._id.toString() && new Date(di.date).toDateString() === new Date(now).toDateString()
          );
          if (!dailyIntake) {
            console.log("Sending notification to user with no daily intake:", user._id.toString());
            sendNotification(user._id.toString(), {
              type: 'Meal Reminder',
              message: `You have not logged any food intake today. Don't forget to track your meals!`
            });
            continue;
          }
          
          const caloriesConsumed = dailyIntake.totalCalories;
          const calorieLimit = diet.caloriesAmount;
          const remainingCalories = calorieLimit - caloriesConsumed;

          if (remainingCalories <= 0) {
            continue; // No remaining calories
          }
          const message = `You have ${remainingCalories.toFixed(0)} calories remaining for today. Keep it up!`;
          console.log("Sending notification to user with remaining calories:", user._id.toString(), message);
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