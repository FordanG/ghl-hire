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
 * Brand colors and styles
 */
const brandColors = {
  primary: '#2563eb',
  primaryDark: '#1d4ed8',
  success: '#10b981',
  successDark: '#059669',
  warning: '#f59e0b',
  error: '#ef4444',
  text: '#1f2937',
  textLight: '#6b7280',
  border: '#e5e7eb',
  background: '#f9fafb',
  white: '#ffffff',
};

/**
 * Base email layout wrapper
 */
const emailLayout = (content: string, preheader?: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>GHL Hire</title>
  ${preheader ? `<meta name="description" content="${preheader}">` : ''}
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    /* Reset */
    body, table, td, p, a, li { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }

    /* Base */
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: ${brandColors.background};
      color: ${brandColors.text};
      line-height: 1.6;
    }

    /* Links */
    a { color: ${brandColors.primary}; text-decoration: none; }
    a:hover { text-decoration: underline; }

    /* Button */
    .button {
      display: inline-block;
      background: ${brandColors.primary};
      color: ${brandColors.white} !important;
      padding: 14px 28px;
      text-decoration: none !important;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      margin: 20px 0;
      text-align: center;
    }
    .button:hover { background: ${brandColors.primaryDark}; }

    .button-success {
      background: ${brandColors.success};
    }
    .button-success:hover { background: ${brandColors.successDark}; }

    /* Mobile */
    @media screen and (max-width: 600px) {
      .container { width: 100% !important; padding: 0 16px !important; }
      .content { padding: 24px 20px !important; }
      .header { padding: 24px 20px !important; }
      .button { width: 100% !important; box-sizing: border-box; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: ${brandColors.background};">
  ${preheader ? `<div style="display: none; max-height: 0; overflow: hidden;">${preheader}</div>` : ''}

  <!-- Main Container -->
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: ${brandColors.background};">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="container" style="max-width: 600px; width: 100%;">

          <!-- Logo Header -->
          <tr>
            <td align="center" style="padding-bottom: 24px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="vertical-align: middle; padding-right: 12px;">
                    <div style="width: 40px; height: 40px; background: ${brandColors.primary}; border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="40" height="40" rx="10" fill="${brandColors.primary}"/>
                        <path d="M12 14H18V26H12V14Z" fill="white"/>
                        <path d="M22 14H28V20H22V14Z" fill="white"/>
                        <path d="M22 22H28V26H22V22Z" fill="white" fill-opacity="0.6"/>
                      </svg>
                    </div>
                  </td>
                  <td style="vertical-align: middle;">
                    <span style="font-size: 24px; font-weight: 700; color: ${brandColors.text};">GHL</span>
                    <span style="font-size: 24px; font-weight: 700; color: ${brandColors.primary};">Hire</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Email Content -->
          ${content}

          <!-- Footer -->
          <tr>
            <td style="padding-top: 32px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding: 24px; border-top: 1px solid ${brandColors.border};">
                    <!-- Social Links -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 16px;">
                      <tr>
                        <td style="padding: 0 8px;">
                          <a href="https://twitter.com/ghlhire" style="color: ${brandColors.textLight};">
                            <img src="https://cdn-icons-png.flaticon.com/24/733/733579.png" alt="Twitter" width="24" height="24" style="opacity: 0.6;">
                          </a>
                        </td>
                        <td style="padding: 0 8px;">
                          <a href="https://linkedin.com/company/ghlhire" style="color: ${brandColors.textLight};">
                            <img src="https://cdn-icons-png.flaticon.com/24/3536/3536505.png" alt="LinkedIn" width="24" height="24" style="opacity: 0.6;">
                          </a>
                        </td>
                        <td style="padding: 0 8px;">
                          <a href="https://facebook.com/ghlhire" style="color: ${brandColors.textLight};">
                            <img src="https://cdn-icons-png.flaticon.com/24/733/733547.png" alt="Facebook" width="24" height="24" style="opacity: 0.6;">
                          </a>
                        </td>
                      </tr>
                    </table>

                    <!-- Footer Text -->
                    <p style="margin: 0 0 8px; font-size: 14px; color: ${brandColors.textLight};">
                      GHL Hire - The Premier Job Board for GoHighLevel Professionals
                    </p>
                    <p style="margin: 0 0 16px; font-size: 13px; color: ${brandColors.textLight};">
                      &copy; ${new Date().getFullYear()} GHL Hire. All rights reserved.
                    </p>

                    <!-- Footer Links -->
                    <p style="margin: 0; font-size: 13px;">
                      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://ghlhire.com'}/help" style="color: ${brandColors.textLight}; margin: 0 8px;">Help Center</a>
                      <span style="color: ${brandColors.border};">|</span>
                      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://ghlhire.com'}/privacy" style="color: ${brandColors.textLight}; margin: 0 8px;">Privacy</a>
                      <span style="color: ${brandColors.border};">|</span>
                      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://ghlhire.com'}/notifications/preferences" style="color: ${brandColors.textLight}; margin: 0 8px;">Unsubscribe</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

/**
 * Content card wrapper
 */
const contentCard = (headerBg: string, headerContent: string, bodyContent: string) => `
<tr>
  <td>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
      <!-- Header -->
      <tr>
        <td class="header" style="background: ${headerBg}; padding: 32px 40px; text-align: center;">
          ${headerContent}
        </td>
      </tr>
      <!-- Body -->
      <tr>
        <td class="content" style="background: ${brandColors.white}; padding: 32px 40px;">
          ${bodyContent}
        </td>
      </tr>
    </table>
  </td>
</tr>
`;

/**
 * Email template utilities
 */
export const emailTemplates = {
  // Welcome email for new users
  welcome: (name: string, userType: 'job_seeker' | 'employer') => ({
    subject: 'Welcome to GHL Hire - Let\'s Get Started!',
    html: emailLayout(
      contentCard(
        `linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.primaryDark} 100%)`,
        `
          <div style="margin-bottom: 16px;">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="32" r="32" fill="rgba(255,255,255,0.2)"/>
              <path d="M32 16L38.9282 29.0718L52 32L38.9282 34.9282L32 48L25.0718 34.9282L12 32L25.0718 29.0718L32 16Z" fill="white"/>
            </svg>
          </div>
          <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: white;">Welcome to GHL Hire!</h1>
          <p style="margin: 8px 0 0; font-size: 16px; color: rgba(255,255,255,0.9);">Your journey to GoHighLevel success starts here</p>
        `,
        `
          <p style="margin: 0 0 20px; font-size: 16px; color: ${brandColors.text};">Hi ${name},</p>
          <p style="margin: 0 0 24px; font-size: 16px; color: ${brandColors.text};">
            Welcome to <strong>GHL Hire</strong> - the premier job board connecting GoHighLevel professionals with amazing opportunities!
          </p>

          ${userType === 'job_seeker' ? `
          <div style="background: ${brandColors.background}; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <p style="margin: 0 0 12px; font-weight: 600; color: ${brandColors.text};">Here's what you can do:</p>
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
              <tr>
                <td style="padding: 8px 0; vertical-align: top; width: 24px;">
                  <span style="color: ${brandColors.success}; font-size: 16px;">&#10003;</span>
                </td>
                <td style="padding: 8px 0; color: ${brandColors.text};">Browse hundreds of GHL job opportunities</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; vertical-align: top; width: 24px;">
                  <span style="color: ${brandColors.success}; font-size: 16px;">&#10003;</span>
                </td>
                <td style="padding: 8px 0; color: ${brandColors.text};">Set up job alerts for instant notifications</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; vertical-align: top; width: 24px;">
                  <span style="color: ${brandColors.success}; font-size: 16px;">&#10003;</span>
                </td>
                <td style="padding: 8px 0; color: ${brandColors.text};">Showcase your projects and skills</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; vertical-align: top; width: 24px;">
                  <span style="color: ${brandColors.success}; font-size: 16px;">&#10003;</span>
                </td>
                <td style="padding: 8px 0; color: ${brandColors.text};">Apply to jobs with one click</td>
              </tr>
            </table>
          </div>
          <p style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://ghlhire.com'}/dashboard/profile" class="button">Complete Your Profile</a>
          </p>
          ` : `
          <div style="background: ${brandColors.background}; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <p style="margin: 0 0 12px; font-weight: 600; color: ${brandColors.text};">Here's what's next:</p>
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
              <tr>
                <td style="padding: 8px 0; vertical-align: top; width: 24px;">
                  <span style="color: ${brandColors.success}; font-size: 16px;">&#10003;</span>
                </td>
                <td style="padding: 8px 0; color: ${brandColors.text};">Complete your company profile</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; vertical-align: top; width: 24px;">
                  <span style="color: ${brandColors.success}; font-size: 16px;">&#10003;</span>
                </td>
                <td style="padding: 8px 0; color: ${brandColors.text};">Post your first job opening</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; vertical-align: top; width: 24px;">
                  <span style="color: ${brandColors.success}; font-size: 16px;">&#10003;</span>
                </td>
                <td style="padding: 8px 0; color: ${brandColors.text};">Browse our talent directory</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; vertical-align: top; width: 24px;">
                  <span style="color: ${brandColors.success}; font-size: 16px;">&#10003;</span>
                </td>
                <td style="padding: 8px 0; color: ${brandColors.text};">Track applications and hire great talent</td>
              </tr>
            </table>
          </div>
          <p style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://ghlhire.com'}/company/dashboard" class="button">Get Started</a>
          </p>
          `}

          <p style="margin: 24px 0 0; font-size: 14px; color: ${brandColors.textLight};">
            Questions? Contact us at <a href="mailto:support@ghlhire.com" style="color: ${brandColors.primary};">support@ghlhire.com</a>
          </p>
        `
      ),
      `Welcome to GHL Hire - the premier job board for GoHighLevel professionals!`
    )
  }),

  // Application submitted confirmation
  applicationSubmitted: (candidateName: string, jobTitle: string, companyName: string) => ({
    subject: `Application Submitted - ${jobTitle} at ${companyName}`,
    html: emailLayout(
      contentCard(
        `linear-gradient(135deg, ${brandColors.success} 0%, ${brandColors.successDark} 100%)`,
        `
          <div style="margin-bottom: 16px;">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="32" r="32" fill="rgba(255,255,255,0.2)"/>
              <path d="M26 32L30 36L38 28" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: white;">Application Submitted!</h1>
          <p style="margin: 8px 0 0; font-size: 16px; color: rgba(255,255,255,0.9);">Your application is on its way</p>
        `,
        `
          <p style="margin: 0 0 20px; font-size: 16px; color: ${brandColors.text};">Hi ${candidateName},</p>
          <p style="margin: 0 0 24px; font-size: 16px; color: ${brandColors.text};">
            Great news! Your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been successfully submitted.
          </p>

          <div style="background: ${brandColors.background}; border-radius: 8px; padding: 20px; margin-bottom: 24px; border-left: 4px solid ${brandColors.primary};">
            <p style="margin: 0 0 12px; font-weight: 600; color: ${brandColors.text};">What happens next?</p>
            <ol style="margin: 0; padding-left: 20px; color: ${brandColors.text};">
              <li style="margin-bottom: 8px;">The hiring team will review your application</li>
              <li style="margin-bottom: 8px;">You'll receive email updates as your application progresses</li>
              <li style="margin-bottom: 0;">If selected, you'll be contacted for next steps</li>
            </ol>
          </div>

          <p style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://ghlhire.com'}/dashboard/applications" class="button">Track Your Application</a>
          </p>

          <p style="margin: 24px 0 0; font-size: 16px; color: ${brandColors.text}; text-align: center;">
            Good luck! 🍀
          </p>
        `
      ),
      `Your application for ${jobTitle} at ${companyName} has been submitted successfully.`
    )
  }),

  // New application notification for employers
  newApplication: (employerName: string, candidateName: string, jobTitle: string, applicationId: string) => ({
    subject: `New Application: ${candidateName} applied for ${jobTitle}`,
    html: emailLayout(
      contentCard(
        `linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.primaryDark} 100%)`,
        `
          <div style="margin-bottom: 16px;">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="32" r="32" fill="rgba(255,255,255,0.2)"/>
              <path d="M32 20V32L40 36" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="32" cy="32" r="14" stroke="white" stroke-width="3"/>
            </svg>
          </div>
          <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: white;">New Application!</h1>
          <p style="margin: 8px 0 0; font-size: 16px; color: rgba(255,255,255,0.9);">Someone's interested in your position</p>
        `,
        `
          <p style="margin: 0 0 20px; font-size: 16px; color: ${brandColors.text};">Hi ${employerName},</p>
          <p style="margin: 0 0 24px; font-size: 16px; color: ${brandColors.text};">
            Great news! <strong>${candidateName}</strong> has applied for your <strong>${jobTitle}</strong> position.
          </p>

          <div style="background: ${brandColors.background}; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
              <tr>
                <td style="padding: 8px 0;">
                  <span style="color: ${brandColors.textLight}; font-size: 14px;">Candidate</span><br>
                  <span style="color: ${brandColors.text}; font-weight: 600;">${candidateName}</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0;">
                  <span style="color: ${brandColors.textLight}; font-size: 14px;">Position</span><br>
                  <span style="color: ${brandColors.text}; font-weight: 600;">${jobTitle}</span>
                </td>
              </tr>
            </table>
          </div>

          <p style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://ghlhire.com'}/company/dashboard/applications" class="button">Review Application</a>
          </p>

          <div style="margin-top: 24px; padding: 16px; background: #fef3c7; border-radius: 8px; border-left: 4px solid ${brandColors.warning};">
            <p style="margin: 0; font-size: 14px; color: #92400e;">
              <strong>Pro tip:</strong> Candidates appreciate quick responses. Responding within 48 hours increases your chances of securing top talent!
            </p>
          </div>
        `
      ),
      `${candidateName} just applied for your ${jobTitle} position. Review their application now!`
    )
  }),

  // Application status changed
  applicationStatusChanged: (candidateName: string, jobTitle: string, companyName: string, status: string, applicationId: string) => {
    const statusConfig: Record<string, { color: string; bg: string; icon: string; message: string }> = {
      reviewing: {
        color: brandColors.primary,
        bg: '#dbeafe',
        icon: '👀',
        message: 'Your application is being reviewed by the hiring team. We\'ll notify you of any updates.'
      },
      shortlisted: {
        color: '#059669',
        bg: '#d1fae5',
        icon: '⭐',
        message: 'Congratulations! The hiring team is interested in your profile and has shortlisted you. Expect to hear from them soon about next steps.'
      },
      interview: {
        color: '#7c3aed',
        bg: '#ede9fe',
        icon: '📅',
        message: 'Great news! You\'ve been selected for an interview. The team will reach out with scheduling details.'
      },
      rejected: {
        color: '#dc2626',
        bg: '#fee2e2',
        icon: '📝',
        message: 'Thank you for your interest. After careful consideration, the team has decided to move forward with other candidates. Keep applying - the right opportunity is out there!'
      },
      accepted: {
        color: '#059669',
        bg: '#d1fae5',
        icon: '🎉',
        message: 'Congratulations! You\'ve been selected for this position! The team will reach out soon with next steps and onboarding details.'
      },
      hired: {
        color: '#059669',
        bg: '#d1fae5',
        icon: '🎊',
        message: 'Welcome aboard! You\'ve been officially hired. The team will be in touch with onboarding information.'
      }
    };

    const config = statusConfig[status.toLowerCase()] || statusConfig.reviewing;
    const displayStatus = status.charAt(0).toUpperCase() + status.slice(1);

    return {
      subject: `Application Update: ${displayStatus} - ${jobTitle}`,
      html: emailLayout(
        contentCard(
          `linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.primaryDark} 100%)`,
          `
            <div style="margin-bottom: 16px; font-size: 48px;">${config.icon}</div>
            <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: white;">Application Update</h1>
            <p style="margin: 8px 0 0; font-size: 16px; color: rgba(255,255,255,0.9);">Your status has changed</p>
          `,
          `
            <p style="margin: 0 0 20px; font-size: 16px; color: ${brandColors.text};">Hi ${candidateName},</p>
            <p style="margin: 0 0 24px; font-size: 16px; color: ${brandColors.text};">
              Your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been updated.
            </p>

            <div style="text-align: center; margin-bottom: 24px;">
              <span style="display: inline-block; background: ${config.bg}; color: ${config.color}; padding: 12px 24px; border-radius: 50px; font-weight: 700; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px;">
                ${displayStatus}
              </span>
            </div>

            <div style="background: ${brandColors.background}; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
              <p style="margin: 0; font-size: 15px; color: ${brandColors.text}; line-height: 1.7;">
                ${config.message}
              </p>
            </div>

            <p style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://ghlhire.com'}/dashboard/applications" class="button">View Application</a>
            </p>
          `
        ),
        `Your application status for ${jobTitle} at ${companyName} has been updated to: ${displayStatus}`
      )
    };
  },

  // Job alert notification
  jobAlert: (candidateName: string, alertTitle: string, matchingJobs: Array<{title: string, company: string, id: string, location?: string, salary?: string}>) => ({
    subject: `🔔 ${matchingJobs.length} New Job${matchingJobs.length > 1 ? 's' : ''} Match Your Alert: ${alertTitle}`,
    html: emailLayout(
      contentCard(
        `linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.primaryDark} 100%)`,
        `
          <div style="margin-bottom: 16px;">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="32" r="32" fill="rgba(255,255,255,0.2)"/>
              <path d="M32 18V20M32 44V46M46 32H44M20 32H18M41.8 22.2L40.4 23.6M23.6 40.4L22.2 41.8M41.8 41.8L40.4 40.4M23.6 23.6L22.2 22.2" stroke="white" stroke-width="3" stroke-linecap="round"/>
              <circle cx="32" cy="32" r="8" stroke="white" stroke-width="3"/>
            </svg>
          </div>
          <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: white;">New Jobs Found!</h1>
          <p style="margin: 8px 0 0; font-size: 16px; color: rgba(255,255,255,0.9);">${matchingJobs.length} job${matchingJobs.length > 1 ? 's' : ''} matching "${alertTitle}"</p>
        `,
        `
          <p style="margin: 0 0 24px; font-size: 16px; color: ${brandColors.text};">Hi ${candidateName},</p>

          <div style="margin-bottom: 24px;">
            ${matchingJobs.slice(0, 5).map(job => `
              <div style="border: 1px solid ${brandColors.border}; border-radius: 8px; padding: 16px; margin-bottom: 12px; transition: all 0.2s;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://ghlhire.com'}/jobs/${job.id}" style="text-decoration: none;">
                  <p style="margin: 0 0 4px; font-size: 17px; font-weight: 600; color: ${brandColors.primary};">${job.title}</p>
                  <p style="margin: 0; font-size: 14px; color: ${brandColors.textLight};">${job.company}${job.location ? ` • ${job.location}` : ''}${job.salary ? ` • ${job.salary}` : ''}</p>
                </a>
              </div>
            `).join('')}
          </div>

          ${matchingJobs.length > 5 ? `
            <p style="text-align: center; margin-bottom: 24px; color: ${brandColors.textLight};">
              And ${matchingJobs.length - 5} more matching jobs...
            </p>
          ` : ''}

          <p style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://ghlhire.com'}/jobs" class="button">View All Jobs</a>
          </p>

          <p style="margin: 24px 0 0; font-size: 13px; color: ${brandColors.textLight}; text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://ghlhire.com'}/dashboard/job-alerts" style="color: ${brandColors.textLight};">Manage your job alerts</a>
          </p>
        `
      ),
      `${matchingJobs.length} new jobs match your alert "${alertTitle}". Check them out now!`
    )
  }),

  // Password reset
  passwordReset: (resetLink: string) => ({
    subject: 'Reset Your Password - GHL Hire',
    html: emailLayout(
      contentCard(
        `linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.primaryDark} 100%)`,
        `
          <div style="margin-bottom: 16px;">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="32" r="32" fill="rgba(255,255,255,0.2)"/>
              <rect x="22" y="28" width="20" height="14" rx="2" stroke="white" stroke-width="2.5"/>
              <path d="M26 28V24C26 20.6863 28.6863 18 32 18C35.3137 18 38 20.6863 38 24V28" stroke="white" stroke-width="2.5"/>
              <circle cx="32" cy="35" r="2" fill="white"/>
            </svg>
          </div>
          <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: white;">Password Reset</h1>
          <p style="margin: 8px 0 0; font-size: 16px; color: rgba(255,255,255,0.9);">Let's get you back in</p>
        `,
        `
          <p style="margin: 0 0 20px; font-size: 16px; color: ${brandColors.text};">
            We received a request to reset your password for your GHL Hire account.
          </p>
          <p style="margin: 0 0 24px; font-size: 16px; color: ${brandColors.text};">
            Click the button below to create a new password:
          </p>

          <p style="text-align: center;">
            <a href="${resetLink}" class="button">Reset Password</a>
          </p>

          <p style="margin: 24px 0; font-size: 13px; color: ${brandColors.textLight}; text-align: center; word-break: break-all;">
            Or copy this link: ${resetLink}
          </p>

          <div style="background: #fef3c7; border-radius: 8px; padding: 16px; border-left: 4px solid ${brandColors.warning};">
            <p style="margin: 0; font-size: 14px; color: #92400e;">
              <strong>Security Notice:</strong> This link expires in 1 hour. If you didn't request this reset, please ignore this email - your account is safe.
            </p>
          </div>
        `
      ),
      `Reset your GHL Hire password. This link expires in 1 hour.`
    )
  }),

  // Email verification
  emailVerification: (verificationLink: string, userName: string) => ({
    subject: 'Verify Your Email - GHL Hire',
    html: emailLayout(
      contentCard(
        `linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.primaryDark} 100%)`,
        `
          <div style="margin-bottom: 16px;">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="32" r="32" fill="rgba(255,255,255,0.2)"/>
              <path d="M20 26L32 34L44 26" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
              <rect x="18" y="22" width="28" height="20" rx="2" stroke="white" stroke-width="2.5"/>
            </svg>
          </div>
          <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: white;">Verify Your Email</h1>
          <p style="margin: 8px 0 0; font-size: 16px; color: rgba(255,255,255,0.9);">One quick step to get started</p>
        `,
        `
          <p style="margin: 0 0 20px; font-size: 16px; color: ${brandColors.text};">Hi ${userName},</p>
          <p style="margin: 0 0 24px; font-size: 16px; color: ${brandColors.text};">
            Thanks for signing up for GHL Hire! Please verify your email address to complete your registration and unlock all features.
          </p>

          <p style="text-align: center;">
            <a href="${verificationLink}" class="button button-success">Verify Email Address</a>
          </p>

          <p style="margin: 24px 0; font-size: 13px; color: ${brandColors.textLight}; text-align: center; word-break: break-all;">
            Or copy this link: ${verificationLink}
          </p>

          <div style="background: ${brandColors.background}; border-radius: 8px; padding: 16px; text-align: center;">
            <p style="margin: 0; font-size: 14px; color: ${brandColors.textLight};">
              Once verified, you'll have full access to browse jobs, apply, and connect with employers in the GoHighLevel ecosystem.
            </p>
          </div>
        `
      ),
      `Verify your email to complete your GHL Hire registration.`
    )
  }),
};

export { resend };
