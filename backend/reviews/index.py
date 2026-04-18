import json
import os
import psycopg2  # noqa

def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-User-Id, X-Auth-Token",
}

def handler(event: dict, context) -> dict:
    """Получение списка отзывов с ответами администратора."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    conn = get_conn()
    cur = conn.cursor()

    cur.execute("""
        SELECT r.id, r.name, r.station, r.text, r.rating,
               to_char(r.created_at, 'DD Month YYYY') AS date,
               rr.text AS admin_reply
        FROM reviews r
        LEFT JOIN review_replies rr ON rr.review_id = r.id
        ORDER BY r.created_at DESC
    """)
    rows = cur.fetchall()
    cur.close()
    conn.close()

    reviews = []
    for row in rows:
        reviews.append({
            "id": row[0],
            "name": row[1],
            "station": row[2],
            "text": row[3],
            "rating": row[4],
            "date": row[5],
            "adminReply": row[6],
        })

    return {
        "statusCode": 200,
        "headers": {**CORS_HEADERS, "Content-Type": "application/json"},
        "body": json.dumps({"reviews": reviews}, ensure_ascii=False),
    }