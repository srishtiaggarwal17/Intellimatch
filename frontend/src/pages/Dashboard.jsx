import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import MatchCard from "../components/MatchCard";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../hooks/use-toast";
import { Skeleton } from "../components/ui/skeleton";
import { Upload, TrendingUp, FileCheck, AlertCircle } from "lucide-react";
import ATSChart from "../components/ATSChart";
import ATSHistogram from "../components/ATSHistogram";
import CountUp from "react-countup";
import ATSScoreRange from "../components/ATSScoreRange";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [userRes, matchRes] = await Promise.all([
        api.get("/api/user/get"),
        api.get("/api/user/history"),
      ]);

      setUser(userRes.data);

      const sortedMatches = matchRes.data.sort(
        (a, b) => new Date(b.matchDate) - new Date(a.matchDate)
      );

      setMatches(sortedMatches);
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
          description: "Failed to load dashboard data.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const completedMatches = matches.filter(m => m.matchResultId);

  const avgScore =
    completedMatches.length > 0
      ? Math.round(
          completedMatches.reduce(
            (sum, m) => sum + (m.matchResultId?.atsScorePercent || 0),
            0
          ) / completedMatches.length
        )
      : 0;

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 space-y-8">
          <Skeleton className="h-12 w-64" />
          <div className="grid gap-6 md:grid-cols-3">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <Skeleton className="h-80" />
            <Skeleton className="h-80" />
            <Skeleton className="h-80" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 space-y-8">

        <div className="space-y-2">
          <h1 className="text-4xl font-bold">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-muted-foreground text-lg">
            Track your resume matches and optimize for ATS success
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="shadow-card hover:shadow-elegant transition rounded-xl">

            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Matches
              </CardTitle>
              <FileCheck className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{matches.length}</div>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elegant transition rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Average ATS Score
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                <CountUp end={avgScore} duration={1.2} />%
              </div>

            </CardContent>
          </Card>

          <Card className="shadow-card gradient-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="text-sm font-medium opacity-90">
                Ready to improve?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Link to="/upload">
                <Button variant="secondary" className="w-full">
                  <Upload className="mr-2 h-4 w-4" />
                  New Match
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="shadow-card p-6 hover:-translate-y-1 transition-all duration-300">
            <h3 className="font-semibold mb-4">ATS Score Progress</h3>
            <ATSChart matches={completedMatches} />
          </Card>

          <Card className="shadow-card p-6 hover:-translate-y-1 transition-all duration-300">
            <h3 className="font-semibold mb-4">ATS Score Spread</h3>
            <ATSHistogram matches={completedMatches} />
          </Card>

          <Card className="shadow-card p-6">
  <h3 className="font-semibold mb-4">Performance Range</h3>
  <ATSScoreRange matches={completedMatches} />
</Card>

       
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Recent Matches</h2>

          {matches.length === 0 ? (
            <Card className="shadow-card">
              <CardContent className="flex flex-col items-center py-12 text-center">
                <AlertCircle className="h-12 w-12 mb-4 text-muted-foreground" />
                <p>No matches yet. Upload your first resume!</p>
              </CardContent>
            </Card>
          ) : (
            matches.slice(0, 3).map(match => (
              <MatchCard key={match._id} match={match} />
            ))
          )}
        </div>

      </div>
    </Layout>
  );
}
