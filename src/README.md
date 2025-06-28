# DharmaChain Donation Website

This is a fully functional donation website built with Next.js, allowing users to contribute to various charitable causes. It includes an admin panel for content management, a membership feature, and AI-powered tools for generating donation appeals.

---

## 📚 Documentation & Setup Guide

This guide provides step-by-step instructions for setting up and running the DharmaChain project.

### ➤ Environment Setup

Before running the project, you need to set up your environment variables. These are secret keys and configuration details that your application needs to connect to various services.

1.  **Create the Environment File:**
    - In the root of the project, you will find a file named `env.example`. This is a template of all the environment variables the project needs.
    - Make a copy of this file and rename it to `.env.local`.

2.  **Fill in the Values:**
    - Open your new `.env.local` file.
    - You will need to fill in the values for each variable by following the service-specific guides below.

**Important:** The `.env.local` file is listed in `.gitignore` and should never be committed to your repository. This keeps your secret keys safe.

---

### ➤ Google Authentication

To enable secure admin access via Google Authentication, you need to obtain OAuth 2.0 credentials from the Google Cloud Console.

**1. Create a Google Cloud Project:**
   - Go to the [Google Cloud Console](https://console.cloud.google.com/).
   - If you don't have a project yet, you will be prompted to create one. Otherwise, click the project dropdown in the top bar.
   - Click on **New Project**.
   - Give your project a name (e.g., "DharmaChain App").
   - Select an organization if applicable, otherwise leave it as "No organization".
   - Click **Create**.

**2. Configure OAuth Consent Screen:**
   - In the sidebar, navigate to **APIs & Services > OAuth consent screen**.
   - Fill in the required information (App name, User support email, Developer contact information).
   - Choose **External** user type and click **Create**.
   - Click **Save and Continue**.
   - On the Data Access page, click **Add or Remove Scopes** and add the `.../auth/userinfo.email` and `.../auth/userinfo.profile` scopes.
   - Click **Update**, then **Save and Continue**.
   - Add test users if your app is in testing mode.

**3. Create OAuth 2.0 Credentials:**
   - Go to **APIs & Services > Credentials**.
   - Click **Create Credentials > OAuth client ID**.
   - Select **Web application** as the application type.
   - Under **Authorized JavaScript origins**, add your development and production URLs (e.g., `http://localhost:3000`, `https://your-domain.com`).
   - Under **Authorized redirect URIs**, add the URLs for your authentication callback handler (e.g., `http://localhost:3000/api/auth/callback/google`, `https://your-domain.com/api/auth/callback/google`).
   - Click **Create**.

**4. Add Credentials to `.env.local`:**
   - Open your `.env.local` file and add the **Client ID** and **Client Secret** you just created to the `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` variables.
   - You also need to generate a secret for NextAuth. You can run `openssl rand -base64 32` in your terminal to create one and add it as the `NEXTAUTH_SECRET`.

---

### ➤ Database Setup (Firebase Firestore)

This project is configured to use Firebase Firestore for its database needs.

**1. Create a Firebase Project:**
   - Go to the [Firebase Console](https://console.firebase.google.com/).
   - Click **Add project** and follow the steps to create a new project.

**2. Set up Firestore:**
   - From your project's dashboard, go to **Build > Firestore Database**.
   - Click **Create database**.
   - Start in **production mode** for better security.
   - Choose a location for your database. For users in India, the recommended location is **`asia-south1` (Mumbai)**. Choosing a location close to your users can improve performance.

**3. Configure Security Rules:**
   - In the Firestore Database section, go to the **Rules** tab.
   - **This is the most critical step for securing your data.** The rules below ensure that data is publicly readable where needed (like donation categories) but writable only by authenticated users (your admins). This prevents unauthorized users from modifying your site's content.
   - Replace the default rules with the following:
     ```
     rules_version = '2';
     service cloud.firestore {
       match /databases/{database}/documents {
         // Allow public read for categories and about page content
         match /donation-categories/{docId} {
           allow read: if true;
           allow write: if request.auth.uid != null; // Restrict writes to authenticated users
         }
         match /about-content/{docId} {
           allow read: if true;
           allow write: if request.auth.uid != null;
         }
         // Restrict access to users and donations collections
         match /users/{userId} {
           allow read, write: if request.auth.uid == userId;
         }
         match /donations/{donationId} {
           allow read, write: if request.auth.uid != null;
         }
       }
     }
     ```

**4. Add Credentials to `.env.local`:**
   - In your Firebase project settings (click the gear icon), go to **Project settings**.
   - Under the **General** tab, scroll down to "Your apps".
   - If you haven't created a web app, click the web icon (`</>`) to create a new one.
   - Copy the `firebaseConfig` object values and paste them into the corresponding `NEXT_PUBLIC_FIREBASE_*` variables in your `.env.local` file.
   - **A Note on `NEXT_PUBLIC_`:** These variables are exposed to the browser. This is necessary for the Firebase client-side SDK to know which project to connect to. The security of your database is not handled by hiding these keys, but by the **Firestore Security Rules** you configured in the previous step.

**5. Database Collections Structure:**
   - `users`: Stores user information, including membership status.
   - `donations`: Records all donation transactions.
   - `donation-categories`: Stores content for each donation card (title, description, image URL).
   - `about-content`: A single document to store the content for the "About" section.

---

### ➤ Razorpay Integration (for INR Payments)

Razorpay is used for processing donations and membership fees in Indian Rupees (INR).

**1. Create a Razorpay Account:**
   - Sign up for a [Razorpay account](https://razorpay.com/).

**2. Add Credentials to `.env.local`:**
   - In your Razorpay dashboard, navigate to **Settings > API Keys**.
   - Generate a new key for both **Test Mode** and **Live Mode**.
   - Add the keys to the `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` variables in your `.env.local` file.
   - For production, use the Live Mode keys and set them as environment variables in your deployment service.

**3. Testing Without Live Payments:**
   - As is, the donation and membership buttons do not trigger a real payment. They log the submitted information to the browser console, show a success alert, and send a confirmation email via FormSubmit (see next section). This allows you to test the user interface and data flow without needing a live Razorpay account. Before deploying your site, you will need to replace this test behavior with the actual Razorpay checkout integration logic.

---

### ➤ Email Notifications via FormSubmit

FormSubmit.co is a free service used to send email notifications after a successful payment without needing a backend email server.

**1. Setup FormSubmit:**
   - Go to [FormSubmit.co](https://formsubmit.co/).
   - You don't need to register. Simply create a form in your application that posts to `https://formsubmit.co/your@email.com`.
   - The first time you submit the form, you will receive an activation email.
   - **Important:** The project is already configured to call FormSubmit. You just need to replace the placeholder email address with your own inside the `src/components/donation-dialog.tsx` file.

**2. Configure Post-Payment Trigger:**
   - After a successful payment is confirmed by Razorpay on the client-side (or after a test donation), the application programmatically creates and submits a hidden form.
   - This form will contain details of the donation or membership purchase.
     ```javascript
     // This function is already implemented in the donation dialog.
     async function sendConfirmationEmail(details) {
       const formData = new FormData();
       formData.append("name", details.name);
       formData.append("amount", details.amount);
       formData.append("message", "Thank you for your generous donation!");

       try {
         // Replace 'your@email.com' with your actual email address
         await fetch("https://formsubmit.co/your@email.com", {
           method: "POST",
           body: formData,
         });
       } catch (error) {
         console.error("Failed to send confirmation email:", error);
       }
     }
     ```

---

### ➤ Admin Panel Features

The admin panel is accessible at the `/admin` route after Google Authentication.

**How to:**
- **Change Title, Images, and Texts:** Navigate to the corresponding section in the admin dashboard (e.g., "Donation Categories", "About Section"). Forms will be available to update text fields and upload new images.
- **Add or Remove Donation Categories:** In the "Donation Categories" tab, there will be options to create a new category or delete an existing one.
- **Update the "About" Section:** Use the form in the "About Section" tab to edit the heading, descriptive text, and image.
- **Upload New Images:** Image upload fields are part of the forms for sections that contain images. *Note: The connection to a file storage service is not yet implemented.*
- **Change the Location Link:** The Google Maps link can be updated in the "About Section" management form.
- **View and Manage Users/Members:** The "Members" tab will display a list of all registered users and their membership status.
