import smtplib
from email.message import EmailMessage


def send_verification_email(username: str, email: str, token: str):
    message = EmailMessage()
    message.add_alternative(
        f"""\
<html>
  <head>

    <title>Document</title>
  </head>
  <body>
    <div id="box">
      <h2> Привет {username}, </h2>
        <p> Для завершения регистрации перейдите по
            <a href="http://localhost:8000/api/users/verify/{token}">
                ссылке
            </a>. Ссылка действительна в течении 24 часов
        </p>
      </form>
    </div>
  </body>
</html>
            """,
        subtype="html",
    )
    message["Subject"] = "Email verification"
    message["From"] = "sergey.sro@gmail.com"  # Спрятать в env
    message["To"] = email

    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login("sergey.sro@gmail.com", "pwknozpwhbjtxcmo")  # Спрятать
        server.sendmail("sergey.sro@gmail.com", email, message.as_string())
        server.quit()


def send_forgot_password_email(username: str, email: str, token: str):
    message = EmailMessage()
    message.add_alternative(
        f"""\
<html>
  <head>

    <title>Document</title>
  </head>
  <body>
    <div id="box">
      <h2> Привет {username}, </h2>
        <p> Для смены пароля перейдите по
            <a href="http://localhost:8000/change-password/{token}">
                ссылке
            </a>. Ссылка действительна в течении 24 часов
        </p>
      </form>
    </div>
  </body>
</html>
            """,
        subtype="html",
    )
    message["Subject"] = "Email forgot password"
    message["From"] = "sergey.sro@gmail.com"  # Спрятать в env
    message["To"] = email

    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login("sergey.sro@gmail.com", "pwknozpwhbjtxcmo")  # Спрятать
        server.sendmail("sergey.sro@gmail.com", email, message.as_string())
        server.quit()
