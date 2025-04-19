


# Full-Stack Application (Django + React + DRF)

This project is a full-stack web application built with **Django** and **Django Rest Framework (DRF)** for the backend, and **React** with **Vite** for the frontend. The application features user authentication, a profile page, and a dashboard.

---

## 🛠️ **Tech Stack**

- **Backend**: Python, Django, Django Rest Framework (DRF), JWT Authentication, Custom User Model
- **Frontend**: React, Vite, Tailwind CSS
- **Database**: SQLite (default for Django development)
- **Authentication**: JWT, Custom User model with a CustomUserManager
- **Deployment**: [Insert deployment platform here if applicable, e.g., Vercel, Render]

---

## 🚀 **Features**

- **Homepage**: Simple UI with `Sign Up` and `Sign In` buttons.
- **Authentication**: 
  - Custom user model for handling users.
  - JWT authentication for secure login and registration.
  - Pop-up modals for user sign-up and sign-in.
- **Profile**:
  - Registered users can navigate to their profile page.
  - Users can update their profile information, including first name, last name, and email.
- **Dashboard**: Accessible to logged-in users.

---

## ⚙️ **Setup & Installation**

### Backend Setup (Django + DRF)
Clone the repository:
    ```bash

    git clone https://github.com/yourusername/your-repository.git
    cd your-repository/backend-drf

Create a virtual environment:
    
    python3 -m venv venv
    venv\Scripts\activate  # On Linux use source venv/bin/activate : 

Install dependencies:

pip install -r requirements.txt

📁 Before running the project, create the following folders in backend-drf folder:

    static/
    `media/

Navigate to backn=end-drf

  cd backend-drf
  
Run migrations:

python manage.py migrate

Start the Django server:

    python manage.py runserver

### Frontend Setup (React + Vite)

    Navigate to the frontend directory:

cd ../frontend-react

Install dependencies:

npm install

Start the React development server:

    npm run dev

---

## 🔐 **Authentication Flow**

- **Sign Up**: New users can create an account via the Sign Up modal.
- **Sign In**: Existing users can log in using the Sign In modal.
- **Profile Update**: Users can navigate to their Profile page and update their details.
- **Dashboard**: After successful authentication, users are redirected to the Dashboard.

---

## 🧑‍💻 **Running Tests**

- **Backend Tests (Django)**:
  ```bash
  pytest
  ```

- **Frontend Tests (React)**:
  ```bash
  npm test
  ```

---

## 📦 **Deployment**

- **Backend**: Deploy the Django app to your preferred hosting platform (e.g., Render, Heroku).
- **Frontend**: Deploy the React app to Vercel or Netlify.

---

## 📜 **Future Enhancements**

- Add password reset functionality.
- Integrate frontend with backend API to fetch and update user profile data.
- Implement more advanced user features like user roles, permissions, and email notifications.

---

## 🤝 **Contributing**

- Fork the repository.
- Create a new branch for your feature (`git checkout -b feature/your-feature`).
- Commit your changes (`git commit -am 'Add new feature'`).
- Push to the branch (`git push origin feature/your-feature`).
- Open a pull request.

---

