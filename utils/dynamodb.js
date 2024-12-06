'use server'

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import axios from 'axios';
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { unstable_cache } from 'next/cache';
import { revalidatePath , revalidateTag } from 'next/cache';

let dynamoClient;
let docClient;
let sesClient;

if (process.env.NODE_ENV === 'production') {
  // For production (Vercel)
  dynamoClient = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
  });
  docClient = DynamoDBDocumentClient.from(dynamoClient);
  sesClient = new SESClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
} else {
  // For development
  dynamoClient = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
  });
  docClient = DynamoDBDocumentClient.from(dynamoClient);
  sesClient = new SESClient({ region: process.env.AWS_REGION });
}

const getBookings = unstable_cache(
  async () => {
    const command = new ScanCommand({
      TableName: 'Bookings'
    });

    try {
      const result = await docClient.send(command);
      const bookings = result.Items.reduce((acc, item) => {
        if (!acc[item.date]) {
          acc[item.date] = [];
        }
        acc[item.date].push(item.time);
        return acc;
      }, {});
      return bookings;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  },
  ['bookings'],
  { revalidate: 12000 } 
);

async function createBooking(name, phone, appointmentDate, appointmentTime) {
  const command = new PutCommand({
    TableName: 'Bookings',
    Item: {
      date: appointmentDate,
      time: appointmentTime,
      name: name,
      phone: phone
    },
    ConditionExpression: 'attribute_not_exists(#date) AND attribute_not_exists(#time)',
    ExpressionAttributeNames: {
      '#date': 'date',
      '#time': 'time'
    }
  });

  try {
    await docClient.send(command);
    revalidatePath('/booking');
    revalidateTag('bookings');
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
}

async function storeBookingDetails(name, phone, appointmentDate, appointmentShortDate, appointmentTime, appointmentDayArabic) {
  const command = new PutCommand({
    TableName: 'BookingDetails',
    Item: {
      id: Date.now().toString(),
      name: name,
      phone: phone,
      appointmentDate: appointmentDate,
      appointmentShortDate: appointmentShortDate,
      appointmentTime: appointmentTime,
      appointmentDayArabic: appointmentDayArabic,
      createdAt: new Date().toISOString()
    }
  });

  try {
    await docClient.send(command);
    revalidatePath('/booking');
    revalidateTag('bookings');
    // Send data to webhook
    const webhookUrl = process.env.WEBHOOK_URL;
    if (webhookUrl) {
      const webhookData = {
        id: command.input.Item.id,
        name: command.input.Item.name,
        phone: command.input.Item.phone,
        appointmentDate: command.input.Item.appointmentShortDate,
        appointmentTime: command.input.Item.appointmentTime,
        appointmentDayArabic: command.input.Item.appointmentDayArabic,
        createdAt: command.input.Item.createdAt
      };
      await axios.post(webhookUrl, webhookData);
    }

    // Send email notification
    await sendEmailNotification(command.input.Item);
  } catch (error) {
    console.error('Error storing booking details:', error);
    throw error;
  }
}

async function sendEmailNotification(bookingDetails) {
  const recipients = ['bhk891@gmail.com', 'a.kh.adb@gmail.com', 'harer2.sa@gmail.com'];
  const subject = `حجز جديد: ${bookingDetails.appointmentDayArabic} ${bookingDetails.appointmentTime}`;
  const body = `
    تفاصيل الحجز:
    الاسم: ${bookingDetails.name}
    رقم الهاتف: ${bookingDetails.phone}
    اليوم: ${bookingDetails.appointmentDayArabic}
    التاريخ: ${bookingDetails.appointmentShortDate}
    الوقت: ${bookingDetails.appointmentTime}
  `;

  const params = {
    Destination: {
      ToAddresses: recipients,
    },
    Message: {
      Body: {
        Text: { Data: body, Charset: "UTF-8" },
      },
      Subject: { Data: subject, Charset: "UTF-8" },
    },
    Source: "admin@harertailor.store", // Replace with your SES verified email
  };

  try {
    const command = new SendEmailCommand(params);
    const response = await sesClient.send(command);
    console.log("Email sent successfully:", response);
  } catch (error) {
    console.error("Error sending email:", error);
    // Note: We're not throwing the error here to prevent booking failure due to email issues
  }
}

export {
  getBookings,
  createBooking,
  storeBookingDetails
};