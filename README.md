PROJECT DESCRIPTION
NAME: IGNACIO COUSSEAU

SHORT VERSION: Job board mobile app, developed with React Native and Google Firebase services on the backend.

LONG VERSION:
CONCEPT
A job board mobile app i.e. to publish, search and apply for jobs. In short, some users (Recruiters) can make posts, other users (Job Searchers) can like them and then they match. Main goal is to make the process of applying for a job as easy and fast as possible. The app is focused on jobs in the software industry.

USAGE FLOW 1. Users can create accounts with different roles (either a Recruiter or a Job Searcher). 2. Recruiters can make Job Posts. 3. Job Searchers can upload their CVs, review and like Job Posts. 4. Recruiters can review and accept Job Searchers that previously liked their Job Posts. 5. Job Searchers and Recruiters match and they can message each other through a chat.

KEY FEATURES
• Role based authentication (Recruiter or Job Searcher).
• In-app chat.
• User like-to-match-system.
• Push notifications for new matches.
• Recruiter side: Job Post creation, applications review, history and current status for published Job Posts.
• Job Searcher side: Job Post review, CV upload, skill-selection system (tech-stack choice), history and current status for applications.

DEVELOPMENT
Frontend: React Native, using the Expo framework.
Backend: Google Firebase services (Authentication, Firestore for document storage, Cloud Storage for media files, FCM and Cloud Functions for push notifications).
ADDITIONAL TECHNOLOGIES/TOOLS:
• TypeScript for type checking in React Native (TSX).
• Testing on Android Emulator from Android Studio.
• Node.js APIs for Firebase Admin SDK and Firebase Tools, to manipulate the database and deploy server functions, respectively.
• Gradle for making an Android build, which was uploaded to the Google Play Store for internal testing.
• GitHub for version control.
