import json
import os
import psycopg2

def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Auth-Token",
}

ADMIN_TOKEN = os.environ.get("ADMIN_TOKEN", "")

def handler(event: dict, context) -> dict:
    """Ответ администратора на отзыв (защищён токеном)."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    token = event.get("headers", {}).get("X-Auth-Token", "")
    if not ADMIN_TOKEN or token != ADMIN_TOKEN:
        return {
            "statusCode": 403,
            "headers": {**CORS_HEADERS, "Content-Type": "application/json"},
            "body": json.dumps({"error": "Доступ запрещён"}, ensure_ascii=False),
        }

    body = json.loads(event.get("body") or "{}")
    review_id = body.get("review_id")
    text = body.get("text", "").strip()

    if not review_id or not text:
        return {
            "statusCode": 400,
            "headers": {**CORS_HEADERS, "Content-Type": "application/json"},
            "body": json.dumps({"error": "Укажите review_id и текст ответа"}, ensure_ascii=False),
        }

    conn = get_conn()
    cur = conn.cursor()

    cur.execute("SELECT id FROM reviews WHERE id = %s", (review_id,))
    if not cur.fetchone():
        cur.close()
        conn.close()
        return {
            "statusCode": 404,
            "headers": {**CORS_HEADERS, "Content-Type": "application/json"},
            "body": json.dumps({"error": "Отзыв не найден"}, ensure_ascii=False),
        }

    cur.execute("SELECT id FROM review_replies WHERE review_id = %s", (review_id,))
    existing = cur.fetchone()

    if existing:
        cur.execute(
            "UPDATE review_replies SET text = %s, created_at = NOW() WHERE review_id = %s",
            (text, review_id),
        )
    else:
        cur.execute(
            "INSERT INTO review_replies (review_id, text) VALUES (%s, %s)",
            (review_id, text),
        )

    conn.commit()
    cur.close()
    conn.close()

    return {
        "statusCode": 200,
        "headers": {**CORS_HEADERS, "Content-Type": "application/json"},
        "body": json.dumps({"success": True}, ensure_ascii=False),
    }
