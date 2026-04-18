import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Loader2, Trophy, AlertCircle } from "lucide-react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const chartColors = [
  "hsl(239, 84%, 67%)",
  "hsl(142, 71%, 45%)",
  "hsl(38, 92%, 50%)",
  "hsl(0, 72%, 51%)",
  "hsl(270, 84%, 67%)",
  "hsl(190, 80%, 50%)",
];

const ResultsPage = () => {
  const { token, isLoggedIn, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      navigate("/login");
    }
  }, [authLoading, isLoggedIn, navigate]);

  useEffect(() => {
    if (!token) return;
    api.getElections(token)
      .then((data) => {
        setElections(data);
        const eid = searchParams.get("election");
        if (eid) setSelectedElection(Number(eid));
        else if (data.length > 0) setSelectedElection(data[0].id);
        setLoading(false);
      })
      .catch(() => {
        setError("Cannot connect to server");
        setLoading(false);
      });
  }, [token, searchParams]);

  useEffect(() => {
    if (!selectedElection || !token) return;
    setLoading(true);
    api.getResults(selectedElection, token)
      .then((data) => {
        setResults(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Cannot connect to server");
        setLoading(false);
      });
  }, [selectedElection, token]);

  if (authLoading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isLoggedIn) return null;

  if (error) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  // Backend returns vote_count per candidate
  const doughnutData = results
    ? {
        labels: results.candidates.map((c) => c.name),
        datasets: [
          {
            data: results.candidates.map((c) => c.vote_count),
            backgroundColor: chartColors.slice(0, results.candidates.length),
            borderColor: "hsl(240, 20%, 4%)",
            borderWidth: 3,
          },
        ],
      }
    : null;

  const barData = results
    ? {
        labels: results.candidates.map((c) => c.name),
        datasets: [
          {
            label: "Votes",
            data: results.candidates.map((c) => c.vote_count),
            backgroundColor: chartColors
              .slice(0, results.candidates.length)
              .map((c) => c.replace(")", ", 0.7)")),
            borderColor: chartColors.slice(0, results.candidates.length),
            borderWidth: 2,
            borderRadius: 8,
          },
        ],
      }
    : null;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: "hsl(220, 20%, 75%)", font: { family: "DM Sans" } },
      },
    },
  };

  const barOptions = {
    ...chartOptions,
    scales: {
      x: {
        ticks: { color: "hsl(220, 10%, 55%)" },
        grid: { color: "hsl(240, 15%, 18%)" },
      },
      y: {
        ticks: { color: "hsl(220, 10%, 55%)" },
        grid: { color: "hsl(240, 15%, 18%)" },
        beginAtZero: true,
      },
    },
  };

  // Find the winner (candidate with most votes)
  const winner =
    results && results.candidates.length > 0 && results.total_votes > 0
      ? results.candidates.reduce((prev, curr) =>
          curr.vote_count > prev.vote_count ? curr : prev
        )
      : null;

  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-10 animate-fade-up opacity-0">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
            Election <span className="text-gradient">Results</span>
          </h1>
          <p className="text-muted-foreground">Live results updated in real-time</p>
        </div>

        {elections.length > 1 && (
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2 justify-center">
            {elections.map((e) => (
              <button
                key={e.id}
                onClick={() => setSelectedElection(e.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  selectedElection === e.id
                    ? "gradient-primary text-primary-foreground glow-sm"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {e.title}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : results ? (
          <div className="space-y-8">
            {/* Winner banner */}
            {winner && (
              <div className="gradient-card rounded-2xl border border-primary/30 p-6 text-center glow-sm animate-fade-up opacity-0">
                <Trophy className="w-10 h-10 text-warning mx-auto mb-3" />
                <h2 className="text-2xl font-heading font-bold text-foreground">
                  {winner.name}
                </h2>
                <p className="text-muted-foreground">
                  {winner.party} · {winner.vote_count} votes
                </p>
              </div>
            )}

            {/* Total votes */}
            <div className="text-center">
              <span className="text-4xl font-heading font-bold text-gradient">
                {results.total_votes}
              </span>
              <p className="text-muted-foreground">Total Votes Cast</p>
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="gradient-card rounded-2xl border border-border p-6 animate-fade-up opacity-0 delay-100">
                <h3 className="text-lg font-heading font-semibold mb-4 text-foreground">
                  Vote Distribution
                </h3>
                {doughnutData && <Doughnut data={doughnutData} options={chartOptions} />}
              </div>
              <div className="gradient-card rounded-2xl border border-border p-6 animate-fade-up opacity-0 delay-200">
                <h3 className="text-lg font-heading font-semibold mb-4 text-foreground">
                  Votes by Candidate
                </h3>
                {barData && <Bar data={barData} options={barOptions} />}
              </div>
            </div>

            {/* Candidate list */}
            <div className="space-y-3">
              {results.candidates.map((c, i) => {
                const pct =
                  results.total_votes > 0
                    ? ((c.vote_count / results.total_votes) * 100).toFixed(1)
                    : "0";
                return (
                  <div
                    key={c.id}
                    className="gradient-card rounded-xl border border-border p-4 animate-fade-up opacity-0"
                    style={{ animationDelay: `${(i + 3) * 100}ms` }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: chartColors[i] || chartColors[0],
                          }}
                        />
                        <span className="font-semibold text-foreground">{c.name}</span>
                        <span className="text-sm text-muted-foreground">{c.party}</span>
                      </div>
                      <span className="font-heading font-bold text-foreground">
                        {pct}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: chartColors[i] || chartColors[0],
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ResultsPage;