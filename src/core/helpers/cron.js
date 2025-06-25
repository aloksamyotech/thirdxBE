import cron from 'node-cron';
import { updateCaseStatus } from '../../services/case.js';

cron.schedule('0 0 * * *', () => {
    console.log('running cron job to update case status...');
    updateCaseStatus();
});

