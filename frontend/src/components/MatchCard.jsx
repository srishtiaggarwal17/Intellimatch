import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ArrowRight, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

export default function MatchCard({ match }) {

  const getScoreVariant = score => {
    if (score >= 75) return "bg-green-500";
    if (score >= 40) return "bg-yellow-400";
    return "bg-red-500";
  };


  const score = match.matchResultId?.atsScorePercent || 0;

  const formatDate = dateString =>
    new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));

  return (
    <Card className="hover:shadow-elegant transition-all group">
      <CardContent className="p-6">

        <div className="flex justify-between gap-4">

          <div className="space-y-3 flex-1">

            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-lg">
                {match.resumeName || `Match #${match._id?.slice(0, 8)}`}
              </h3>
              <Badge variant={match.matchResultId ? "outline" : "secondary"}>
                {match.matchResultId ? "completed" : "processing"}
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(match.matchDate)}</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                ATS Score:
              </span>

              <div className="flex items-center gap-2">
                <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${getScoreVariant(score)}`}
                    style={{ width: `${score}%` }}
                  />
                </div>
                <span className="font-bold text-sm">
                  {score}%
                </span>
              </div>
            </div>
          </div>

          <Link to={`/match/${match._id}`}>
            <Button
              variant="ghost"
              size="sm"
              className="group-hover:bg-primary group-hover:text-primary-foreground"
            >
              View
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>

        </div>

      </CardContent>
    </Card>
  );
}
