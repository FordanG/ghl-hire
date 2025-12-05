# Email Setup Guide - GHL Hire

**Date**: 2025-12-05
**Author**: Claude
**Status**: Approved
**Last Updated**: 2025-12-05

## Overview

GHL Hire uses two email systems:
1. **Resend** - For transactional emails (application notifications, status updates, job alerts)
2. **Supabase Auth** - For authentication emails (verification, password reset, magic links)

## 1. Resend Setup

### 1.1 Create Resend Account

1. Go to [resend.com](https://resend.com) and create an account
2. Verify your email address
3. Add and verify your domain (e.g., `ghlhire.com`)

### 1.2 Add DNS Records

In your domain's DNS settings, add the records provided by Resend:

```
Type: TXT
Name: resend._domainkey
Value: [provided by Resend]

Type: TXT
Name: @
Value: v=spf1 include:amazonses.com ~all
```

### 1.3 Get API Key

1. Go to Resend Dashboard → API Keys
2. Create a new API key with "Full access" or "Sending access"
3. Copy the key (starts with `re_`)

### 1.4 Environment Variables

Add to your `.env` file:

```bash
# Resend Configuration
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=GHL Hire <noreply@ghlhire.com>

# App URL (for email links)
NEXT_PUBLIC_APP_URL=https://ghlhire.com
```

### 1.5 Test Email Sending

```bash
# Run a quick test
curl -X POST 'https://api.resend.com/emails' \
  -H 'Authorization: Bearer re_your_api_key' \
  -H 'Content-Type: application/json' \
  -d '{
    "from": "GHL Hire <noreply@ghlhire.com>",
    "to": ["your-email@example.com"],
    "subject": "Test Email",
    "html": "<p>This is a test email from GHL Hire</p>"
  }'
```

## 2. Supabase Auth Email Setup

Supabase Auth sends emails for:
- Email verification (sign up confirmation)
- Password reset
- Magic link login
- Email change confirmation

### 2.1 Option A: Use Resend SMTP (Recommended)

Configure Supabase to use Resend's SMTP relay for all auth emails.

#### Step 1: Get Resend SMTP Credentials

1. Go to Resend Dashboard → SMTP
2. Note your SMTP credentials:
   - Host: `smtp.resend.com`
   - Port: `465` (SSL) or `587` (TLS)
   - Username: `resend`
   - Password: Your API key (same as `RESEND_API_KEY`)

#### Step 2: Configure in Supabase Dashboard

1. Go to your Supabase project → Settings → Authentication
2. Scroll to "SMTP Settings"
3. Enable "Custom SMTP"
4. Enter the following:

```
SMTP Host: smtp.resend.com
SMTP Port: 465
SMTP User: resend
SMTP Password: re_your_api_key_here
Sender email: noreply@ghlhire.com
Sender name: GHL Hire
```

5. Click "Save"

### 2.2 Option B: Use Supabase CLI (For Local Development)

If using Supabase CLI locally, add to `supabase/config.toml`:

```toml
[auth.email]
enable_signup = true
double_confirm_changes = true
enable_confirmations = true

[auth.email.smtp]
host = "smtp.resend.com"
port = 465
user = "resend"
pass = "env(RESEND_API_KEY)"
admin_email = "noreply@ghlhire.com"
sender_name = "GHL Hire"
```

### 2.3 Customize Auth Email Templates

1. Go to Supabase Dashboard → Authentication → Email Templates
2. Customize each template to match your branding:

#### Confirm Signup Template

```html
<h2>Welcome to GHL Hire!</h2>
<p>Hi {{ .Email }},</p>
<p>Thanks for signing up! Please confirm your email address by clicking the button below:</p>
<p>
  <a href="{{ .ConfirmationURL }}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
    Confirm Email Address
  </a>
</p>
<p>Or copy and paste this link: {{ .ConfirmationURL }}</p>
<p>Best regards,<br>The GHL Hire Team</p>
```

#### Reset Password Template

```html
<h2>Reset Your Password</h2>
<p>We received a request to reset your password for your GHL Hire account.</p>
<p>
  <a href="{{ .ConfirmationURL }}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
    Reset Password
  </a>
</p>
<p>Or copy and paste this link: {{ .ConfirmationURL }}</p>
<p><strong>Security Notice:</strong> This link will expire in 1 hour. If you didn't request this, please ignore this email.</p>
<p>Best regards,<br>The GHL Hire Team</p>
```

#### Magic Link Template

```html
<h2>Sign in to GHL Hire</h2>
<p>Click the button below to sign in to your account:</p>
<p>
  <a href="{{ .ConfirmationURL }}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
    Sign In
  </a>
</p>
<p>Or copy and paste this link: {{ .ConfirmationURL }}</p>
<p>This link will expire in 1 hour.</p>
<p>Best regards,<br>The GHL Hire Team</p>
```

## 3. Email Types & Triggers

### Resend Emails (Application Flow)

| Email Type | Trigger | Recipient |
|------------|---------|-----------|
| Welcome | User signs up | New user |
| Application Submitted | Job application created | Candidate |
| New Application | Job application created | Employer |
| Application Status Changed | Status updated by employer | Candidate |
| Job Alert | New jobs match alert criteria | Candidate |

### Supabase Auth Emails

| Email Type | Trigger | Recipient |
|------------|---------|-----------|
| Confirm Signup | New user registration | New user |
| Reset Password | Password reset requested | User |
| Magic Link | Passwordless login requested | User |
| Email Change | Email change requested | User (old & new email) |

## 4. File Structure

```
src/lib/email/
├── resend.ts          # Resend client & email templates
└── notifications.ts   # Email sending functions & logging

src/app/api/email/
├── application-submitted/route.ts  # Send on new application
└── application-status/route.ts     # Send on status change
```

## 5. Testing Checklist

- [ ] Resend API key configured in `.env`
- [ ] Domain verified in Resend
- [ ] Test transactional email sending
- [ ] Supabase SMTP configured with Resend
- [ ] Test sign up email verification
- [ ] Test password reset email
- [ ] Test application submission emails
- [ ] Test application status change emails
- [ ] Check email logs in database (`email_logs` table)

## 6. Monitoring & Logs

### Email Logs Table

All sent emails are logged to `email_logs` table:

```sql
SELECT * FROM email_logs
ORDER BY created_at DESC
LIMIT 20;
```

### Resend Dashboard

Monitor delivery rates, bounces, and complaints at:
- https://resend.com/emails

### Supabase Auth Logs

View auth email logs in Supabase Dashboard → Authentication → Logs

## 7. Troubleshooting

### Emails Not Sending

1. Check `RESEND_API_KEY` is set correctly
2. Verify domain is confirmed in Resend
3. Check server logs for errors
4. Verify email address format

### Supabase Auth Emails Not Working

1. Verify SMTP settings in Supabase Dashboard
2. Check that the API key has SMTP permissions
3. Test SMTP connection with a tool like telnet

### High Bounce Rate

1. Check SPF and DKIM records are set correctly
2. Ensure from address matches verified domain
3. Review email content for spam triggers
