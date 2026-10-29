"""Multilingual TF-IDF intent matcher for Roshan Safha.
Keeps predict_intent() contract used by ai_service/app.py.
"""
import re
import unicodedata
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

KNOWLEDGE_BASE = [
    {"intent": "donate_books", "patterns": [
        "how can i donate books", "where can i donate old textbooks", "book donation process", "i have used books to give", "can you collect books from my home", "book drop off or courier", "donate matric fsc textbooks",
        "kitabein donate karni hain", "kitab deni hai", "books donate karna chahta hoon", "purani kitabein deni hain", "kitabein kahan jama karwaun", "books ka donation kaise karun",
        "کتابیں کیسے عطیہ کریں", "میں کتابیں عطیہ کرنا چاہتا ہوں", "پرانی کتابیں کہاں جمع کروائیں", "کتابیں دینا چاہتی ہوں"
    ], "response": "You can pledge books through our Donate Books form. Our team will contact you to coordinate collection or drop-off.", "urdu_response": "آپ کتابیں عطیہ کرنے کے لیے ہماری Donate Books فارم پُر کریں۔ ہماری ٹیم کتابیں وصول کرنے یا جمع کروانے کے طریقے کے لیے آپ سے رابطہ کرے گی۔", "action_link": "/programs/donate-books#donation-form"},
    {"intent": "available_books", "patterns": [
        "how do i get free books", "i need a textbook", "search available books", "book catalog", "request class 10 physics book", "are textbooks available", "how to request a book",
        "muft kitabein chahiye", "mujhe books chahiye", "kitab mil sakti hai", "book request kaise karun", "dasween ki physics ki kitab chahiye",
        "مفت کتابیں کیسے ملیں گی", "مجھے نصابی کتاب چاہیے", "کتاب کی درخواست کیسے دوں", "دسویں جماعت کی کتاب چاہیے"
    ], "response": "Browse the Book Catalog to see available textbooks and submit a book request. Availability depends on current stock.", "urdu_response": "دستیاب نصابی کتابیں دیکھنے اور درخواست دینے کے لیے Book Catalog کھولیں۔ کتاب کی دستیابی موجودہ اسٹاک پر منحصر ہے۔", "action_link": "/programs/book-catalog"},
    {"intent": "essay_contest", "patterns": [
        "essay contest", "how to submit an essay", "essay competition rules", "essay contest deadline", "writing competition", "contest prizes", "junior senior essay categories",
        "mazmoon muqabla", "essay submit karna hai", "competition kab hai", "essay ki last date", "mazmoon likhne ka muqabla",
        "مضمون نویسی مقابلہ", "مضمون کیسے جمع کروائیں", "مقابلے کی آخری تاریخ", "مضمون کے مقابلے کی تفصیل"
    ], "response": "Visit the Essay Contests page for current topics, eligibility, submission instructions, and deadlines.", "urdu_response": "مضمون نویسی کے موجودہ موضوعات، شرائط، جمع کروانے کا طریقہ اور آخری تاریخ جاننے کے لیے Essay Contests صفحہ دیکھیں۔", "action_link": "/programs/essays#essay-submission-form"},
    {"intent": "volunteer", "patterns": [
        "how to volunteer", "volunteer registration", "join as a volunteer", "i want to help the organization", "help sort and repair books", "join your team",
        "volunteer banna hai", "razakar banna hai", "main madad karna chahta hoon", "team join karni hai", "khidmat karna chahti hoon",
        "رضاکار کیسے بنیں", "میں رضاکار بننا چاہتا ہوں", "میں آپ کی مدد کرنا چاہتی ہوں", "ٹیم میں شامل ہونا ہے"
    ], "response": "You can register your interest in volunteering through our Get Involved page.", "urdu_response": "رضاکارانہ خدمات کے لیے ہماری Get Involved صفحے پر رجسٹریشن کریں۔", "action_link": "/get-involved#volunteer-form"},
    {"intent": "location_contact", "patterns": [
        "how can i contact you", "contact details", "where are you located", "office address", "phone number", "email address", "office opening hours", "where is roshan safha based",
        "rabta kaise karun", "aap ka office kahan hai", "contact number chahiye", "office timing kya hai", "muzaffarabad mein kahan hain",
        "رابطہ کیسے کریں", "آپ کا دفتر کہاں ہے", "فون نمبر کیا ہے", "دفتر کے اوقات", "روشن صفحہ کہاں واقع ہے"
    ], "response": "Roshan Safha is based in Muzaffarabad, Azad Jammu & Kashmir. Please use our Contact page for current contact information and inquiries.", "urdu_response": "روشن صفحہ مظفرآباد، آزاد جموں و کشمیر میں کام کرتا ہے۔ تازہ رابطہ معلومات کے لیے Contact صفحہ دیکھیں۔", "action_link": "/contact#contact-form"},
    {"intent": "events", "patterns": [
        "upcoming events", "events schedule", "how to register for an event", "any activities happening", "community events", "summer circle program", "sdgs summer circle",
        "event kab hai", "program mein register kaise karun", "summer circle ki maloomat", "agli activity kab hai",
        "اگلا پروگرام کب ہے", "تقریبات کی معلومات", "ایونٹ میں رجسٹریشن", "سمر سرکل کیا ہے"
    ], "response": "For upcoming events and programs, check the Events section of the website for the latest details and registration options.", "urdu_response": "آئندہ تقریبات اور پروگراموں کی تازہ معلومات اور رجسٹریشن کے لیے ویب سائٹ کا Events سیکشن دیکھیں۔", "action_link": "/programs/summer-circle#event-registration-form"},
    {"intent": "collaboration", "patterns": [
        "collaboration", "collaborate", "partnership", "partner with roshan safha", "work with your organization", "organization partnership", "sponsor a program", "how can our ngo collaborate", "institutional collaboration", "collaboration form", "partnership form", "business collaboration", "collab", "taawun", "mil kar kaam karna", "shراکت داری", "شراکت داری", "تعاون", "ادارے کے ساتھ کام کرنا"
    ], "response": "You can propose a collaboration or partnership by completing our Collaboration Form. Our team will review your inquiry and contact you.", "urdu_response": "آپ ہمارے Collaboration Form کے ذریعے شراکت داری یا تعاون کی درخواست بھیج سکتے ہیں۔ ہماری ٹیم آپ سے رابطہ کرے گی۔", "action_link": "/get-involved#collaboration-form"},
    {"intent": "about", "patterns": [
        "what is roshan safha", "tell me about your organization", "what do you do", "your mission", "who are you", "what is the purpose of roshan safha",
        "roshan safha kya hai", "aap log kya karte hain", "aap ka maqsad kya hai",
        "روشن صفحہ کیا ہے", "آپ کا مقصد کیا ہے", "آپ کیا کام کرتے ہیں"
    ], "response": "Roshan Safha supports educational access through book reuse, community participation, and learning-focused initiatives. Explore the website to learn more.", "urdu_response": "روشن صفحہ کتابوں کے دوبارہ استعمال، سماجی شرکت اور تعلیمی سرگرمیوں کے ذریعے تعلیم تک رسائی میں مدد کرتا ہے۔ مزید معلومات کے لیے ویب سائٹ دیکھیں۔", "action_link": "/"}
]

