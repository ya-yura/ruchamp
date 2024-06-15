import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

# Настройки SMTP сервера
smtp_server = "mail.hosting.reg.ru"
smtp_port = 587
smtp_user = "mail@sportplatform.ru"
smtp_password = "qX5yI2cZ9nmE0kC4"

# Настройка сообщения
msg = MIMEMultipart()
msg['From'] = smtp_user
msg['To'] = "support@sportplatform.ru"
msg['Subject'] = "Test Email"

# Тело письма
body = "This is a test email"
msg.attach(MIMEText(body, 'plain'))

try:
    # Установка соединения с сервером
    server = smtplib.SMTP(smtp_server, smtp_port)
    server.set_debuglevel(1)  # Включение режима дебага для SMTP

    # Начало TLS
    server.starttls()

    # Логин на сервере
    server.login(smtp_user, smtp_password)

    # Отправка письма
    server.sendmail(smtp_user, "support@sportplatform.ru", msg.as_string())

    # Закрытие соединения
    server.quit()
    print("Email sent successfully")
except Exception as e:
    print(f"Failed to send email: {e}")
