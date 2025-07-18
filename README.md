


# Strawberry Disease Classifier 🌱🍓

A full-stack web application that utilizes computer vision and deep learning to classify diseases in strawberry plants. Users can upload an image of a plant leaf, and the system will diagnose the disease using a pre-trained TensorFlow model. In addition, the platform includes informative articles on AI, smart agriculture, and strawberry cultivation.

Watch the video [here](https://www.youtube.com/watch?v=HJZ-G3RxmnA)

[![Watch the video](https://github.com/user-attachments/assets/2338cea4-dfdf-4e35-8dc0-f07ef569ef62)](https://www.youtube.com/watch?v=HJZ-G3RxmnA)



## About

[AIStrawberries.com](https://www.aiStrawberries.com) is an innovative platform designed for strawberry enthusiasts, farmers, and tech-savvy users alike. Our website allows users to easily classify strawberry plant leaf diseases using advanced image recognition technology. Simply upload an image, and our AI-driven system will provide an accurate diagnosis, helping you manage your strawberry crops effectively.

In addition to disease classification, aiStrawberries serves as a rich resource for articles on a variety of strawberry-related topics. Whether you're interested in sustainable agriculture practices, delicious strawberry shake recipes, or detailed information about common plant diseases, our platform has you covered.

We also feature cutting-edge articles on artificial intelligence and computer vision, exploring how these technologies are transforming agriculture and beyond. We recommend signing up for our platform and subscribing to our newsletter to receive our best articles and news before anyone else!

So click on the Subscribe button and join us to explore the world of strawberries and discover the latest advancements in AI and precision farming, all in one place! 



## Technologies

In my project, I built a full-scale web and mobile application using a modern and diverse technology stack. The backend was developed with **Python** and **Django**, later enhanced with the **Django REST Framework (DRF)** for robust and scalable API design. On the frontend, the application evolved from traditional **HTML**, **CSS**, and **JavaScript** into a modern stack with **React (via Vite)** and **Tailwind CSS**, offering a fast and responsive user interface.

To support real-time processing and performance optimization, I integrated Redis for in-memory data handling and caching. All development was conducted using Visual Studio Code, ensuring a productive and organized workflow.

The AI model for classifying strawberry diseases was built and trained using **TensorFlow**, **OpenCV**, **NumPy**, **Matplotlib**, **Pandas**, and os within **Google Colab**. You can read more about our AI model [here](https://aistrawberries.com/articles/2/).

Deployment was handled using **Docker** for containerization and **AWS EC2** for hosting, with **Nginx** configured as a reverse proxy. The application also uses **AWS S3** for file storage and **AWS RDS (PostgreSQL)** for database management. The trained TensorFlow model was deployed using **Amazon SageMaker** as a serverless endpoint.

A complementary Android application, built with **Android Studio** and **Java**, uses **TensorFlow Lite** for on-device AI inference. This enables users to diagnose strawberry plant diseases directly from their smartphones.
Learn more about our mobile app [here](https://aistrawberries.com/articles/1/).

Finally, I established a complete **CI/CD pipeline** using **Pytest**, **Jest**, and **GitHub Actions**, enabling automated testing for both backend and frontend components. The pipeline also includes Docker-based deployment to AWS EC2, ensuring consistent, reliable, and reproducible production builds


## Graph

![Project Graph](https://github.com/user-attachments/assets/9af2222c-51ee-465a-bafa-612458e9f80c)




## 🌟 Features

- 🔍 **AI-Powered Disease Classification**  
  Upload images and get real-time diagnosis using a fine-tuned ResNet50 model deployed on AWS SageMaker.

- 🧑‍💻 **User Authentication**  
  Sign up, log in, and manage your profile securely using JWT-based authentication.

- 📚 **Article System**  
  Browse, rate, and comment on articles related to AI, agriculture, and strawberries. Admins can manage content directly through the UI.

- 🧾 **User Dashboard**  
  View and update profile details including email, password, and profile image.

- 📤 **Drag & Drop Image Upload**  
  Easily upload plant images for disease classification.

- 🌐 **Responsive Design**  
  Modern UI built with Tailwind CSS and React, fully responsive with support for dark mode.

---

## 🛠️ Tech Stack

### 🔧 Backend
- Python
- Django
- Django REST Framework (DRF)
- PostgreSQL
- Redis
- JWT Authentication
- PyTest (unit/integration testing)

### 🎨 Frontend
- React.js
- Vite
- Axios with Interceptors
- Tailwind CSS
- Jest (unit/integration testing)

### 🤖 Machine Learning
- TensorFlow / Keras
- OpenCV
- Matplotlib / NumPy / Pandas
- Fine-tuned ResNet50 model (deployed on AWS SageMaker)

### ☁️ Deployment & DevOps
- AWS (EC2, S3, RDS, SageMaker, Load Balancer)
- Docker
- GitHub Actions (CI/CD)

---

AI Model:

📓 [View the Jupyter Notebook on GitHub](https://github.com/Dor12k/Full-Stack-Strawberry-Disease-Classification/blob/main/Strawberry-diseases.ipynb)


Old Version:

📓 [View old version repository](https://github.com/Dor12k/Classification_Web_Application)

