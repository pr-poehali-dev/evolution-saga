import json
import os
import urllib.request
import psycopg2  # noqa

def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-User-Id, X-Auth-Token",
}

def send_telegram(text: str):
    bot_token = os.environ.get("TELEGRAM_BOT_TOKEN", "")
    chat_id = os.environ.get("TELEGRAM_CHAT_ID", "")
    if not bot_token or not chat_id:
        return
    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    payload = json.dumps({"chat_id": chat_id, "text": text, "parse_mode": "HTML"}).encode()
    req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
    urllib.request.urlopen(req, timeout=5)

def handler(event: dict, context) -> dict:
    """Создание нового отзыва об АЗС SALAVAT с уведомлением в Telegram."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    body = json.loads(event.get("body") or "{}")
    name = body.get("name", "").strip()
    station = body.get("station", "").strip()
    text = body.get("text", "").strip()
    rating = int(body.get("rating", 5))

    if not name or not station or not text:
        return {
            "statusCode": 400,
            "headers": {**CORS_HEADERS, "Content-Type": "application/json"},
            "body": json.dumps({"error": "Заполните все поля"}, ensure_ascii=False),
        }

    if rating < 1 or rating > 5:
        return {
            "statusCode": 400,
            "headers": {**CORS_HEADERS, "Content-Type": "application/json"},
            "body": json.dumps({"error": "Оценка должна быть от 1 до 5"}, ensure_ascii=False),
        }

    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO reviews (name, station, text, rating) VALUES (%s, %s, %s, %s) RETURNING id",
        (name, station, text, rating),
    )
    review_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()

    stars = "★" * rating + "☆" * (5 - rating)
    try:
        send_telegram(
            f"⛽ <b>Новый отзыв на SALAVAT!</b>\n\n"
            f"👤 <b>{name}</b>\n"
            f"📍 {station}\n"
            f"⭐ {stars}\n\n"
            f"{text}\n\n"
            f"🔗 Ответить: /admin"
        )
    except Exception:
        pass

    return {
        "statusCode": 200,
        "headers": {**CORS_HEADERS, "Content-Type": "application/json"},
        "body": json.dumps({"id": review_id, "success": True}, ensure_ascii=False),
    }
