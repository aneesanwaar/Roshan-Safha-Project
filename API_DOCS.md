
# Roshan Safha API Documentation
This document outlines the backend API endpoints, security protocols, validation standards, and data structures for the Roshan Safha project.

## Global Requirements
Every ingestion request to this API must satisfy:

* **Spam Protection:** Google reCAPTCHA v2/v3 verification (`recaptchaToken`). Automatically bypassed in local development environments.
* **Validation:** Strict server-side schema validation via `express-validator` returning uniform error envelopes.
* **Pakistani Mobile Validation:** All phone fields validate against standard national and international dialing formats (`03XXXXXXXXX`, `+923XXXXXXXXX`, `00923XXXXXXXXX`).
* **Notifications:** Non-blocking automated dual-email system (Admin notification + Submitter confirmation) via Nodemailer.
* **Cloud Storage:** All media and documents are hosted securely on Cloudinary.
* **Global File Access Pattern:** `GET https://res.cloudinary.com/[cloud_name]/...`
* **Security:** Admin-only routes are protected via JWT (`Authorization: Bearer <token>`).

---

### 1. Book Donations
**Endpoint:** `/api/donations`

#### [POST] Create a Donation Pledge
Registers a donor pledge to donate used or syllabus textbooks.

* **Access:** Public
* **Security:** `verifyRecaptcha` + `donationValidationRules` + `validate`
* **Content-Type:** `application/json`

**Body (JSON):**
```json
{
  "name": "String (Required, 2-80 chars)",
  "email": "String (Required, valid email format)",
  "phone": "String (Required, Pakistani mobile number)",
  "city": "String (Optional, defaults to 'Muzaffarabad')",
  "numberOfBooks": "Number (Required, integer >= 1)",
  "bookTypes": "String (Optional, categories or syllabus names)",
  "dropoffMethod": "String (Required, 'Drop-off' or 'Pickup Required')",
  "message": "String (Optional, condition notes)",
  "recaptchaToken": "String (Required in production)"
}

```

**Success Response (`201 Created`):**

```json
{
  "success": true,
  "message": "Donation registered successfully.",
  "data": {
    "_id": "6740b2f91a5e123456789abc",
    "name": "Hamid Bashir",
    "email": "hamidbashir345@gmail.com",
    "phone": "03111234565",
    "city": "Muzaffarabad",
    "numberOfBooks": 5,
    "bookTypes": "Primary & Middle School Books",
    "dropoffMethod": "Drop-off",
    "message": "Condition: Good. Notes: Science textbooks",
    "createdAt": "2026-09-28T19:04:33.000Z",
    "__v": 0
  }
}

```

**Validation Error Response (`400 Bad Request`):**

```json
{
  "success": false,
  "error": "Enter a valid Pakistani mobile number (e.g., 03001234567 or +923001234567)",
  "errors": [
    {
      "type": "field",
      "value": "12345",
      "msg": "Enter a valid Pakistani mobile number (e.g., 03001234567 or +923001234567)",
      "path": "phone",
      "location": "body"
    }
  ]
}

```

#### [GET] View All Donations

Retrieve all donation pledges sorted in reverse chronological order.

* **Access:** Admin (Protected via JWT)
* **Response (`200 OK`):**

```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "6740b2f91a5e123456789abc",
      "name": "Hamid Bashir",
      "email": "hamidbashir345@gmail.com",
      "phone": "03111234565",
      "city": "Muzaffarabad",
      "numberOfBooks": 5,
      "bookTypes": "Primary & Middle School Books",
      "dropoffMethod": "Drop-off",
      "message": "Condition: Good",
      "createdAt": "2026-09-28T19:04:33.000Z"
    }
  ]
}

```

---

### 2. Volunteer Registration

**Endpoint:** `/api/volunteers`

#### [POST] Register a Volunteer

Apply to become an active volunteer for community and distribution drives.

* **Access:** Public
* **Security:** `verifyRecaptcha` + `volunteerValidationRules` + `validate`
* **Content-Type:** `application/json`

