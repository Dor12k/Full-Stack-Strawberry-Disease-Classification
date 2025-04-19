# Project Setup Guide  

Welcome! <br>
This template repository helps you set up your project quickly. Follow the steps below to configure and start working on your project.  

## 1. Navigate to the Project Folder  

```
cd my-new-project
```

## 2. Configure Git Remote

Ensure the remote repository is set correctly:

```
git remote -v
```

If you need to change the remote:

```
git remote remove origin  
git remote add origin <clone-address>
```


## 3. Create the .env File

Since the .env file is not included in this repository (for security reasons), you need to create it manually.
    
  #### a. Create a new ".env. file in the "backend-drf" folder. <br>
  
  #### b. Generate a new SECRET_KEY:
  
  use "https://djecrety.ir/" or run the following command in "backend-drf" folder and copy the output:
  
  ```
  python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
  ```
  
  #### c. Edit the .env file and add your new SECRET_KEY:
  ```
  DEBUG = True
  SECRET_KEY = your-new-secret-key-here
  ```

🔒 Security Configuration: SECRET_KEY

In order to securely run your Django app, you need to set the SECRET_KEY environment variable.

    GitHub Actions Secrets:

        Go to your GitHub repository.

        Navigate to Settings > Secrets and variables > Actions.

        Click New repository secret.

        Name the secret SECRET_KEY.

        Set its value to your Django SECRET_KEY.

    .env File: Add the SECRET_KEY to your .env file in the backend directory:

    SECRET_KEY=your-secret-key-here

Make sure to replace your-secret-key-here with your actual secret key.

You can generate a new SECRET_KEY by running the following command in a Django shell:

from django.core.management.utils import get_random_secret_key
print(get_random_secret_key())

Make sure to keep your SECRET_KEY secure and never expose it publicly

## 4. Set Up a Virtual Environment for the Backend

Create a new virtual environment:

```
python -m venv env
```

Activate the virtual environment:

On Windows:
```
env\Scripts\activate
```
On macOS/Linux:
```
source env/bin/activate
```

## 5. Install Backend Requirements

Navigate to the root folder and install dependencies:

```
pip install -r requirements.txt
```

## 6. Install Frontend Dependencies

Navigate to the frontend folder and install dependencies:

```
cd ../frontend-react  
npm install
```

## 7. Open Separate Terminals for Backend and Frontend

Backend Terminal:
```
cd backend-drf
python manage.py runserver
```

Frontend Terminal:
```
cd frontend-react
npm run dev
```

## 8. You're Ready to Go! 🚀

Your backend should now be running at http://127.0.0.1:8000/, and your frontend at http://localhost:5173/ (or another port if specified).

🎉 Happy coding!
