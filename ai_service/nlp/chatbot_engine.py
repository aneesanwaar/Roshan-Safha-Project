import re
import nltk
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Pre-download required NLTK corpora
nltk.download('punkt', quiet=True)
nltk.download('punkt_tab', quiet=True)
nltk.download('stopwords', quiet=True)
nltk.download('wordnet', quiet=True)

from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words('english'))

KNOWLEDGE_BASE = [
    {
        "intent": "donate_books",
        "patterns": [
            "how can i donate books",
            "where can i drop off used books",
            "book donation process",
            "i want to give my matric fsc books",
            "kitabein jama karwani hain",
            "kitab donate karni hai",
            "books donate karna chahta hoon"
        ],
        "response": "You can donate syllabus textbooks (Matric, FSc, O/A Levels) through our 'Donate Books' portal. Books can be dropped off at our Muzaffarabad center or dispatched via courier.",
        "action_link": "/programs/donate-books"
    },
    {
        "intent": "available_books",
        "patterns": [
            "how to get free books",
            "search available syllabus textbooks",
            "i need class 10 physics book",
            "book catalog",
            "muft kitabein chahiye",
            "kitab mil sakti hai",
            "textbook inventory"
        ],
        "response": "You can browse our live textbook catalog by subject and grade level, and place a zero-cost request on our Book Catalog page.",
        "action_link": "/programs/book-catalog"
    },
    {
        "intent": "essay_contest",
        "patterns": [
            "annual youth essay contest",
            "how to submit essay",
            "competition deadline and prizes",
            "essay topics for junior and senior",
            "mazmoon muqabla details",
            "contest guidelines"
        ],
        "response": "The Roshan Safha Annual Youth Essay Contest features Junior (under 16) and Senior (16+) categories. You can submit your DOCX or PDF manuscript online before the deadline.",
        "action_link": "/programs/essay-contests"
    },
    {
        "intent": "volunteer",
        "patterns": [
            "how to join as volunteer",
            "volunteer registration",
            "i want to help repair and bind books",
            "raza kar banna hai",
            "join the team"
        ],
        "response": "We welcome volunteers for book sorting, rebinding/restoration, and field logistics. Sign up through our 'Get Involved' page.",
        "action_link": "/get-involved"
    },
    {
        "intent": "location_contact",
        "patterns": [
            "where is your office located",
            "muzaffarabad head office address",
            "contact phone number email",
            "rabta number",
            "office timings"
        ],
        "response": "Our central hub is located in Muzaffarabad, Azad Jammu & Kashmir. You can reach us at roshansafha@gmail.com or +92 300 5966967.",
        "action_link": "/contact"
    }
]

def preprocess_text(text):
    text = text.lower()
    text = re.sub(r'[^a-zA-Z0-9\s]', ' ', text)
    tokens = nltk.word_tokenize(text)
    filtered = [lemmatizer.lemmatize(w) for w in tokens if w not in stop_words]
    return " ".join(filtered) if filtered else text

# Vectorize training patterns
corpus = []
intent_map = []

for item in KNOWLEDGE_BASE:
    for pattern in item["patterns"]:
        corpus.append(preprocess_text(pattern))
        intent_map.append(item)

vectorizer = TfidfVectorizer().fit(corpus)
corpus_vectors = vectorizer.transform(corpus)

def predict_intent(user_query, confidence_threshold=0.20):
    cleaned_query = preprocess_text(user_query)
    query_vector = vectorizer.transform([cleaned_query])
    
    similarities = cosine_similarity(query_vector, corpus_vectors)[0]
    best_idx = int(similarities.argmax())
    best_score = float(similarities[best_idx])

    if best_score >= confidence_threshold:
        matched = intent_map[best_idx]
        return {
            "matched": True,
            "intent": matched["intent"],
            "confidence": round(best_score, 3),
            "response": matched["response"],
            "action_link": matched.get("action_link", None)
        }
    else:
        return {
            "matched": False,
            "intent": "fallback",
            "confidence": round(best_score, 3),
            "response": "I can help with Roshan Safha book donations, textbook requests, essay contests, and volunteer signups. Please rephrase or ask your question. (آپ اردو یا انگریزی میں پوچھ سکتے ہیں)",
            "action_link": "/contact"
        }