import { LiquidMetalBackground } from "@/components/LiquidMetalBackground"
import { FloatingNavbar } from "@/components/FloatingNavbar"
import { ShinyButton } from "@/components/ui/shiny-button"
import { Feature } from "@/components/ui/feature-with-advantages"
import { ContactCard } from "@/components/ui/contact-card"
import { AboutQuote } from "@/components/ui/about-quote"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import Icon from "@/components/ui/icon"
import { PhoneIcon, MapPinIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"
import DotPattern from "@/components/ui/dot-pattern"

type Review = {
  id: number
  name: string
  station: string
  text: string
  rating: number
  date: string
  adminReply?: string
}

const MOCK_REVIEWS: Review[] = [
  {
    id: 1,
    name: "Алексей М.",
    station: "АЗС №3, ул. Ленина",
    text: "Отличная заправка! Всегда чисто, персонал вежливый. Заправляюсь здесь уже 2 года, качество топлива не подводит.",
    rating: 5,
    date: "12 апреля 2026",
    adminReply: "Алексей, спасибо за тёплые слова! Рады видеть вас снова на наших станциях.",
  },
  {
    id: 2,
    name: "Марина К.",
    station: "АЗС №7, трасса М5",
    text: "Быстро обслужили, очереди не было. Удобная оплата по QR-коду. Приятный кофе в магазинчике.",
    rating: 5,
    date: "10 апреля 2026",
  },
  {
    id: 3,
    name: "Дмитрий С.",
    station: "АЗС №1, пр. Мира",
    text: "Немного долго ждал на кассе, но в целом всё нормально. Топливо хорошего качества.",
    rating: 4,
    date: "8 апреля 2026",
    adminReply: "Дмитрий, приносим извинения за ожидание. Мы работаем над улучшением скорости обслуживания на этой станции.",
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= rating ? "text-yellow-400" : "text-white/20"}>
          ★
        </span>
      ))}
    </div>
  )
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="relative rounded-xl border-2 border-white/10 bg-white/5 backdrop-blur-sm p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-white font-semibold font-open-sans-custom">{review.name}</p>
          <p className="text-gray-400 text-xs font-open-sans-custom flex items-center gap-1">
            <Icon name="MapPin" size={11} />
            {review.station}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <StarRating rating={review.rating} />
          <p className="text-gray-500 text-xs font-open-sans-custom">{review.date}</p>
        </div>
      </div>
      <p className="text-gray-300 text-sm font-open-sans-custom leading-relaxed">{review.text}</p>
      {review.adminReply && (
        <div className="rounded-lg bg-white/10 border border-white/10 p-3 mt-1">
          <p className="text-xs text-white/60 font-open-sans-custom mb-1 flex items-center gap-1">
            <Icon name="ShieldCheck" size={12} />
            Ответ администрации SALAVAT
          </p>
          <p className="text-gray-200 text-sm font-open-sans-custom leading-relaxed">{review.adminReply}</p>
        </div>
      )}
    </div>
  )
}

function ReviewForm() {
  const [name, setName] = useState("")
  const [station, setStation] = useState("")
  const [text, setText] = useState("")
  const [rating, setRating] = useState(5)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
        <Icon name="CheckCircle" size={48} className="text-green-400" />
        <p className="text-white font-semibold text-lg font-open-sans-custom">Спасибо за отзыв!</p>
        <p className="text-gray-300 text-sm font-open-sans-custom">Мы обязательно его прочитаем и ответим.</p>
        <Button
          variant="outline"
          size="sm"
          className="border-white/20 text-white hover:bg-white/10 font-open-sans-custom mt-2"
          onClick={() => { setSubmitted(false); setName(""); setStation(""); setText(""); setRating(5) }}
        >
          Написать ещё
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div className="flex flex-col gap-2">
        <Label className="text-white [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)] font-open-sans-custom">Ваше имя</Label>
        <Input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Иван Петров"
          className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label className="text-white [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)] font-open-sans-custom">Станция</Label>
        <Input
          required
          value={station}
          onChange={(e) => setStation(e.target.value)}
          placeholder="АЗС №3, ул. Ленина"
          className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label className="text-white [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)] font-open-sans-custom">Оценка</Label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-2xl transition-transform hover:scale-110 ${star <= rating ? "text-yellow-400" : "text-white/20"}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label className="text-white [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)] font-open-sans-custom">Отзыв</Label>
        <Textarea
          required
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Поделитесь впечатлениями о заправке..."
          className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 min-h-[100px]"
        />
      </div>
      <Button
        className="w-full bg-white text-black hover:bg-gray-100 font-open-sans-custom"
        type="submit"
      >
        Отправить отзыв
      </Button>
    </form>
  )
}

