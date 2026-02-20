// import { TrendingUp, TrendingDown } from "lucide-react";

// export default function ATSScoreRange({ matches }) {

//   if (!matches.length) return null;

//   const scores = matches.map(
//     m => m.matchResultId?.atsScorePercent || 0
//   );

//   const highest = Math.max(...scores);
//   const lowest = Math.min(...scores);
//   const gap = highest - lowest;

//   return (
//     <div className="space-y-6">

//       {/* Highest */}
//       <div className="p-4 rounded-xl bg-green-50">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-2 text-green-700">
//             <TrendingUp size={18} />
//             <span className="text-sm font-medium">Highest ATS</span>
//           </div>
//           <span className="text-2xl font-bold text-green-700">
//             {highest}%
//           </span>
//         </div>

//         <div className="w-full bg-green-100 h-2 rounded-full mt-3">
//           <div
//             className="bg-green-500 h-2 rounded-full transition-all"
//             style={{ width: `${highest}%` }}
//           />
//         </div>
//       </div>

//       {/* Lowest */}
//       <div className="p-4 rounded-xl bg-red-50">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-2 text-red-700">
//             <TrendingDown size={18} />
//             <span className="text-sm font-medium">Lowest ATS</span>
//           </div>
//           <span className="text-2xl font-bold text-red-700">
//             {lowest}%
//           </span>
//         </div>

//         <div className="w-full bg-red-100 h-2 rounded-full mt-3">
//           <div
//             className="bg-red-500 h-2 rounded-full transition-all"
//             style={{ width: `${lowest}%` }}
//           />
//         </div>
//       </div>

//       {/* Gap Insight */}
//       <div className="text-center text-sm text-muted-foreground">
//         Performance gap: <span className="font-semibold">{gap}%</span>
//       </div>

//     </div>
//   );
// }

import { TrendingUp, TrendingDown } from "lucide-react";

export default function ATSScoreRange({ matches }) {
  if (!matches.length) return null;

  const scores = matches.map(
    m => m.matchResultId?.atsScorePercent || 0
  );

  const highest = Math.max(...scores);
  const lowest = Math.min(...scores);
  const gap = highest - lowest;

  const improving =
    scores[scores.length - 1] <= scores[0];

  return (
    <div className="space-y-6">

      {/* Highest */}
      <div className="p-5 rounded-xl bg-green-50">
        <div className="flex justify-between items-center text-green-700">
          <div className="flex gap-2 items-center">
            <TrendingUp size={18} />
            Highest ATS
          </div>
          <span className="text-2xl font-bold">{highest}%</span>
        </div>

        <div className="h-2 bg-green-100 rounded-full mt-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all"
            style={{ width: `${highest}%` }}
          />
        </div>
      </div>

      {/* Lowest */}
      <div className="p-5 rounded-xl bg-red-50">
        <div className="flex justify-between items-center text-red-700">
          <div className="flex gap-2 items-center">
            <TrendingDown size={18} />
            Lowest ATS
          </div>
          <span className="text-2xl font-bold">{lowest}%</span>
        </div>

        <div className="h-2 bg-red-100 rounded-full mt-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-400 to-red-600 transition-all"
            style={{ width: `${lowest}%` }}
          />
        </div>
      </div>

      {/* Trend */}
      <div className="text-center text-sm">
        Trend:{" "}
        <span
          className={`font-semibold ${
            improving ? "text-green-600" : "text-red-600"
          }`}
        >
          {improving ? "Improving 📈" : "Declining 📉"}
        </span>
        {" • "}Gap: <strong>{gap}%</strong>
      </div>
    </div>
  );
}
