# Realtime Collaborative Text Editor 📝

Welcome to our collaborative text editor project! This application allows multiple users to edit documents in real-time, fostering seamless collaboration. Whether you're working on a team project, taking meeting notes, or brainstorming ideas, this text editor has you covered!

## Features 🚀

- **Real-time Editing:** Witness changes made by other users in real-time.
- **Rich Text Formatting:** Leverage a variety of formatting options provided by the Quill editor.
- **Collaborative Editing:** Work together with others on the same document effortlessly.

## How to Use 📖

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/Abhisekh8421/Collaborative-Document-Editing-System.git
   ```

2. **Install Dependencies:**

   ```bash
   cd collaborative-text-editor
   npm install
   ```

3. **Start the Server:**

   ```bash
   npm start
   ```

4. **Open the Application:**
   Open your browser and go to [http://localhost:5173/](http://localhost:5173/)

5. **Collaborate in Real-time:**
   Share the document link with others to collaborate seamlessly!

## Technologies Used 💻

- **React:** Frontend library for building user interfaces.
- **Quill:** A modern WYSIWYG editor for rich text editing.
- **Socket.IO:** Enables real-time, bidirectional, and event-based communication.

## Project Structure 📂

- **client:** React application for the frontend.
- **server:** Node.js server handling Socket.IO connections.

## How It Works 🔄

1. Users connect to the server using Socket.IO.
2. Upon connecting, users receive a unique socket ID.
3. Users can create or join a document by navigating to the specified URL.
4. Quill editor is initialized for collaborative text editing.

Feel free to explore, contribute, and enhance the collaborative text editor experience!

👩‍💻 Happy Collaborating! 👨‍💻
