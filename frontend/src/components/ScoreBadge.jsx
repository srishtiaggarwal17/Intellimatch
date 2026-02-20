export default function ScoreBadge({
  score,
  size = "md",
  showLabel = true,
}) {

  const getScoreColor = score => {
    if (score >= 75) return "text-success";
    if (score >= 50) return "text-warning";
    return "text-destructive";
  };

  const sizeClasses = {
    sm: "h-16 w-16 text-lg",
    md: "h-24 w-24 text-2xl",
    lg: "h-32 w-32 text-4xl",
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">

      <div className={`relative ${sizeClasses[size]}`}>

        <svg
          className="transform -rotate-90"
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-muted opacity-20"
          />

          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`transition-all duration-1000 ease-out ${getScoreColor(score)}`}
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-bold">{score}%</span>
        </div>
      </div>

      {showLabel && (
        <span className="text-sm font-medium text-muted-foreground">
          ATS Score
        </span>
      )}
    </div>
  );
}
