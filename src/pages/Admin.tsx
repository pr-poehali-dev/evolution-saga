import { useEffect, useState } from "react"
import { LiquidMetalBackground } from "@/components/LiquidMetalBackground"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import Icon from "@/components/ui/icon"
import func2url from "../../backend/func2url.json"

type Review = {
  id: number
  name: string
  station: string
  text: string
  rating: number
  date: string
  adminReply?: string | null
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= rating ? "text-yellow-400" : "text-white/20"}>★</span>
      ))}
    </div>
  )
}

function ReviewItem({ review, token, onUpdated }: { review: Review; token: string; onUpdated: () => void }) {
  const [replyText, setReplyText] = useState(review.adminReply || "")
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      await fetch(func2url["reply-review"], {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Auth-Token": token },
        body: JSON.stringify({ review_id: review.id, text: replyText }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      onUpdated()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-xl border-2 border-white/10 bg-white/5 backdrop-blur-sm p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-white font-semibold font-open-sans-custom">{review.name}</p>
          <p className="text-gray-400 text-xs font-open-sans-custom flex items-center gap-1">
            <Icon name="MapPin" size={11} /> {review.station}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <StarRating rating={review.rating} />
          <p className="text-gray-500 text-xs font-open-sans-custom">{review.date}</p>
        </div>
      </div>
      <p className="text-gray-300 text-sm font-open-sans-custom leading-relaxed">{review.text}</p>

      <div className="flex flex-col gap-2 border-t border-white/10 pt-3">
        <Label className="text-white/70 text-xs font-open-sans-custom flex items-center gap-1">
          <Icon name="ShieldCheck" size={13} />
          {review.adminReply ? "Изменить ответ" : "Написать ответ"}
        </Label>
        <Textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Ваш ответ от имени SALAVAT..."
          className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 min-h-[80px] text-sm"
        />
        <Button
          size="sm"
          onClick={handleSave}
          disabled={loading || !replyText.trim()}
          className="self-end bg-white text-black hover:bg-gray-100 font-open-sans-custom"
        >
          {loading ? "Сохраняем..." : saved ? "✓ Сохранено!" : "Опубликовать ответ"}
        </Button>
      </div>
    </div>
  )
}

export default function Admin() {
  const [token, setToken] = useState("")
  const [inputToken, setInputToken] = useState("")
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const loadReviews = async () => {
    const res = await fetch(func2url["reviews"])
    const data = await res.json()
    setReviews(data.reviews || [])
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch(func2url["reply-review"], {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Auth-Token": inputToken },
        body: JSON.stringify({ review_id: 999999, text: "test" }),
      })
      if (res.status === 403) {
        setError("Неверный пароль")
      } else {
        setToken(inputToken)
        await loadReviews()
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) loadReviews()
  }, [token])

  const unanswered = reviews.filter((r) => !r.adminReply)
  const answered = reviews.filter((r) => r.adminReply)

  if (!token) {
    return (
      <main className="relative min-h-screen flex items-center justify-center">
        <LiquidMetalBackground />
        <div className="fixed inset-0 z-[5] bg-black/60" />
        <div className="relative z-10 w-full max-w-sm px-4">
          <div className="rounded-2xl border-2 border-white/10 bg-white/5 backdrop-blur-sm p-8">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-3">
                <Icon name="ShieldCheck" size={40} className="text-white/80" />
              </div>
              <h1 className="text-2xl font-bold text-white font-open-sans-custom">Панель SALAVAT</h1>
              <p className="text-gray-400 text-sm mt-1 font-open-sans-custom">Управление отзывами</p>
            </div>
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label className="text-white font-open-sans-custom">Пароль администратора</Label>
                <Input
                  type="password"
                  value={inputToken}
                  onChange={(e) => setInputToken(e.target.value)}
                  placeholder="Введите пароль"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                />
              </div>
              {error && <p className="text-red-400 text-sm font-open-sans-custom">{error}</p>}
              <Button type="submit" disabled={loading || !inputToken}
                className="bg-white text-black hover:bg-gray-100 font-open-sans-custom">
                {loading ? "Проверяем..." : "Войти"}
              </Button>
            </form>
          </div>
          <p className="text-center mt-4">
            <a href="/" className="text-gray-500 text-xs hover:text-gray-300 font-open-sans-custom">← На главную</a>
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="relative min-h-screen">
      <LiquidMetalBackground />
      <div className="fixed inset-0 z-[5] bg-black/60" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white font-open-sans-custom">Панель администратора</h1>
            <p className="text-gray-400 text-sm font-open-sans-custom mt-1">АЗС SALAVAT — управление отзывами</p>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="text-gray-400 text-sm hover:text-white font-open-sans-custom flex items-center gap-1">
              <Icon name="ArrowLeft" size={14} /> На сайт
            </a>
            <Button variant="outline" size="sm" onClick={() => setToken("")}
              className="border-white/20 text-white hover:bg-white/10 font-open-sans-custom">
              Выйти
            </Button>
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: "Всего отзывов", value: reviews.length, icon: "MessageSquare" },
            { label: "Без ответа", value: unanswered.length, icon: "Clock" },
            { label: "Отвечено", value: answered.length, icon: "CheckCircle" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border-2 border-white/10 bg-white/5 backdrop-blur-sm p-4 text-center">
              <Icon name={stat.icon as never} size={20} className="text-white/60 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white font-open-sans-custom">{stat.value}</p>
              <p className="text-gray-400 text-xs font-open-sans-custom">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Без ответа */}
        {unanswered.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-semibold text-white font-open-sans-custom">Ожидают ответа</h2>
              <Badge className="bg-red-500/20 text-red-300 border-red-500/30 font-open-sans-custom">{unanswered.length}</Badge>
            </div>
            <div className="flex flex-col gap-4">
              {unanswered.map((r) => <ReviewItem key={r.id} review={r} token={token} onUpdated={loadReviews} />)}
            </div>
          </div>
        )}

        {/* Отвеченные */}
        {answered.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-semibold text-white font-open-sans-custom">Отвеченные отзывы</h2>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30 font-open-sans-custom">{answered.length}</Badge>
            </div>
            <div className="flex flex-col gap-4">
              {answered.map((r) => <ReviewItem key={r.id} review={r} token={token} onUpdated={loadReviews} />)}
            </div>
          </div>
        )}

        {reviews.length === 0 && (
          <div className="text-center py-16 text-gray-400 font-open-sans-custom">
            <Icon name="Inbox" size={48} className="mx-auto mb-4 opacity-40" />
            <p>Отзывов пока нет</p>
          </div>
        )}
      </div>
    </main>
  )
}
