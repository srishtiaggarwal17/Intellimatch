// import {
//   Chart as ChartJS,
//   LineElement,
//   PointElement,
//   LinearScale,
//   CategoryScale,
//   Tooltip,
// } from "chart.js";
// import { Line } from "react-chartjs-2";

// ChartJS.register(
//   LineElement,
//   PointElement,
//   LinearScale,
//   CategoryScale,
//   Tooltip
// );

// export default function ATSChart({ matches }) {
//     const sorted = [...matches].sort(
//        (a, b) => new Date(a.matchDate) - new Date(b.matchDate)
//     );
//     const data = {
//     labels: sorted.map(m =>
//       new Date(m.matchDate).toLocaleDateString()
//     ),
//     datasets: [
//       {
//         label: "ATS Score",
//         data: sorted.map(m => m.matchResultId?.atsScorePercent || 0),
//         borderColor: "#2563eb",
//         backgroundColor: "rgba(37,99,235,0.2)",
//         tension: 0.4,
//         fill: true,
//         pointRadius: 5,
//       },
//     ],
//   };

//   return (
//     <Line
//       data={data}
//       options={{
//         responsive: true,
//         plugins: { legend: { display: false } },
//         scales: { y: { min: 0, max: 100 } },
//       }}
//     />
//   );
// }

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler
);

export default function ATSChart({ matches }) {
  const sorted = [...matches].sort(
    (a, b) => new Date(a.matchDate) - new Date(b.matchDate)
  );

  const scores = sorted.map(m => m.matchResultId?.atsScorePercent || 0);

  const data = {
    labels: sorted.map(m =>
      new Date(m.matchDate).toLocaleDateString()
    ),
    datasets: [
      {
        data: scores,
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.18)",
        fill: true,
        tension: 0.45,
        pointRadius: ctx =>
          ctx.dataIndex === scores.length - 1 ? 7 : 4,
        pointBackgroundColor: "#2563eb",
      },
    ],
  };

  return (
    <Line
      data={data}
      options={{
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => `ATS Score: ${ctx.raw}%`,
            },
          },
        },
        scales: {
          y: { min: 0, max: 100, ticks: { stepSize: 20 } },
        },
      }}
    />
  );
}

