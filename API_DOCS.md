# Roshan Safha API Documentation
This document outlines the backend API endpoints, security protocols, and data structures for the Roshan Safha project.

## Global Requirements
Every POST request to this API must satisfy:

* **Spam Protection:** Google reCAPTCHA v2/v3 verification.

* **Validation:** Server-side schema validation via express-validator.

* **Notifications:** Automated dual-email system (Admin notification + Submitter confirmation).

* **Cloud Storage:** All media (images/documents) are hosted on Cloudinary.

* **Data Integrity:** Unique constraints on specific fields (Email) to prevent redundant entries.

* **Global File Access:**
URL Pattern: GET https://res.cloudinary.com/[cloud_name]/...

* **Security:** Admin-only routes are protected via JWT (JSON Web Tokens).

---
### 1. Book Donations
**Endpoint:** /api/donations

**[POST]** ``Create a Donation``
Submit a request to donate books.

**Security:** reCAPTCHA + Input Validation.

**Body (JSON):**

```JSON
{
  "name": "String (Required)",
  "email": "String (Valid Email)",
  "phone": "String",
  "city": "String",
  "numberOfBooks": "Number",
  "dropoffMethod": "String ('Pickup' or 'Drop-off')",
  "message": "String (Optional)",
  "recaptchaToken": "String (Required in production)"
}
```
**Success Response:** ``201 Created``

**Features:** Sends confirmation to donor and notification to admin.

---
### 2. Volunteer Registration
**Endpoint:** ``/api/volunteers``

**[POST]** ``Register a Volunteer``
Apply to become a volunteer for the organization.

**Security:** reCAPTCHA + Input Validation.

**Body (JSON):**

```JSON
{
  "name": "String (Required)",
  "age": "Number (Required)",
  "email": "String (Valid Email)",
  "phone": "String",
  "city": "String",
  "skills": "String",
  "availability": "String",
  "recaptchaToken": "String (Required in production)"
}
```
**Success Response:** ``201 Created``

---

### 3. General Contact Inquiries
**Endpoint:** ``/api/contact``

**[POST]** ``Send a Message`` | **[GET]** ``View All Messages``

**Body (JSON):**

```JSON
{
  "name": "String",
  "email": "String",
  "subject": "String",
  "message": "String (Min 10 chars)",
  "recaptchaToken": "String"
}
```
---
### 4. Event Registration
**Endpoint:** ``/api/events``

**[POST]** ``Register for Event`` | **[GET]** ``View Attendees``

**Body (JSON):**

```JSON
{
  "name": "String",
  "email": "String",
  "phone": "String",
  "eventName": "String",
  "attendees": "Number (Min 1)",
  "message": "String",
  "recaptchaToken": "String"
}
```
---
### 5. Collaboration & Partnerships
**Endpoint:** ``/api/collaborations``

**[POST]** ``Propose Partnership`` | **[GET]** ``View Proposals``

**Constraints:** Email must be unique.

**Body (JSON):**

```JSON
{
  "name": "String",
  "organization": "String",
  "email": "String",
  "phone": "String",
  "collabType": "String",
  "message": "String (Min 20 chars)",
  "recaptchaToken": "String"
}
```
---

### 6. Essay Contest Submission
**Endpoint:** `/api/essays`

**[POST]** ``Submit a Contest Entry``
Submit an essay along with participant details. **Note:** This endpoint requires `multipart/form-data` instead of standard JSON.

**[POST]** Submit a Contest Entry
**[GET]** View All Submissions (Admin Only)
**[PATCH]** /:id/status Update Submission Status (Admin Only)

**Security:** reCAPTCHA + JWT (for GET/PATCH) + File Extension Filtering.


**Body (Form-Data):**

| Key | Type | Description |
| :--- | :--- | :--- |
| `name` | String | Participant's full name (Required) |
| `email` | String | Valid Email (Unique - one entry per person) |
| `phone` | String | Contact number (Required) |
| `institution` | String | Name of School, College, or University |
| `essayTitle` | String | The title of the submitted essay |
| `recaptchaToken` | String | Required for production spam protection |
| `essayFile` | **File** | **Required (.pdf, .doc, .docx | Max 5MB)** |

**Success Response:** ``201 Created``

**Key Features:**
* **Dynamic Naming:** Files named as Category_Name_Timestamp in Cloudinary.
* **Dual Notifications:** Automatically sends a confirmation email to the participant and a notification alert to the Admin.
* **Auto-Cleanup Logic:** If the database operation fails (e.g., duplicate email), the server automatically deletes the uploaded file to prevent "ghost files" from wasting storage.
* **Direct Download:** Admin emails include fl_attachment links for instant file downloading.

---


### 7. Gallery Module
**Endpoint:** /api/gallery

**[POST]** Add Photo (Admin Only) | **[GET]** View Gallery (Public)

**Body (Form-Data):**

| Key | Type | Description |
| :--- | :--- | :--- |
| `title` | String | Caption for the photo |
| `category` | String | "Event, Donation, Workshop, Other" |
| `imageFile` | File | JPG/PNG (Auto-resized to 1000px width) |


---

### 8. Announcements
**Endpoint:** /api/announcements

**[POST]** Create Announcement (Admin Only) | **[GET]** View All

**Body (Form-Data):**

| Key | Type | Description | 
| :--- | :--- | :--- |
| title | String | Headline | 
| content | String | Detailed body text | 
| image | File | Optional | thumbnail image | 

---

## Error Handling Standards

The API uses standard HTTP status codes:

* 201: Success (Resource Created)

* 400: Validation Error / Duplicate Entry

* 403: reCAPTCHA Verification Failed

* 500: Internal Server Error (Database/SMTP issues)
---

## Security & Architecture

* **Middleware Pipeline**
The backend utilizes a modular middleware approach to ensure data integrity:

* **Spam Layer:** verifyRecaptcha checks for bot activity.

* **Validation Layer:** validators.js ensures data types and lengths are correct.

* **Service Layer:** emailService.js handles external SMTP communications via Nodemailer.

* **Clean-Sync:** If MongoDB fails, the system automatically triggers cloudinary.uploader.destroy to remove orphaned files.

* **Auth Layer:** protect middleware using JWT.

---