URDU_RE = re.compile(r'[\u0600-\u06FF]')

def preprocess_text(text):
    text = unicodedata.normalize('NFKC', str(text or '')).casefold()
    text = re.sub(r'[\u064B-\u065F\u0670\u0640]', '', text)
    text = re.sub(r'[^\w\s\u0600-\u06FF]', ' ', text, flags=re.UNICODE)
    return ' '.join(text.split())

corpus, intent_map = [], []
for item in KNOWLEDGE_BASE:
    for pattern in item['patterns']:
        corpus.append(preprocess_text(pattern))
        intent_map.append(item)

# Word features work well for English/Roman Urdu; character features cover Urdu inflections.
word_vectorizer = TfidfVectorizer(ngram_range=(1, 2), sublinear_tf=True).fit(corpus)
char_vectorizer = TfidfVectorizer(analyzer='char_wb', ngram_range=(3, 5), sublinear_tf=True).fit(corpus)
word_vectors = word_vectorizer.transform(corpus)
char_vectors = char_vectorizer.transform(corpus)

# Strong, unambiguous collaboration expressions take priority over statistical
# similarity. This prevents short questions such as "how do i collaborate"
# from being incorrectly mapped to the book catalog.
COLLABORATION_TERMS = (
    r'\bcollaborat(?:e|ion|ing|ions|ive)\b',
    r'\bcollab\b',
    r'\bpartner(?:ship|ships|ing)?\b',
    r'\bsponsor(?:ship|ing)?\b',
    r'\btaawun\b',
    r'\bmil kar kaam\b',
    r'تعاون', r'شراکت داری', r'مل کر کام',
)

def intent_result(item, urdu, confidence):
    return {
        'matched': True, 'intent': item['intent'], 'confidence': round(confidence, 3),
        'response': item['urdu_response'] if urdu else item['response'],
        'action_link': item['action_link']
    }

def predict_intent(user_query, confidence_threshold=0.28):
    query = preprocess_text(user_query)
    urdu = bool(URDU_RE.search(query))
    fallback = {
        'matched': False, 'intent': 'fallback', 'confidence': 0.0,
        'response': ('معذرت، میں سوال پوری طرح نہیں سمجھ سکا۔ آپ کتابیں عطیہ کرنے، کتاب حاصل کرنے، مقابلوں، رضاکارانہ کام، تقریبات یا رابطے کے بارے میں پوچھ سکتے ہیں۔' if urdu else
                     'I am not sure I understood. Ask me about donating books, requesting textbooks, contests, volunteering, events, or contacting Roshan Safha.'),
        'action_link': '/contact'
    }
    if not query or len(query) > 1000:
        return fallback
    if any(re.search(term, query) for term in COLLABORATION_TERMS):
        collaboration = next(item for item in KNOWLEDGE_BASE if item['intent'] == 'collaboration')
        return intent_result(collaboration, urdu, 1.0)

    word_scores = cosine_similarity(word_vectorizer.transform([query]), word_vectors)[0]
    char_scores = cosine_similarity(char_vectorizer.transform([query]), char_vectors)[0]
    scores = 0.6 * word_scores + 0.4 * char_scores
    idx = int(scores.argmax())
    score = float(scores[idx])
    if score < confidence_threshold:
        fallback['confidence'] = round(score, 3)
        return fallback
    matched = intent_map[idx]
    return intent_result(matched, urdu, score)
