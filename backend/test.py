'''import smtplib
from email.message import EmailMessage
import logging


# Настройки SMTP сервера
SMTP_SERVER = "mail.hosting.reg.ru"
SMTP_PORT = 587
SMTP_USER = "mail@sportplatform.ru"
SMTP_PASSWORD = "qX5yI2cZ9nmE0kC4"  # Убедитесь, что пароль правильный

logging.basicConfig(level=logging.INFO)


def send_email(subject: str, to_email: str, html_content: str):
    message = EmailMessage()
    message.set_content(html_content, subtype="html")
    message["Subject"] = subject
    message["From"] = SMTP_USER
    message["To"] = to_email

    logging.info(f"Connecting to SMTP server: {SMTP_SERVER}:{SMTP_PORT}")
    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.ehlo()  # Приветствие с сервером
            server.starttls()  # Начало TLS-сессии
            server.ehlo()  # Повторное приветствие для TLS
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.sendmail(SMTP_USER, to_email, message.as_string())
            logging.info(f"Email sent to {to_email}")
    except smtplib.SMTPException as e:
        logging.error(f"Failed to send email: {e}")


def send_verification_email(username: str, email: str, token: str):
    html_content = f"""
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
    send_email("Подтверждение Email", email, html_content)


def test_send_verification_email():
    username = "TestUser"
    email = "3201888@mail.ru"
    token = "testtoken123"
    send_verification_email(username, email, token)

if __name__ == "__main__":
    test_send_verification_email()'''


# Путь к папке с изображениями
image_folder = '/images/'
# Генерация списка имен файлов изображений (1.jpg, 2.jpg, ..., 32.jpg) - сейчас их всего 32
image_files = [f"{i}.jpg" for i in range(1, 33)]

# Получение всех событий из таблицы Event
events = session.query(Event).all()

# Обновление поля image_field для каждого события
for event in events:
    # Выбор случайного изображения
    random_image = random.choice(image_files)
    # Формирование полного пути к изображению
    event.image_field = os.path.join(image_folder, random_image)

# Сохранение изменений в базе данных
session.commit()