# 🔧 Troubleshooting Guide

## ❌ **Current Issues:**
1. **500 Error from Supabase** - Database schema not set up
2. **Terminal in wrong directory** - npm commands failing

## ✅ **Step-by-Step Fix:**

### **1. Fix Terminal Directory Issue**
Open a new terminal/command prompt and run:
```cmd
cd "C:\Users\giris\Downloads\attendance system\project"
dir
```
You should see `package.json` in the list.

### **2. Set Up Database (CRITICAL)**
1. Go to: https://supabase.com/dashboard
2. Select your project
3. Go to **SQL Editor**
4. Copy the entire contents of `SIMPLE_DATABASE_SETUP.sql`
5. Paste it in the SQL Editor
6. Click **Run**

### **3. Start the App**
After running the SQL:
```cmd
cd "C:\Users\giris\Downloads\attendance system\project"
npm run dev
```

### **4. Test the App**
- Go to `http://localhost:5174/` (or whatever port it shows)
- Try signing up with a new account
- The 500 errors should be gone!

## 🚨 **If Still Getting Errors:**

### **Check Database Connection:**
- Make sure your Supabase URL and key are correct
- Check if the tables were created in Supabase dashboard

### **Check Terminal:**
- Make sure you're in the project directory
- Run `npm install` if needed

### **Check Browser Console:**
- Press F12 in browser
- Look for specific error messages

## 📞 **Quick Test:**
1. Run the simple SQL script
2. Start the app: `npm run dev`
3. Open browser to the localhost URL
4. Try signing up

**The 500 error means the database tables don't exist yet - run the SQL script first!** 🎯





