# Project Description

---

### Concept

A job board mobile app — to publish, search, and apply for jobs.  
Some users (**Recruiters**) can make posts, other users (**Job Searchers**) can like them, and then they match.  
The main goal is to make the process of applying for a job as **easy** and **fast** as possible.  
The app is focused on jobs in the **software industry**.

---

### Usage Flow

1. Users can create accounts with different roles (either a **Recruiter** or a **Job Searcher**).
2. Recruiters can create **Job Posts**.
3. Job Searchers can upload their **CVs**, review, and like Job Posts.
4. Recruiters can review and **accept** Job Searchers who previously liked their Job Posts.
5. If there's a match, Job Searchers and Recruiters can **message each other** through a chat.

---

### Key Features

- **Role-based authentication** (Recruiter or Job Searcher)
- **In-app chat**
- **User like-to-match system**
- **Push notifications** for new matches
- **Recruiter side**:
  - Job Post creation
  - Applications review
  - History and current status of Job Posts
- **Job Searcher side**:
  - Job Post review
  - CV upload
  - Skill-selection system (tech stack choice)
  - History and current status of applications

---

### Development

- **Frontend**: React Native (Expo framework)
- **Backend**: Google Firebase services:
  - Authentication
  - Firestore (document storage)
  - Cloud Storage (media files)
  - FCM and Cloud Functions (push notifications)

---

### Additional Technologies / Tools

- **TypeScript** for type checking in React Native (`.tsx`)
- **Android Emulator** via Android Studio for testing
- **Node.js APIs** for:
  - Firebase Admin SDK
  - Firebase Tools (database manipulation and server function deployment)
- **Gradle** to build the Android app (uploaded to Google Play Store for internal testing)
- **GitHub** for version control
