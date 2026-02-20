// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   Cell,
// } from "recharts";

// const COLORS = ["#f96363", "#f49e60", "#eac452", "#69df94"];

// export default function ATSHistogram({ matches }) {
//   const buckets = {
//     "0-30": 0,
//     "31-50": 0,
//     "51-70": 0,
//     "71-100": 0,
//   };

//   matches.forEach(m => {
//     const s = m.matchResultId?.atsScorePercent || 0;
//     if (s <= 30) buckets["0-30"]++;
//     else if (s <= 50) buckets["31-50"]++;
//     else if (s <= 70) buckets["51-70"]++;
//     else buckets["71-100"]++;
//   });

//   const data = Object.entries(buckets).map(([range, count]) => ({
//     range,
//     count,
//   }));

//   return (
//     <div className="h-64 w-full">
//       <ResponsiveContainer>
//         <BarChart data={data}>
//           <XAxis dataKey="range" />
//           <YAxis allowDecimals={false} />
//           <Tooltip />
//           <Bar dataKey="count" radius={[10, 10, 0, 0]}>
//             {data.map((_, i) => (
//               <Cell key={i} fill={COLORS[i]} />
//             ))}
//           </Bar>
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";

const COLORS = ["#f96363", "#f49e60", "#eac452", "#69df94"];

export default function ATSHistogram({ matches }) {
  const buckets = {
    "0-30": 0,
    "31-50": 0,
    "51-70": 0,
    "71-100": 0,
  };

  matches.forEach(m => {
    const s = m.matchResultId?.atsScorePercent || 0;
    if (s <= 30) buckets["0-30"]++;
    else if (s <= 50) buckets["31-50"]++;
    else if (s <= 70) buckets["51-70"]++;
    else buckets["71-100"]++;
  });

  const data = Object.entries(buckets).map(([range, count]) => ({
    range,
    count,
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="range" />

          <YAxis
            allowDecimals={false}
            tickCount={6}
            domain={[0, "dataMax + 2"]}
          />

          <Tooltip />

          <Bar dataKey="count" radius={[10, 10, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i]} />
            ))}
          </Bar>

        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
