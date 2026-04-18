import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Check, Vote, AlertCircle, Loader2, LogIn } from "lucide-react";
import { toast } from "sonner";

const VotePage = () => {
  const { token, isLoggedIn, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [votedFor, setVotedFor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState("");

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      navigate("/login");
    }
  }, [authLoading, isLoggedIn, navigate]);

  // Fetch elections
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

  // Fetch candidates + vote status for selected election
  useEffect(() => {
    if (!selectedElection || !token) return;
    setLoading(true);
    Promise.all([
      api.getCandidates(selectedElection, token),
      api.getMyVote(selectedElection, token),
    ])
      .then(([cands, voteStatus]) => {
        setCandidates(cands);
        setHasVoted(voteStatus.has_voted);
        setVotedFor(voteStatus.candidate_id);
        setLoading(false);
      })
      .catch(() => {
        setError("Cannot connect to server");
        setLoading(false);
      });
  }, [selectedElection, token]);

  const handleVote = async () => {
    if (!selectedElection || !selectedCandidate) return;
    setVoting(true);
    try {
      await api.castVote(selectedElection, selectedCandidate, token);
      setHasVoted(true);
      setVotedFor(selectedCandidate);
      toast.success("Vote cast successfully!");
    } catch (err) {
      toast.error(err.message);
    }
    setVoting(false);
  };

  const partyColors = {
    "Progressive Party": "hsl(239, 84%, 67%)",
    "Liberty Party": "hsl(142, 71%, 45%)",
    "Green Alliance": "hsl(38, 92%, 50%)",
  };

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
          <p className="text-sm text-muted-foreground">
            Make sure your backend is running on http://localhost:8000
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="text-center mb-10 animate-fade-up opacity-0">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
            Cast Your <span className="text-gradient">Vote</span>
          </h1>
          <p className="text-muted-foreground">
            Select your candidate and make your voice heard
          </p>
        </div>

        {/* Election selector */}
        {elections.length > 1 && (
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {elections.map((e) => (
              <button
                key={e.id}
                onClick={() => {
                  setSelectedElection(e.id);
                  setSelectedCandidate(null);
                }}
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
        ) : hasVoted ? (
          <div className="text-center space-y-6 animate-fade-up opacity-0">
            <div className="w-20 h-20 mx-auto rounded-full bg-success/20 flex items-center justify-center">
              <Check className="w-10 h-10 text-success" />
            </div>
            <h2 className="text-2xl font-heading font-bold">
              Thank You for Voting!
            </h2>
            <p className="text-muted-foreground">
              You voted for{" "}
              <span className="font-semibold text-foreground">
                {candidates.find((c) => c.id === votedFor)?.name}
              </span>
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {candidates.map((c, i) => (
              <button
                key={c.id}
                onClick={() => setSelectedCandidate(c.id)}
                className={`w-full p-5 rounded-2xl border text-left transition-all duration-300 animate-fade-up opacity-0 ${
                  selectedCandidate === c.id
                    ? "border-primary bg-primary/5 glow-sm"
                    : "border-border gradient-card hover:border-primary/30"
                }`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-primary-foreground shrink-0"
                    style={{
                      backgroundColor:
                        partyColors[c.party] || "hsl(239,84%,67%)",
                    }}
                  >
                    {c.name[0]}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading font-semibold text-foreground">
                      {c.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{c.party}</p>
                    {c.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {c.description}
                      </p>
                    )}
                  </div>
                  {selectedCandidate === c.id && (
                    <Check className="w-6 h-6 text-primary animate-count-up" />
                  )}
                </div>
              </button>
            ))}

            {selectedCandidate && (
              <div className="pt-4 animate-count-up">
                <Button
                  variant="hero"
                  size="lg"
                  className="w-full text-base"
                  onClick={handleVote}
                  disabled={voting}
                >
                  {voting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Vote className="w-5 h-5" /> Confirm Vote
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VotePage;