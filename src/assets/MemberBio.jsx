import React from "react";
import members from "../data/MemberData";

// Helper: render vote-specific message
function renderVoteMessage(member) {
  const vote = (member?.Vote || "").trim();
  if (vote === "Yea") {
    return (
      <div className="text-center text-red-600 font-medium text-lg">
        I SUPPORT MAGA, I Voted {member.Vote} to Honoring the life and legacy
        of a racist white supremest
      </div>
    );
  }
  if (vote === "Present") {
    return (
      <div className="text-center text-red-600 font-medium text-lg">
        I SUPPORT MAGA, I voted {member.Vote} Honoring the life and
        legacy of a racist white supremacist
      </div>
    );
  }
  if (vote === "Not Voting") {
    return (
      <div className="text-center text-red-600 font-medium text-lg">
        I SUPPORT MAGA, I did not vote against Honoring the life and legacy of
        a racist white supremacist
      </div>
    );
  }
  return null;
}

// IDs to highlight
const specialMembers = [
  "A000370","B001326","N000191","C001136","T000486","V000131",
  "J000294","S001157","E000296","D000230","M001137"
];
const pelosiVoted = ["P000197"];

export default function MemberBioMarquee({
  duration = 300,
  gap = 24,
  autoScroll = true,
  priorityIds = ["P000197", "J000294"],   // 👈 new prop
}) {
  // Reorder members so priorityIds appear first (in given order)
  let orderedMembers = [...members];
  if (priorityIds.length > 0) {
    const priorityList = [];
    const remaining = [];

    orderedMembers.forEach(m => {
      if (priorityIds.includes(m.Member_ID)) {
        // push in correct priority order
        const index = priorityIds.indexOf(m.Member_ID);
        priorityList[index] = m;
      } else {
        remaining.push(m);
      }
    });

    orderedMembers = [...priorityList.filter(Boolean), ...remaining];
  }

  const doubled = [...orderedMembers, ...orderedMembers];
  const [paused, setPaused] = React.useState(false);
  const [delayedStart, setDelayedStart] = React.useState(false);
  const viewportRef = React.useRef(null);

  React.useEffect(() => {
    if (autoScroll) {
      const timer = setTimeout(() => setDelayedStart(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [autoScroll]);

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <h2 className="text-center text-red-600 font-extrabold text-3xl mb-6">
        MAGA DEMOCRATS
      </h2>

      <div
        ref={viewportRef}
        className={`relative h-[750px] ${
          autoScroll ? "overflow-hidden" : "overflow-auto"
        }`}
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
          maskImage:
            "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
        }}
      >
        <div
          className="grid grid-cols-1 sm:grid-cols-2 scroll-container"
          style={{
            gap: `${gap}px`,
            animation:
              autoScroll && delayedStart
                ? `scroll-up ${duration}s linear infinite`
                : "none",
            animationPlayState: paused ? "paused" : "running",
          }}
        >
          {doubled.map((member, idx) => {
            const isSpecial = specialMembers.includes(member.Member_ID);
            const isPelosi = pelosiVoted.includes(member.Member_ID);

            return (
              <article
                key={`${idx}-${member.Member_ID}`}
                className={`flex flex-col gap-4 p-6 rounded-2xl shadow bg-white/90 backdrop-blur border ${
                  isSpecial || isPelosi
                    ? "border-blue-600 border-4"
                    : "border-gray-200"
                }`}
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
              >
                {/* Top row: Image + Info (+ optional 3rd column) */}
                <div className="flex flex-row items-stretch gap-6">
                  {/* First column: Image */}
                  <figure className="relative shrink-0">
                    <img
                      src={`src/images/${member.Member_ID}.jpg`}
                      alt={member.Full_Name}
                      className="w-40 h-56 sm:w-44 sm:h-60 object-cover rounded-2xl shadow"
                    />
                    <img
                      src="src/images/stamp.png"
                      alt="Stamp"
                      className="absolute bottom-2 right-2 w-14 h-14 opacity-100 rotate-[-5deg] rounded-full"
                    />
                  </figure>

                  {/* Second column: Info */}
                  <div className="flex flex-col justify-between min-w-0 flex-1">
                    <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-gray-900">
                      {member.Full_Name}
                    </h1>
                    <p className="text-md text-gray-700">{member.District_Info}</p>
                    <p className="text-gray-600">Party: {member.Party}</p>
                    <p className="text-gray-600">Vote: {member.Vote}</p>
                  </div>

                  {/* Third column */}
                  {isPelosi ? (
                    <div className="hidden sm:flex w-52 h-56 sm:h-60">
                      <div className="flex-1 rounded-xl border-2 border-blue-600 bg-blue-50 text-blue-900 p-4 overflow-auto">
                        <p className="text-sm leading-snug break-words hyphens-auto">
                          Right-wing influencer Charlie Kirk once used his platform to call for a
                          “patriot” to bail out the man who broke into Speaker Emerita Nancy Pelosi’s
                          house in San Francisco and attacked her husband with a hammer. Kirk made the
                          comments on a 2022 episode of his podcast, “The Charlie Kirk Show.”
                        </p>
                      </div>
                    </div>
                  ) : (
                    isSpecial && (
                      <div className="hidden sm:flex items-center justify-center w-40 h-56 border-2 border-dashed border-blue-400 rounded-xl bg-blue-50 text-blue-600 font-medium">
                        <img src="src/images/logo-static.svg" alt="CBC_logo" />
                      </div>
                    )
                  )}
                </div>

                {/* Second row */}
                {renderVoteMessage(member)}
              </article>
            );
          })}
        </div>

        <style>{`
          @keyframes scroll-up {
            0% { transform: translateY(0); }
            100% { transform: translateY(-50%); }
          }
        `}</style>
      </div>
    </div>
  );
}
