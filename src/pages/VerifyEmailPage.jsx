import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setMessage("No verification token provided.");
      return;
    }
    api.verifyEmail(token)
      .then((data) => {
        setStatus("success");
        setMessage(data.message || "Email verified successfully!");
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err.message || "Verification failed.");
      });
  }, [searchParams]);

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center">
      <div className="w-full max-w-md px-4 text-center space-y-6">
        {status === "loading" && (
          <div className="animate-fade-up opacity-0">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground mt-4">Verifying your email…</p>
          </div>
        )}
        {status === "success" && (
          <div className="animate-fade-up opacity-0 space-y-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-success/20 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-success" />
            </div>
            <h2 className="text-2xl font-heading font-bold">{message}</h2>
            <Link to="/login">
              <Button variant="hero" size="lg" className="text-base mt-4">
                Go to Login
              </Button>
            </Link>
          </div>
        )}
        {status === "error" && (
          <div className="animate-fade-up opacity-0 space-y-4">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
            <h2 className="text-2xl font-heading font-bold">Verification Failed</h2>
            <p className="text-muted-foreground">{message}</p>
            <Link to="/login">
              <Button variant="glass" size="lg" className="text-base mt-4">
                Go to Login
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