export default function Index() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const reviewsSectionRef = useRef<HTMLDivElement>(null)
  const aboutSectionRef = useRef<HTMLDivElement>(null)
  const contactSectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return

    const handleWheel = (e: WheelEvent) => {
      const delta = e.deltaY
      const currentScroll = scrollContainer.scrollLeft
      const containerWidth = scrollContainer.offsetWidth
      const currentSection = Math.round(currentScroll / containerWidth)

      if (currentSection === 2 && reviewsSectionRef.current) {
        const section = reviewsSectionRef.current
        const isAtTop = section.scrollTop === 0
        const isAtBottom = section.scrollTop + section.clientHeight >= section.scrollHeight - 1

        if (delta > 0 && !isAtBottom) return
        if (delta < 0 && !isAtTop) return

        if (delta < 0 && isAtTop) {
          e.preventDefault()
          scrollContainer.scrollTo({ left: 1 * containerWidth, behavior: "smooth" })
          return
        }
        if (delta > 0 && isAtBottom) {
          e.preventDefault()
          scrollContainer.scrollTo({ left: 3 * containerWidth, behavior: "smooth" })
          return
        }
      }

      if (currentSection === 3 && aboutSectionRef.current) {
        const section = aboutSectionRef.current
        const isAtTop = section.scrollTop === 0
        const isAtBottom = section.scrollTop + section.clientHeight >= section.scrollHeight - 1

        if (delta > 0 && !isAtBottom) return
        if (delta < 0 && !isAtTop) return

        if (delta < 0 && isAtTop) {
          e.preventDefault()
          scrollContainer.scrollTo({ left: 2 * containerWidth, behavior: "smooth" })
          return
        }
        if (delta > 0 && isAtBottom) {
          e.preventDefault()
          scrollContainer.scrollTo({ left: 4 * containerWidth, behavior: "smooth" })
          return
        }
      }

      if (currentSection === 4 && contactSectionRef.current) {
        const section = contactSectionRef.current
        const isAtTop = section.scrollTop === 0
        const isAtBottom = section.scrollTop + section.clientHeight >= section.scrollHeight - 1

        if (delta > 0 && !isAtBottom) return
        if (delta < 0 && !isAtTop) return

        if (delta < 0 && isAtTop) {
          e.preventDefault()
          scrollContainer.scrollTo({ left: 3 * containerWidth, behavior: "smooth" })
          return
        }
        if (delta > 0 && isAtBottom) {
          e.preventDefault()
          return
        }
      }

      e.preventDefault()

      if (Math.abs(delta) > 10) {
        let targetSection = currentSection
        if (delta > 0) {
          targetSection = Math.min(currentSection + 1, 4)
        } else {
          targetSection = Math.max(currentSection - 1, 0)
        }
        scrollContainer.scrollTo({ left: targetSection * containerWidth, behavior: "smooth" })
      }
    }

    scrollContainer.addEventListener("wheel", handleWheel, { passive: false })
    return () => scrollContainer.removeEventListener("wheel", handleWheel)
  }, [])

  return (
    <main className="relative h-screen overflow-hidden">
      <LiquidMetalBackground />

      <div className="fixed inset-0 z-[5] bg-black/50" />

      <FloatingNavbar />

      <div
        ref={scrollContainerRef}
        className="relative z-10 flex h-screen w-full overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory hide-scrollbar"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* Герой */}
        <section id="home" className="flex min-w-full snap-start items-center justify-center px-4 py-20">
          <div className="mx-auto max-w-4xl">
            <div className="text-center px-0 leading-5">
              <h1 className="mb-8 text-balance text-5xl tracking-tight text-white [text-shadow:_0_4px_20px_rgb(0_0_0_/_60%)] md:text-6xl lg:text-8xl">
                <span className="font-open-sans-custom not-italic">АЗС</span>{" "}
                <span className="font-serif italic">SALAVAT.</span>
              </h1>

              <p className="mb-8 mx-auto max-w-2xl text-pretty leading-relaxed text-gray-300 [text-shadow:_0_2px_10px_rgb(0_0_0_/_50%)] font-thin font-open-sans-custom tracking-wide text-xl">
                Заправляйтесь с уверенностью — качественное топливо,{" "}
                <span className="font-serif italic">быстрое обслуживание</span> и честные цены каждый день
              </p>

              <div className="flex justify-center gap-4">
                <ShinyButton
                  className="px-8 py-3 text-base"
                  onClick={() => {
                    const el = document.getElementById("reviews")
                    el?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" })
                  }}
                >
                  Оставить отзыв
                </ShinyButton>
              </div>
            </div>
          </div>
        </section>

        {/* Преимущества */}
        <section id="features" className="flex min-w-full snap-start items-center justify-center px-4 py-20">
          <div className="mx-auto max-w-7xl w-full">
            <Feature />
          </div>
        </section>

        {/* Отзывы */}
        <section
          id="reviews"
          ref={reviewsSectionRef}
          className="relative min-w-full snap-start overflow-y-auto px-4 pt-24 pb-20 hide-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div
            aria-hidden="true"
            className={cn(
              "absolute inset-0 z-0 size-full pointer-events-none",
              "bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)]",
              "bg-[size:12px_12px]",
              "opacity-30",
            )}
          />

          <div className="relative z-10 mx-auto w-full max-w-6xl">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl text-white [text-shadow:_0_4px_20px_rgb(0_0_0_/_60%)] font-open-sans-custom">
                Отзывы клиентов
              </h1>
              <p className="text-gray-300 mt-4 text-sm md:text-base font-open-sans-custom [text-shadow:_0_2px_10px_rgb(0_0_0_/_50%)]">
                Реальные впечатления наших клиентов. Мы читаем каждый отзыв и отвечаем лично.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {MOCK_REVIEWS.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}

              {/* Форма отзыва */}
              <div className="relative rounded-xl border-2 border-white/10 bg-white/5 backdrop-blur-sm p-5">
                <DotPattern width={5} height={5} />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className="bg-white/10 text-white border-white/20 font-open-sans-custom">
                      Новый отзыв
                    </Badge>
                  </div>
                  <ReviewForm />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* О сети */}
        <section
          id="about"
          ref={aboutSectionRef}
          className="relative min-w-full snap-start overflow-y-auto px-4 pt-24 pb-20 hide-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div
            aria-hidden="true"
            className={cn(
              "absolute inset-0 z-0 size-full pointer-events-none",
              "bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)]",
              "bg-[size:12px_12px]",
              "opacity-30",
            )}
          />

          <div className="relative z-10 mx-auto w-full max-w-7xl">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl text-white [text-shadow:_0_4px_20px_rgb(0_0_0_/_60%)] font-open-sans-custom">
                О сети SALAVAT
              </h1>
              <p className="text-gray-300 mt-4 text-sm md:text-base font-open-sans-custom [text-shadow:_0_2px_10px_rgb(0_0_0_/_50%)]">
                Наша миссия — сделать каждую заправку комфортной и надёжной.
              </p>
            </div>
            <AboutQuote />
          </div>
        </section>

        {/* Контакты */}
        <section
          id="contact"
          ref={contactSectionRef}
          className="relative min-w-full snap-start overflow-y-auto px-4 pt-24 pb-20"
        >
          <div
            aria-hidden="true"
            className={cn(
              "absolute inset-0 z-0 size-full pointer-events-none",
              "bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)]",
              "bg-[size:12px_12px]",
              "opacity-30",
            )}
          />

          <div className="relative z-10 mx-auto w-full max-w-5xl mt-[5vh]">
            <ContactCard
              title="Свяжитесь с нами"
              description="Есть вопрос или предложение? Напишите нам — мы отвечаем в течение одного рабочего дня."
              contactInfo={[
                {
                  icon: PhoneIcon,
                  label: "Телефон",
                  value: "+7 (347) 000-00-00",
                },
                {
                  icon: MapPinIcon,
                  label: "Город",
                  value: "Салават, Башкортостан",
                  className: "col-span-2",
                },
              ]}
            >
              <form className="w-full space-y-4">
                <div className="flex flex-col gap-2">
                  <Label className="text-white [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)] font-open-sans-custom">
                    Имя
                  </Label>
                  <Input
                    type="text"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-white [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)] font-open-sans-custom">
                    Телефон
                  </Label>
                  <Input
                    type="tel"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-white [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)] font-open-sans-custom">
                    Сообщение
                  </Label>
                  <Textarea className="bg-white/10 border-white/20 text-white placeholder:text-gray-400" />
                </div>
                <Button
                  className="w-full bg-white text-black hover:bg-gray-100 font-open-sans-custom"
                  type="button"
                >
                  Отправить
                </Button>
              </form>
            </ContactCard>
          </div>
        </section>
      </div>
    </main>
  )
}
