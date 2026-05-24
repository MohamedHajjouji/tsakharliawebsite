# Tsakhar Lia Website - Setup Instructions

## Environment Variables Setup

### Resend API Configuration

To enable form submissions via email, you need to set up a Resend API key.

#### Step 1: Create a Resend Account

1. Go to [Resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address

#### Step 2: Get Your API Key

1. Log in to your Resend dashboard
2. Navigate to **API Keys** in the left sidebar
3. Copy your API key (it starts with `re_`)

#### Step 3: Add Domain (Optional but Recommended)

For production use, you should verify your domain to send emails from a custom address:

1. Go to **Domains** in the Resend dashboard
2. Click **Add Domain**
3. Enter `tsakharlia.com` (or your domain)
4. Follow the DNS verification steps
5. Once verified, update the `from` email in `app/actions/sendEmail.ts`

#### Step 4: Create Environment File

Create a `.env.local` file in the project root:

```bash
# In the project root directory
touch .env.local
```

Add your Resend API key:

```env
RESEND_API_KEY=re_your_api_key_here
```

#### Step 5: Restart Development Server

After adding the environment variable, restart your development server:

```bash
npm run dev
```

## Testing Form Submissions

### Without Resend (Development)

The forms currently have a simulated submission mode. When `RESEND_API_KEY` is not set, forms will show a success message without actually sending emails.

### With Resend (Production)

Once you've added your API key, forms will:
1. Send an email to `contact@tsakharlia.com` with the submission details
2. Send a confirmation email to the user

## Form Types

The website has three form types:

1. **Contact Form** (`/contact`) - General inquiries and support
2. **Delivery Worker Application** (`/delivery-workers`) - Job applications
3. **Partner Application** (`/partners`) - Store partnership requests

## Email Customization

To customize the email templates, edit `app/actions/sendEmail.ts`:

- Modify the `htmlContent` variable for the admin notification email
- Modify the `confirmationHtml` variable for the user confirmation email

## Production Deployment

### Vercel

If deploying to Vercel:

1. Push your code to GitHub
2. Import the project to Vercel
3. Add the `RESEND_API_KEY` environment variable in Vercel settings
4. Deploy

### Other Platforms

For other hosting platforms, ensure you set the `RESEND_API_KEY` environment variable in your hosting platform's settings.

## Troubleshooting

### Forms Not Sending Emails

1. Check that `RESEND_API_KEY` is set correctly in `.env.local`
2. Verify your API key is valid by checking the Resend dashboard
3. Check the browser console for any errors
4. Check the server logs for Resend API errors

### Emails Going to Spam

1. Verify your domain in Resend
2. Ensure DNS records are properly configured
3. Check your email content for spam triggers

### Rate Limits

Resend free tier allows 100 emails per day. If you exceed this limit:
- Upgrade to a paid plan
- Or implement email queuing

## Support

For Resend-specific issues, refer to [Resend Documentation](https://resend.com/docs).

For website issues, contact the development team.