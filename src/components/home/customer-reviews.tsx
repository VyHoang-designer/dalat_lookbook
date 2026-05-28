import { Star, MapPin, Quote } from "lucide-react";
import { getFeaturedReviews } from "@/lib/db/reviews";

export default async function CustomerReviews() {
  const reviews = await getFeaturedReviews();

  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#f8f3ec] py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <div className="mx-auto mb-5 h-1 w-20 rounded-full bg-[#9b7653]" />
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#9b7653]">
            Feedback khách hàng
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold tracking-wide text-[#2f2924] md:text-5xl">
            Khách hàng nói gì về Đà Lạt Lookbook?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-[#766b62]">
            Những trải nghiệm thật từ khách hàng đã thuê outfit và check-in tại
            các địa điểm nổi tiếng ở Đà Lạt.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((review: any) => (
            <div
              key={review.id}
              className="relative rounded-3xl border border-[#e2d4c5] bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="absolute right-6 top-6 text-[#d8c7b3]">
                <Quote size={34} />
              </div>

              <div className="mb-5 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#8a6a45] text-lg font-bold text-white">
                  {review.name.charAt(0)}
                </div>

                <div>
                  <h3 className="font-bold text-[#2f2924]">{review.name}</h3>
                  <p className="text-sm text-[#8a7a6d]">{review.outfit}</p>
                </div>
              </div>

              <div className="mb-4 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    size={18}
                    className={
                      index < review.rating
                        ? "fill-[#d6a23d] text-[#d6a23d]"
                        : "text-[#ddd3c8]"
                    }
                  />
                ))}
              </div>

              <p className="mb-5 leading-7 text-[#5f554d]">
                "{review.comment}"
              </p>

              {review.location && (
                <div className="flex items-center gap-2 rounded-2xl bg-[#f8f3ec] px-4 py-3 text-sm text-[#7a5c3d] w-fit">
                  <MapPin size={16} />
                  <span>{review.location}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
