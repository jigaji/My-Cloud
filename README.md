How to Run
To run the project locally, follow these steps:

- Clone the repository to your local machine.

- Access backend folder : 
                cd backend

- Create db PostgreSQL 

- Create .env file and specify connetction parameters:

                DJANGO_SECRET_KEY = '<DJANGO_SECRET_KEY>'

                POSTGRES_DB = 'django_db'
                POSTGRES_USER = '<login>'
                POSTGRES_PASSWORD = '<password>'
                POSTGRES_HOST = 'http://<IP server>'
                POSTGRES_PORT = 'PORT'

- Install the required dependencies usring:
                pip install -r requirements.txt


- Do all migrations and runserver
                python manage.py makemigrations api
                python manage.py migrate
                python manage.py runserver


- Access frontend folder : 
                cd frontend

- Install the required dependencies using: 
                npm install

- Run react using: 
                npm run dev

- Update env file adding host number:
                REACT_APP_API_URL = 'http://localhost:****/'

