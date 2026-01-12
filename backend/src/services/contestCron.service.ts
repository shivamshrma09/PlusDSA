import cron from 'node-cron';
import axios from 'axios';

const API_BASE_URL = process.env.API_BASE_URL ;

export const startContestCronJob = () => {
  cron.schedule('0 * * * *', async () => {
    try {
      const indiaTime = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Kolkata'
      });
      
      console.log(` [${indiaTime}] Checking contest round transitions (India Time)...`);
      
      const response = await axios.post(`${API_BASE_URL}/contest/advance-rounds`);
      
      if (response.data.updatedContests > 0) {
        console.log(` [${indiaTime}] Advanced ${response.data.updatedContests} contest rounds`);
      } else {
        console.log(`ℹ [${indiaTime}] No contest rounds to advance`);
      }
    } catch (error) {
      const indiaTime = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Kolkata'
      });
      console.error(`[${indiaTime}] Contest cron job failed:`, error);
    }
  }, {
    timezone: 'Asia/Kolkata'
  });
  
  const indiaTime = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Kolkata'
  });
};