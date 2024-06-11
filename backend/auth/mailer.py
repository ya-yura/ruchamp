import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv
import os

load_dotenv()

EMAIL_USERNAME = os.getenv("EMAIL_USERNAME")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")
SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = int(os.getenv("SMTP_PORT"))


def send_email(subject: str, to_email: str, html_content: str):
    message = EmailMessage()
    message.add_alternative(html_content, subtype="html")
    message["Subject"] = subject
    message["From"] = EMAIL_USERNAME
    message["To"] = to_email

    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
        server.starttls()
        server.login(EMAIL_USERNAME, EMAIL_PASSWORD)
        server.sendmail(EMAIL_USERNAME, to_email, message.as_string())


def send_verification_email(username: str, email: str, token: str):
    html_content = f"""/
<html>
    <head>
        <style>
            body {{
                font-family: Arial, sans-serif;
                background-color: #000000;
                color: #ffffff;
                margin: 0;
                padding: 0;
            }}
            .container {{
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #1b1b1b;
                border-radius: 10px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }}
            .header {{
                background-color: #000000;
                color: #ffffff;
                padding: 10px 0;
                text-align: center;
                border-bottom: 2px solid #4CAF50;
            }}
            .content {{
                padding: 20px;
                color: #bfbfbf;
            }}
            .button {{
                display: inline-block;
                padding: 10px 20px;
                margin: 20px 0;
                background-color: #1E90FF;
                color: #ffffff;
                text-align: center;
                text-decoration: none;
                border-radius: 5px;
            }}
            .button:hover {{
                background-color: #1C86EE;
            }}
            .footer {{
                margin-top: 20px;
                padding: 10px 0;
                text-align: center;
                color: #bfbfbf;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Добро пожаловать на Sportplatform!</h1>
            </div>
            <div class="content">
                <p>Привет, {username}!</p>
                <p>Спасибо за регистрацию на нашем сайте для проведения спортивных мероприятий. Пожалуйста, подтвердите ваш email, перейдя по ссылке ниже:</p>
                <a href="https://sportplatform.ru/verify/{token}" class="button">Подтвердить Email</a>
                <p>Если вы не регистрировались на нашем сайте, просто проигнорируйте это письмо.</p>
                <br>
                <p>С наилучшими пожеланиями,<br>Команда Sportplatform.ru</p>
            </div>
            <div class="footer">
                <p>&copy; 2024 SportPlatform. Все права защищены.</p>
            </div>
        </div>
    </body>
    </html>
    """
    send_email("Email verification", email, html_content)


def send_forgot_password_email(username: str, email: str, token: str):
    html_content = f"""
    <html>
    <head>
        <title>Document</title>
    </head>
    <body>
        <div id="box">
            <h2>Привет {username},</h2>
            <p>Для изменения пароля перейдите по
                <a href="https://sportplatform.ru/reset-forgot-password/{token}">
                    ссылке
                </a>. Ссылка действительна в течение 24 часов.
            </p>
        </div>
    </body>
    </html>
    """
    send_email("Password reset", email, html_content)
