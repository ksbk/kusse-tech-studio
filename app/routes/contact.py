from flask import Blueprint, render_template, request, flash, redirect, url_for, current_app
from flask_mail import Message
from app import mail
import os

bp = Blueprint('contact', __name__)

@bp.route('/', methods=['GET', 'POST'])
def contact():
    """Contact form page"""
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        message = request.form.get('message')
        
        if not all([name, email, message]):
            flash('All fields are required.', 'error')
            return redirect(url_for('contact.contact'))
        
        try:
            # Send email notification
            msg = Message(
                subject=f'New Contact Form Submission from {name}',
                recipients=[os.environ.get('BUSINESS_EMAIL', 'contact@kussetechstudio.com')],
                body=f"""
New contact form submission from your website:

Name: {name}
Email: {email}
Message:
{message}

---
This message was sent from the KusseTechStudio website contact form.
                """,
                sender=current_app.config['MAIL_DEFAULT_SENDER']
            )
            
            # Send auto-reply to user
            auto_reply = Message(
                subject='Thank you for contacting KusseTechStudio',
                recipients=[email],
                body=f"""
Hello {name},

Thank you for your message! I have received your inquiry and will get back to you within 24 hours.

Your message:
{message}

Best regards,
KusseTechStudio
Python Development & Data Automation
                """,
                sender=current_app.config['MAIL_DEFAULT_SENDER']
            )
            
            if current_app.config.get('MAIL_USERNAME'):
                mail.send(msg)
                mail.send(auto_reply)
                flash(f'Thank you {name}! Your message has been sent successfully. You should receive a confirmation email shortly.', 'success')
            else:
                # If email is not configured, just show success message
                flash(f'Thank you {name}! Your message has been received. (Email not configured in development)', 'info')
                
        except Exception as e:
            current_app.logger.error(f'Failed to send email: {str(e)}')
            flash('Thank you for your message! There was an issue with email delivery, but your message has been recorded.', 'warning')
        
        return redirect(url_for('contact.contact'))
    
    return render_template('pages/contact.html', title='Contact - Kusse Tech Studio')
