interface PaginationProps {
  shown: number;
  total: number;
  hasMore: boolean;
  onLoadMore: () => void;
}

export function Pagination({ shown, total, hasMore, onLoadMore }: PaginationProps) {
  return (
    <section className="mx-auto w-full max-w-[1380px] px-4 pb-20 pt-4 text-center md:px-8">
      <p className="font-['Inter'] text-xs tracking-[0.16em] text-[#E7D7C4]/55">
        SHOWING {shown} OF {total}
      </p>

      {hasMore ? (
        <button
          type="button"
          onClick={onLoadMore}
          className="mt-5 rounded-full border border-[#6E6A66] bg-[#1B1411] px-8 py-3 font-['Inter'] text-xs tracking-[0.18em] text-[#E7D7C4] transition-colors hover:border-[#D6A25B] hover:text-[#D6A25B]"
        >
          LOAD MORE
        </button>
      ) : null}
    </section>
  );
}