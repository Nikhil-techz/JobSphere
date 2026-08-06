from config.settings import settings
from config.configuration import BASE_DIR
from fastapi_mail import FastMail, ConnectionConfig, MessageSchema, MessageType

con = ConnectionConfig(
    MAIL_USERNAME = settings.MAIL_USERNAME,
    MAIL_PASSWORD = settings.MAIL_PASSWORD,
    MAIL_FROM=      settings.MAIL_FROM,
    MAIL_PORT =     settings.MAIL_PORT,
    MAIL_SERVER =   settings.MAIL_SERVER,
    MAIL_FROM_NAME = settings.MAIL_FROM_NAME,
    MAIL_STARTTLS =  settings.MAIL_STARTTLS,
    MAIL_SSL_TLS =  settings.MAIL_SSL_TLS,
    VALIDATE_CERTS = settings.MAIL_VALIDATE_CERTS,
    TEMPLATE_FOLDER = BASE_DIR/"email_templates"
) 

async def send_welcome_email(
        recipient_email:str,
        username:str
):
    message = MessageSchema(
        subject = "Welcome to JobSphere",
        recipients = [recipient_email],
        subtype = MessageType.html,
        template_body = {
                "username": username
            }
    )
    

    fm = FastMail(con)
    await fm.send_message(
        message = message,
        template_name = "welcome.html",
        
    )

#############################################################################

async def application_submitted_email(
        recipient_email:str,
        username:str,
        Job_title:str,
        company_name:str
):
    message = MessageSchema(
        subject = "Application Status",
        recipients = [recipient_email],
        subtype = MessageType.html,
        template_body = {
            "username": username,
            "job_title":Job_title,
            "company_name":company_name
        }
    )
    fm = FastMail(con)
    await fm.send_message(
        message = message,
        template_name = "application_confirmation.html"
    )
    

####################################################################################

async def send_reset_password_success(
    recipient_email: str,
    username: str
):
    message = MessageSchema(
        subject="Password Reset successfuly",
        recipients=[recipient_email],
        subtype=MessageType.html,
        template_body={
            "username": username
        }
    )

    fm = FastMail(con)

    await fm.send_message(
        message=message,
        template_name="first_login.html"
    )

##########################################################################################

async def send_application_status_email(
    recipient_email: str,
    username: str,
    job_title: str,
    status: str
):
    message = MessageSchema(
        subject="Application Status Updated",
        recipients=[recipient_email],
        subtype=MessageType.html,
        template_body={
            "username": username,
            "job_title": job_title,
            "status": status
        }
    )

    fm = FastMail(con)

    await fm.send_message(
        message=message,
        template_name="application_status.html"
    )


######################################################################################

async def send_password_reset_email(
    recipient_email: str,
    username: str,
    reset_link: str
):
    message = MessageSchema(
        subject="Reset Your Password",
        recipients=[recipient_email],
        subtype=MessageType.html,
        template_body={
            "username": username,
            "reset_link": reset_link
        }
    )

    fm = FastMail(con)

    await fm.send_message(
        message=message,
        template_name="reset_password.html"
    )


####################################################################################

async def send_email_verification_email(
    recipient_email: str,
    username: str,
    verification_link: str
):
    message = MessageSchema(
        subject="Verify Your Email",
        recipients=[recipient_email],
        subtype=MessageType.html,
        template_body={
            "username": username,
            "verification_link": verification_link
        }
    )

    fm = FastMail(con)

    await fm.send_message(
        message=message,
        template_name="email_verification.html"
    )

    