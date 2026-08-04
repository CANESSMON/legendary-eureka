import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging

from config import SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS

logger = logging.getLogger(__name__)

def send_otp_email(to_email: str, otp: str, purpose: str):
    """
    Sends an OTP email to the specified recipient using SMTP.
    Also prints it to the console as a fallback.
    """
    # Print to console as fallback/logging
    print(f"\n========================================\n[OTP DEBUG] Sent to: {to_email}\n[OTP DEBUG] Purpose: {purpose.upper()}\n[OTP DEBUG] OTP Code: {otp}\n========================================\n")
    
    subject = f"Your JobPortal OTP for {purpose.capitalize()}"
    
    # HTML body for professional look
    html_content = f"""
    <html>
        <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f7; color: #333333;">
            <div style="max-width: 500px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h2 style="color: #0F172A; margin: 0;">JobPortal India</h2>
                    <p style="font-size: 14px; color: #64748B; margin-top: 5px;">Secure Account Access</p>
                </div>
                <hr style="border: 0; border-top: 1px solid #E2E8F0; margin-bottom: 25px;">
                <p style="font-size: 16px; line-height: 1.5;">Hello,</p>
                <p style="font-size: 16px; line-height: 1.5;">You requested an OTP for <strong>{purpose}</strong> on JobPortal.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #2563EB; background: #EFF6FF; padding: 10px 24px; border-radius: 8px; border: 1px dashed #BFDBFE; display: inline-block;">
                        {otp}
                    </span>
                </div>
                <p style="font-size: 14px; color: #64748B; line-height: 1.5;">This code is valid for 10 minutes. Please do not share this OTP with anyone.</p>
                <hr style="border: 0; border-top: 1px solid #E2E8F0; margin-top: 25px; margin-bottom: 20px;">
                <p style="font-size: 12px; text-align: center; color: #94A3B8; margin: 0;">
                    &copy; 2026 JobPortal India. All rights reserved.
                </p>
            </div>
        </body>
    </html>
    """
    
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = SMTP_USER
    msg["To"] = to_email
    
    part = MIMEText(html_content, "html")
    msg.attach(part)
    
    try:
        server = smtplib.SMTP(SMTP_HOST, SMTP_PORT)
        server.ehlo()
        if SMTP_PORT == 587:
            server.starttls()
            server.ehlo()
        server.login(SMTP_USER, SMTP_PASS)
        server.sendmail(SMTP_USER, to_email, msg.as_string())
        server.quit()
        logger.info(f"OTP email sent successfully to {to_email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send OTP email to {to_email}: {e}")
        # We don't raise here, we allow the app to run and log the OTP in the console
        return False
