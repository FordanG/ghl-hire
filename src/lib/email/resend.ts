import { Resend } from 'resend';

// Initialize Resend client
// Get API key from environment variable: RESEND_API_KEY
const resend = new Resend(process.env.RESEND_API_KEY || '');

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
}

/**
 * Send email using Resend API
 */
export async function sendEmail(options: EmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from: options.from || process.env.RESEND_FROM_EMAIL || 'GHL Hire <noreply@ghlhire.com>',
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      html: options.html,
      replyTo: options.replyTo,
      cc: options.cc,
      bcc: options.bcc,
    });

    if (error) {
      console.error('Resend email error:', error);
      throw error;
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}

/**
 * Email template utilities
 */
export const emailTemplates = {
  // Welcome email for new users
  welcome: (name: string, userType: 'job_seeker' | 'employer') => ({
    subject: 'Welcome to GHL Hire!',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
            .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to GHL Hire!</h1>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              <p>Welcome to GHL Hire - the premier job board for GoHighLevel professionals!</p>
              ${userType === 'job_seeker'
                ? `<p>You're now part of a community connecting talented GHL professionals with amazing opportunities. Here's what you can do:</p>
                   <ul>
                     <li>Browse hundreds of GHL job opportunities</li>
                     <li>Set up job alerts to get notified of new matches</li>
                     <li>Build your professional profile</li>
                     <li>Apply to jobs with one click</li>
                   </ul>
                   <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">Complete Your Profile</a>`
                : `<p>You can now start posting jobs and finding top GHL talent. Here's what's next:</p>
                   <ul>
                     <li>Complete your company profile</li>
                     <li>Post your first job opening</li>
                     <li>Browse our talent directory</li>
                     <li>Track applications and hire great talent</li>
                   </ul>
                   <a href="${process.env.NEXT_PUBLIC_APP_URL}/company/dashboard" class="button">Get Started</a>`
              }
              <p>If you have any questions, our support team is here to help at <a href="mailto:support@ghlhire.com">support@ghlhire.com</a></p>
              <p>Best regards,<br>The GHL Hire Team</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} GHL Hire. All rights reserved.</p>
              <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe">Unsubscribe</a> | <a href="${process.env.NEXT_PUBLIC_APP_URL}/help">Help Center</a></p>
            </div>
          </div>
        </body>
      </html>
    `
  }),

  // Application submitted confirmation
  applicationSubmitted: (candidateName: string, jobTitle: string, companyName: string) => ({
    subject: `Application Submitted - ${jobTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
            .success-icon { font-size: 48px; margin-bottom: 10px; }
            .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="success-icon">✓</div>
              <h1>Application Submitted!</h1>
            </div>
            <div class="content">
              <p>Hi ${candidateName},</p>
              <p>Your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been successfully submitted!</p>
              <p>Here's what happens next:</p>
              <ol>
                <li>The hiring team will review your application</li>
                <li>You'll receive updates via email as your application progresses</li>
                <li>If selected, you'll be contacted for the next steps</li>
              </ol>
              <p>Track your application status anytime in your dashboard:</p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/applications" class="button">View Application Status</a>
              <p>Good luck!</p>
              <p>Best regards,<br>The GHL Hire Team</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} GHL Hire. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
  }),

  // New application notification for employers
  newApplication: (employerName: string, candidateName: string, jobTitle: string, applicationId: string) => ({
    subject: `New Application - ${jobTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
            .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Application Received!</h1>
            </div>
            <div class="content">
              <p>Hi ${employerName},</p>
              <p>Great news! <strong>${candidateName}</strong> has applied for your <strong>${jobTitle}</strong> position.</p>
              <p>Review the application and candidate profile to see if they're a good fit:</p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/company/applications/${applicationId}" class="button">Review Application</a>
              <p>Don't let great talent slip away - respond quickly to stand out!</p>
              <p>Best regards,<br>The GHL Hire Team</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} GHL Hire. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
  }),

  // Application status changed
  applicationStatusChanged: (candidateName: string, jobTitle: string, companyName: string, status: string, applicationId: string) => ({
    subject: `Application Update - ${jobTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
            .status-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin: 10px 0; }
            .status-reviewing { background: #dbeafe; color: #1e40af; }
            .status-shortlisted { background: #d1fae5; color: #065f46; }
            .status-rejected { background: #fee2e2; color: #991b1b; }
            .status-accepted { background: #d1fae5; color: #065f46; }
            .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Application Status Update</h1>
            </div>
            <div class="content">
              <p>Hi ${candidateName},</p>
              <p>Your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been updated:</p>
              <p><span class="status-badge status-${status.toLowerCase()}">${status.toUpperCase()}</span></p>
              ${status === 'shortlisted'
                ? '<p>Congratulations! The hiring team is interested in moving forward with your application. Expect to hear from them soon about next steps.</p>'
                : status === 'rejected'
                ? '<p>While we appreciate your interest, the team has decided to move forward with other candidates. Keep applying - the right opportunity is out there!</p>'
                : status === 'accepted'
                ? '<p>Congratulations! You\'ve been selected for this position. The team will reach out with next steps soon.</p>'
                : '<p>Your application is currently being reviewed by the hiring team. We\'ll notify you of any updates.</p>'
              }
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/applications/${applicationId}" class="button">View Application</a>
              <p>Best regards,<br>The GHL Hire Team</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} GHL Hire. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
  }),

  // Job alert notification
  jobAlert: (candidateName: string, alertTitle: string, matchingJobs: Array<{title: string, company: string, id: string}>) => ({
    subject: `New Jobs Match Your Alert: ${alertTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
            .job-card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; margin: 10px 0; }
            .job-title { font-size: 18px; font-weight: bold; color: #2563eb; margin-bottom: 5px; }
            .job-company { color: #6b7280; }
            .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Jobs Match Your Alert!</h1>
            </div>
            <div class="content">
              <p>Hi ${candidateName},</p>
              <p>We found ${matchingJobs.length} new job${matchingJobs.length > 1 ? 's' : ''} matching your alert: <strong>${alertTitle}</strong></p>
              ${matchingJobs.slice(0, 5).map(job => `
                <div class="job-card">
                  <div class="job-title">${job.title}</div>
                  <div class="job-company">${job.company}</div>
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/jobs/${job.id}" style="color: #2563eb; text-decoration: none;">View Job →</a>
                </div>
              `).join('')}
              ${matchingJobs.length > 5 ? `<p>And ${matchingJobs.length - 5} more...</p>` : ''}
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/jobs" class="button">View All Jobs</a>
              <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/job-alerts">Manage your job alerts</a>
              </p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} GHL Hire. All rights reserved.</p>
              <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/notifications/preferences">Email Preferences</a></p>
            </div>
          </div>
        </body>
      </html>
    `
  }),

  // Password reset
  passwordReset: (resetLink: string) => ({
    subject: 'Reset Your Password - GHL Hire',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
            .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <p>We received a request to reset your password for your GHL Hire account.</p>
              <p>Click the button below to create a new password:</p>
              <a href="${resetLink}" class="button">Reset Password</a>
              <p style="font-size: 14px; color: #6b7280;">Or copy and paste this link: ${resetLink}</p>
              <div class="warning">
                <strong>Security Notice:</strong> This link will expire in 1 hour. If you didn't request this reset, please ignore this email.
              </div>
              <p>Best regards,<br>The GHL Hire Team</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} GHL Hire. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
  }),

  // Email verification
  emailVerification: (verificationLink: string, userName: string) => ({
    subject: 'Verify Your Email - GHL Hire',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
            .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Verify Your Email</h1>
            </div>
            <div class="content">
              <p>Hi ${userName},</p>
              <p>Thanks for signing up for GHL Hire! Please verify your email address to complete your registration:</p>
              <a href="${verificationLink}" class="button">Verify Email Address</a>
              <p style="font-size: 14px; color: #6b7280;">Or copy and paste this link: ${verificationLink}</p>
              <p>Once verified, you'll have full access to all features.</p>
              <p>Best regards,<br>The GHL Hire Team</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} GHL Hire. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
  }),
};

export { resend };
