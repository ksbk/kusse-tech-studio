from flask import Blueprint, render_template, request, flash, redirect, url_for

bp = Blueprint('contact', __name__)

@bp.route('/', methods=['GET', 'POST'])
def contact():
    """Contact form page"""
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        message = request.form.get('message')
        
        # Here you would typically save to database or send email
        # For now, just flash a success message
        flash(f'Thank you {name}! Your message has been received.', 'success')
        return redirect(url_for('contact.contact'))
    
    return render_template('pages/contact.html', title='Contact - Kusse Tech Studio')