**Body (JSON):**

```json
{
  "name": "String (Required)",
  "email": "String (Required, valid email)",
  "phone": "String (Required, Pakistani mobile number)",
  "city": "String (Optional)",
  "skills": "String (Required, interests or expertise)",
  "availability": "String (Optional, e.g. 'Weekends', 'Full-time')",
  "recaptchaToken": "String (Required in production)"
}

```

**Success Response (`201 Created`):**

```json
{
  "success": true,
  "message": "Volunteer registration submitted successfully.",
  "data": {
    "_id": "6740b3aa1a5e123456789abd",
    "name": "Fatima Noor",
    "email": "fatima@example.com",
    "phone": "03011234567",
    "city": "Muzaffarabad",
    "skills": "Book sorting, English tutoring",
    "availability": "Weekends",
    "createdAt": "2026-09-28T19:15:10.000Z"
  }
}

```

#### [GET] View All Volunteers

* **Access:** Admin (Protected via JWT)
* **Response (`200 OK`):** List of registered volunteers.

---

### 3. General Contact Inquiries

**Endpoint:** `/api/contact`

#### [POST] Send a Message

General inquiries and feedback from website visitors.

* **Access:** Public
* **Security:** `verifyRecaptcha` + `contactValidationRules` + `validate`
* **Content-Type:** `application/json`

**Body (JSON):**

```json
{
  "name": "String (Required)",
  "email": "String (Required, valid email)",
  "subject": "String (Required)",
  "message": "String (Required, min 10 chars)",
  "recaptchaToken": "String (Required in production)"
}

```

#### [GET] View All Messages

* **Access:** Admin (Protected via JWT)
* **Response (`200 OK`):** List of contact inquiries.

---

### 4. Event Registration

**Endpoint:** `/api/events`

#### [POST] Register for Event

Sign up attendees for reading drives, webinars, and book fairs.

* **Access:** Public
* **Security:** `verifyRecaptcha` + `eventValidationRules` + `validate`
* **Content-Type:** `application/json`

**Body (JSON):**

```json
{
  "name": "String (Required)",
  "email": "String (Required, valid email)",
  "phone": "String (Required, Pakistani mobile number)",
  "eventName": "String (Required)",
  "attendees": "Number (Required, min 1)",
  "message": "String (Optional)",
  "recaptchaToken": "String (Required in production)"
}

```

#### [GET] View Attendees

* **Access:** Admin (Protected via JWT)
* **Response (`200 OK`):** List of all registered attendees.

---

### 5. Collaboration & Partnerships

**Endpoint:** `/api/collaborations`

#### [POST] Propose Partnership

Institutional and corporate collaboration proposals.

* **Access:** Public
* **Security:** `verifyRecaptcha` + `collabValidationRules` + `validate`
* **Constraints:** One active proposal per unique organization email.
* **Content-Type:** `application/json`

**Body (JSON):**

```json
{
  "name": "String (Required)",
  "organization": "String (Required)",
  "email": "String (Required, valid email)",
  "phone": "String (Required, Pakistani mobile number)",
  "collabType": "String (Required, e.g. 'School Drive', 'Sponsorship')",
  "message": "String (Required, min 20 chars)",
  "recaptchaToken": "String (Required in production)"
}

```

#### [GET] View Proposals

* **Access:** Admin (Protected via JWT)
* **Response (`200 OK`):** List of all collaboration inquiries.

---

### 6. Essay Contest Submission

**Endpoint:** `/api/essays`

#### [POST] Submit a Contest Entry

Upload participant details and an attached essay document.

* **Access:** Public
* **Security:** `verifyRecaptcha` + File Extension Filtering
* **Content-Type:** `multipart/form-data`

**Body (Form-Data):**

| Key | Type | Constraints | Description |
| --- | --- | --- | --- |
| `name` | String | Required | Participant's full name |
| `email` | String | Required, Unique | One entry per participant |
| `phone` | String | Required | Pakistani mobile number |
| `institution` | String | Required | School, College, or University |
| `essayTitle` | String | Required | Title of the essay |
| `recaptchaToken` | String | Required in prod | Spam prevention token |
| `essayFile` | **File** | **Required** | **.pdf, .doc, .docx (Max 5MB)** |

