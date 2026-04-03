# Society Financial Management Web App

A full-stack application for managing society members, maintenance payments, and expenses, built with React, Node.js + Express, and Oracle XE.

[TOC]

## Prerequisites
- Node.js (v18+ recommended)
- **Oracle XE Database** (locally installed)

## 1. Database Setup (Crucial)
You MUST have Oracle XE running on your local machine.

### Install Oracle XE
1. Download Oracle XE 21c from: https://www.oracle.com/database/technologies/xe-downloads.html
2. Install on your machine (default SID: `XE`)
3. After installation, ensure the Oracle service is running

### Create User and Tables
1. Connect to Oracle XE using SQL*Plus or any SQL tool (DBeaver, SQL Developer, etc.) with `sys as sysdba`:
   - Host: `localhost`
   - Port: `1521`
   - SID: `XE`

2. Run the contents of `schema.sql` to create tables and sequences:
   ```sql
   sqlplus> @schema.sql
   ```
   Or copy-paste the contents from `schema.sql` and execute in your SQL tool.

3. Verify the user `MYUSER` was created with the correct credentials (used in the backend connection).

## 2. Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the backend folder (or verify it exists) with:
   ```env
   DB_USER=MYUSER
   DB_PASSWORD=MYPASSWORD
   DB_CONNECTION_STRING=localhost:1521/xe
   ```
4. Start the server (runs on port 5000 by default):
   ```bash
   node server.js
   ```

## 3. Frontend Setup
1. Open a *new* terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server (runs on port 5173 by default):
   ```bash
   npm run dev
   ```

## 4. Usage
Open your browser to `http://localhost:5173`.
- **Username:** `admin`
- **Password:** `admin123`

You will have access to the dashboard featuring summaries, member CRUD operations, payments tracking, and expense logging with responsive, modern UI!
