to installl packages :

frontend start command :
create vite@latest - to build project vite
react -> javascript 
npm install ->install the node modules
install packages: -> 👇
npm install react-router-dom react-toastify

tailwind config--👇  visit to: tailwind vite website
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

paste to this code to tailwind css file   
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

next global css file paste👇
@tailwind base;
@tailwind components;
@tailwind utilities;


npm run dev
****------------------------------------------------------------------------------------------------------------------****

backend start command:
npm init s
 npm i cors dotenv express jsonwebtoken mongoose multer nodemon razorpay stripe validator cloudinary bcrypt

npm run server
****------------------------------------------------------------------------------------------------------------------****


admin start command:
create vite@latest .

react -> javascript 
npm install 

npm i axios react-router-dom react-toastify

npm run dev