**Key Backend Features:**

* **Dynamic Cloud Naming:** Uploaded files stored as `[Category]_[Name]_[Timestamp]` on Cloudinary.
* **Dual Notifications:** Dispatches confirmation to participant and admin with Cloudinary `fl_attachment` download link.
* **Rollback Cleanup:** If database persistence fails after file upload, `cloudinary.uploader.destroy()` is invoked immediately to prevent orphaned storage waste.

#### [GET] View All Submissions

* **Access:** Admin (Protected via JWT)
* **Response (`200 OK`):** List of submitted essays with direct attachment URLs.

#### [PATCH] Update Submission Status

* **Endpoint:** `/api/essays/:id/status`
* **Access:** Admin (Protected via JWT)
* **Body (JSON):** `{ "status": "Under Review" | "Shortlisted" | "Rejected" | "Winner" }`

---

### 7. Gallery Module

**Endpoint:** `/api/gallery`

#### [GET] View Gallery Items

* **Access:** Public
* **Response (`200 OK`):** Array of gallery images sorted by recency.

#### [POST] Add Photo

* **Access:** Admin (Protected via JWT)
* **Content-Type:** `multipart/form-data`

| Key | Type | Description |
| --- | --- | --- |
| `title` | String | Caption for photo |
| `category` | String | "Event", "Donation", "Workshop", "Other" |
| `imageFile` | File | JPG/PNG (Automatically resized to 1000px width via Cloudinary transform) |

---

### 8. Announcements

**Endpoint:** `/api/announcements`

#### [GET] View Announcements

* **Access:** Public
* **Response (`200 OK`):** Active organization announcements and updates.

#### [POST] Create Announcement

* **Access:** Admin (Protected via JWT)
* **Content-Type:** `multipart/form-data` or `application/json`

| Key | Type | Description |
| --- | --- | --- |
| `title` | String | Headline (Required) |
| `content` | String | Detailed body copy (Required) |
| `image` | File | Optional banner or thumbnail image |

---

## Standard Error Response Envelopes

The API standardizes error responses with both an `error` summary string (for frontend toast/alert banners) and an `errors` array (for field-level highlights):

```json
{
  "success": false,
  "error": "Human readable primary error message",
  "errors": [
    {
      "type": "field",
      "value": "invalid_value",
      "msg": "Specific validation description",
      "path": "fieldName",
      "location": "body"
    }
  ]
}

```

### HTTP Status Code Index

* **`200 OK`**: Successful query retrieval (`GET`, `PATCH`).
* **`201 Created`**: Successful entity creation and email dispatch trigger (`POST`).
* **`400 Bad Request`**: Validation failed or duplicate record constraint violated.
* **`401 Unauthorized`**: Missing or invalid JWT Bearer token.
* **`403 Forbidden`**: Invalid or missing reCAPTCHA token in production.
* **`404 Not Found`**: Target endpoint or document ID does not exist.
* **`500 Internal Server Error`**: Database connection fault or unexpected exception.

---

## Security & Architecture Layers

1. **Spam Layer (`verifyRecaptcha`):** Inspects incoming tokens with Google's site verify API. Automatically passes through in non-production environments to streamline development.
2. **Validation Layer (`validators.js`):** Sanitizes and validates request bodies via `express-validator` chains before reaching business controllers.
3. **Controller Layer (`controllers/*`):** Executes core database transactions following MVC architecture.
4. **Resilient Notification Layer (`emailService.js`):** Dispatches transactional emails in background `try...catch` blocks to protect database write responses from SMTP connection faults.
5. **Storage Cleanup Sync:** Cloudinary files are cleanly purged if MongoDB schema validation fails after upload.
6. **Authentication Layer (`protect`):** Secures admin moderation routes via JWT signature verification.


---