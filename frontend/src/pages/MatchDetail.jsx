import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "../components/Layout";
import ScoreBadge from "../components/ScoreBadge";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import api from "../services/api";
import { useToast } from "../hooks/use-toast";
import { Skeleton } from "../components/ui/skeleton";
import { ArrowLeft, CheckCircle2, AlertTriangle, Calendar } from "lucide-react";
import { Badge } from "../components/ui/badge";

export default function MatchDetail() {
  const { matchId } = useParams();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (matchId) loadMatchDetail(matchId);
  }, [matchId]);

  const loadMatchDetail = async (id) => {
    try {
      const res = await api.get(`/api/user/match/${id}`);
      setMatch(res.data);
    } catch (error) {
      if (error?.response?.status === 401) {
        toast({
          title: "Session expired",
          description: "Please login again.",
          variant: "destructive",
        });
        navigate("/login");
      } else {
        toast({
          title: "Error",
          description: "Failed to load match details.",
          variant: "destructive",
        });
        navigate("/history");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) =>
    new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 space-y-8">
          <Skeleton className="h-12 w-64" />
          <div className="grid gap-8 lg:grid-cols-3">
            <Skeleton className="h-64 lg:col-span-1" />
            <Skeleton className="h-64 lg:col-span-2" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!match || !match.matchResultId) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card className="text-center py-12">
            <CardContent>
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-warning" />
              <p>Analysis still in progress. Check again later.</p>
              <Link to="/history">
                <Button className="mt-4">Back to History</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const result = match.matchResultId;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 space-y-8">

        <Link to="/history">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to History
          </Button>
        </Link>

        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold">Match Analysis</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(match.matchDate)}</span>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <Card className="shadow-elegant">
            <CardContent className="flex flex-col items-center py-12">
              <ScoreBadge score={result.atsScorePercent} size="lg" />

              <Badge
                className="mt-4"
                variant={
                  result.atsScorePercent >= 75
                    ? "default"
                    : result.atsScorePercent >= 50
                    ? "secondary"
                    : "destructive"
                }
              >
                {result.atsScorePercent >= 75
                  ? "Excellent Match"
                  : result.atsScorePercent >= 50
                  ? "Good Match"
                  : "Needs Improvement"}
              </Badge>
            </CardContent>
          </Card>

          <Card className="shadow-card lg:col-span-2">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{result.summary}</p>
            </CardContent>
          </Card>
          
        </div>
       <div className="grid gap-8 lg:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex gap-2 text-success">
              <CheckCircle2 className="h-5 w-5" /> What Matched
            </CardTitle>
          </CardHeader>
          <CardContent>
            {result.whatMatched.length === 0 ? (
              <p>No specific matches found.</p>
            ) : (
              result.whatMatched.map((item, i) => (
                <div key={i} className="p-4 mb-3 border rounded-lg bg-success/5">
                  <strong>{item.item}</strong>
                  <p className="text-sm">{item.reason}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex gap-2 text-warning">
              <AlertTriangle className="h-5 w-5" /> What is Missing
            </CardTitle>
          </CardHeader>
          <CardContent>
            {result.whatIsMissing.length === 0 ? (
              <p>Your resume covers all key requirements!</p>
            ) : (
              result.whatIsMissing.map((item, i) => (
                <div key={i} className="p-4 mb-3 border rounded-lg bg-warning/5">
                  <strong>{item.item}</strong>
                  <p className="text-sm">{item.recommendation}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
       </div>

      </div>
    </Layout>
  );
}
