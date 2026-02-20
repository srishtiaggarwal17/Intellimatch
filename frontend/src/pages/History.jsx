import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import MatchCard from "../components/MatchCard";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../hooks/use-toast";
import { Skeleton } from "../components/ui/skeleton";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../components/ui/select";
import { AlertCircle, Upload } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";

export default function History() {
  const [matches, setMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("date");

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    const sorted = [...matches].sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.matchDate) - new Date(a.matchDate);
      }
      return (b.matchResultId?.atsScorePercent || 0) -
             (a.matchResultId?.atsScorePercent || 0);
    });

    setFilteredMatches(sorted);
  }, [matches, sortBy]);

  const loadHistory = async () => {
    try {
      const res = await api.get("/api/user/history");
      setMatches(res.data);
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
          description: "Failed to load match history.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 space-y-6">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-10 w-48" />
          <div className="space-y-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 space-y-8">

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold">Match History</h1>
            <p className="text-muted-foreground text-lg">
              View all your resume matches and analysis results
            </p>
          </div>

          {matches.length > 0 && (
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Sort by Date</SelectItem>
                <SelectItem value="score">Sort by Score</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        {filteredMatches.length === 0 ? (
          <Card className="shadow-card">
            <CardContent className="flex flex-col items-center py-12 text-center">
              <AlertCircle className="h-12 w-12 mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No matches found</h3>
              <p className="text-muted-foreground mb-6">
                Start by uploading your first resume and job description!
              </p>
              <Link to="/upload">
                <Button className="gradient-primary">
                  <Upload className="mr-2 h-4 w-4" />
                  Create First Match
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Showing {filteredMatches.length} matches
            </p>

            {filteredMatches.map(match => (
              <MatchCard key={match._id} match={match} />
            ))}
          </div>
        )}

      </div>
    </Layout>
  );
}
