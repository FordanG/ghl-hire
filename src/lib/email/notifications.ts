import { sendEmail, emailTemplates } from './resend';
import { supabase } from '@/lib/supabase';

/**
 * Send welcome email to new user
 */
export async function sendWelcomeEmail(
  email: string,
  name: string,
  userType: 'job_seeker' | 'employer'
) {
  const template = emailTemplates.welcome(name, userType);

  try {
    await sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
    });

    // Log email
    await logEmail(email, 'welcome', template.subject);
  } catch (error) {
    console.error('Failed to send welcome email:', error);
  }
}

/**
 * Send application submitted confirmation
 */
export async function sendApplicationSubmittedEmail(
  candidateEmail: string,
  candidateName: string,
  jobTitle: string,
  companyName: string
) {
  const template = emailTemplates.applicationSubmitted(candidateName, jobTitle, companyName);

  try {
    await sendEmail({
      to: candidateEmail,
      subject: template.subject,
      html: template.html,
    });

    await logEmail(candidateEmail, 'application_submitted', template.subject);
  } catch (error) {
    console.error('Failed to send application submitted email:', error);
  }
}

/**
 * Send new application notification to employer
 */
export async function sendNewApplicationEmail(
  employerEmail: string,
  employerName: string,
  candidateName: string,
  jobTitle: string,
  applicationId: string
) {
  const template = emailTemplates.newApplication(employerName, candidateName, jobTitle, applicationId);

  try {
    await sendEmail({
      to: employerEmail,
      subject: template.subject,
      html: template.html,
    });

    await logEmail(employerEmail, 'new_application', template.subject);
  } catch (error) {
    console.error('Failed to send new application email:', error);
  }
}

/**
 * Send application status change notification
 */
export async function sendApplicationStatusEmail(
  candidateEmail: string,
  candidateName: string,
  jobTitle: string,
  companyName: string,
  status: string,
  applicationId: string
) {
  const template = emailTemplates.applicationStatusChanged(
    candidateName,
    jobTitle,
    companyName,
    status,
    applicationId
  );

  try {
    await sendEmail({
      to: candidateEmail,
      subject: template.subject,
      html: template.html,
    });

    await logEmail(candidateEmail, 'application_status_changed', template.subject);
  } catch (error) {
    console.error('Failed to send application status email:', error);
  }
}

/**
 * Send job alert notification
 */
export async function sendJobAlertEmail(
  candidateEmail: string,
  candidateName: string,
  alertTitle: string,
  matchingJobs: Array<{ title: string; company: string; id: string }>
) {
  const template = emailTemplates.jobAlert(candidateName, alertTitle, matchingJobs);

  try {
    await sendEmail({
      to: candidateEmail,
      subject: template.subject,
      html: template.html,
    });

    await logEmail(candidateEmail, 'job_alert', template.subject);
  } catch (error) {
    console.error('Failed to send job alert email:', error);
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  resetLink: string
) {
  const template = emailTemplates.passwordReset(resetLink);

  try {
    await sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
    });

    await logEmail(email, 'password_reset', template.subject);
  } catch (error) {
    console.error('Failed to send password reset email:', error);
  }
}

/**
 * Send email verification
 */
export async function sendEmailVerification(
  email: string,
  userName: string,
  verificationLink: string
) {
  const template = emailTemplates.emailVerification(verificationLink, userName);

  try {
    await sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
    });

    await logEmail(email, 'email_verification', template.subject);
  } catch (error) {
    console.error('Failed to send email verification:', error);
  }
}

/**
 * Log email send to database
 */
async function logEmail(
  emailAddress: string,
  emailType: string,
  subject: string,
  metadata?: any
) {
  try {
    await supabase.from('email_logs').insert([{
      email_address: emailAddress,
      email_type: emailType,
      subject: subject,
      status: 'sent',
      metadata: metadata || {},
    }]);
  } catch (error) {
    console.error('Failed to log email:', error);
  }
}

/**
 * Check user's email notification preferences
 */
export async function shouldSendEmail(
  userId: string,
  emailType: string
): Promise<boolean> {
  try {
    const { data: prefs } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('profile_id', userId)
      .single();

    if (!prefs) return true; // Default to sending if no preferences set

    // Check specific email preference
    switch (emailType) {
      case 'application_submitted':
      case 'application_status_changed':
      case 'new_application':
        return prefs.email_application_updates !== false;
      case 'job_alert':
        return prefs.email_job_alerts !== false;
      case 'new_job_match':
        return prefs.email_new_matches !== false;
      case 'message_received':
        return prefs.email_messages !== false;
      default:
        return true;
    }
  } catch (error) {
    console.error('Error checking email preferences:', error);
    return true; // Default to sending on error
  }
}
