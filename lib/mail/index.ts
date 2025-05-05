'use server';

import * as SibApiV3Sdk from '@getbrevo/brevo';

interface EmailParams {
  subject: string;
  htmlContent: string;
  to: { email: string; name: string }[];
  from?: { email: string; name: string };
  replyTo?: { email: string; name: string };
}

export async function sendEmail({
  subject,
  htmlContent,
  to,
  from = { email: "laritavaressoares@gmail.com", name: "Larissa Soares" },
  replyTo = { email: "laritavaressoares@gmail.com", name: "Larissa Soares" }
}: EmailParams) {
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  const apiKey = process.env.BREVO_API_KEY;
  
  if (!apiKey) {
    throw new Error('BREVO_API_KEY is not defined');
  }

  apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, apiKey);

  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = htmlContent;
  sendSmtpEmail.sender = from;
  sendSmtpEmail.to = to;
  sendSmtpEmail.replyTo = replyTo;

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}
