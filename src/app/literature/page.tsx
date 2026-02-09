import { citations } from '@/data/researchCitations';

export default function LiteraturePage() {
  const sortedCitations = Object.values(citations).sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year;
    return a.title.localeCompare(b.title);
  });

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-lg font-bold text-[#e4e4ef]">Literature</h1>
        <p className="text-xs text-[#606070] mt-0.5">
          Research papers and reports underpinning the simulator&apos;s
          projections &mdash; {sortedCitations.length} sources
        </p>
      </div>

      {/* Citation cards */}
      <div className="grid gap-4">
        {sortedCitations.map((cite) => (
          <div
            key={cite.id}
            className="bg-[#13131d] border border-[#2a2a3a] rounded-lg p-5"
          >
            {/* Title row */}
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                {cite.url ? (
                  <a
                    href={cite.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-[#e4e4ef] hover:text-emerald-400 transition-colors"
                  >
                    {cite.title}
                    <span className="inline-block ml-1.5 text-[10px] text-[#606070]">
                      &#8599;
                    </span>
                  </a>
                ) : (
                  <span className="text-sm font-semibold text-[#e4e4ef]">
                    {cite.title}
                  </span>
                )}

                <div className="flex items-center gap-2 mt-1 text-xs text-[#9898aa]">
                  <span>{cite.authors}</span>
                  <span className="text-[#2a2a3a]">|</span>
                  <span>{cite.year}</span>
                  <span className="text-[#2a2a3a]">|</span>
                  <span className="text-[#606070]">{cite.source}</span>
                </div>
              </div>

              {cite.url && (
                <a
                  href={cite.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 px-3 py-1.5 text-[10px] font-medium rounded border border-[#2a2a3a] text-[#9898aa] hover:text-[#e4e4ef] hover:border-[#3a3a4a] transition-colors"
                >
                  View source
                </a>
              )}
            </div>

            {/* Summary */}
            <p className="mt-3 text-xs text-[#9898aa] leading-relaxed">
              {cite.summary}
            </p>

            {/* Key findings */}
            <div className="mt-3 pt-3 border-t border-[#1e1e2e]">
              <span className="text-[10px] font-medium text-[#606070] uppercase tracking-wider">
                Key Findings
              </span>
              <ul className="mt-2 space-y-1.5">
                {cite.keyFindings.map((finding, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-xs text-[#9898aa]"
                  >
                    <span className="shrink-0 mt-1 w-1 h-1 rounded-full bg-emerald-500/60" />
                    {finding}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
