# CPGRAMS

A citizen-facing recreation of India’s Centralised Public Grievance Redress and Monitoring System.

Lodge a complaint with a government department, receive a registration number, and track progress in English or Hindi.

This is an independent hackathon project. It is **not** the official portal.

Official service: [https://pgportal.gov.in/](https://pgportal.gov.in/)

---

## What you can do

| Action | Route |
| --- | --- |
| Home | `/en` or `/hi` |
| File a complaint | `/en/file-complaint` |
| Track a complaint | `/en/track` |
| Officer login | `/admin/login` |

The citizen journey is:

1. Choose a category and department  
2. Describe the problem and add contact details  
3. Review answers and submit  
4. Keep the registration number  
5. Track status, timeline, and department response  

---

## Stack

- Next.js 16 and React 19  
- next-intl (English / Hindi)  
- Tailwind CSS 4  
- MongoDB with Mongoose  

---

## Run locally

Requirements: [Bun](https://bun.sh/) 1.3+ (or Node.js 20+) and a MongoDB connection string.

```bash
bun install
```

Create `.env.local` in the project root:

```
MONGODB_URI=
SESSION_SECRET=
ADMIN_ACCESS_CODE=
ADMIN_PASSWORD=
```

Start the app:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000). The home page redirects to `/en`.

Use only one dev server at a time. If port 3000 is already in use, stop the other process first.

Other commands:

```bash
bun run lint
bun run build
bun run start
```

---

## Languages

Use **EN** / **हि** in the header. Citizen pages (home, file, track) are translated. Admin screens are English.

---

## Notes

- Tracking uses the registration number. Treat it as private.  
- Admin access is a simple access-code login for the demo.  
- Supporting documents on the form are collected in the browser only unless the API is extended to store them.
