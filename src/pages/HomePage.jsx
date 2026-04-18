import { Vote, CheckCircle, Shield, ChevronRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PhoneMockup from "@/components/PhoneMockup";

const HomePage = () => {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-20 lg:py-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-secondary/30 backdrop-blur-sm animate-fade-up opacity-0">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">Secure Digital Voting</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-heading font-bold leading-tight animate-fade-up opacity-0 delay-100">
                Your Vote,{" "}
                <span className="text-gradient">Your Voice</span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-lg animate-fade-up opacity-0 delay-200">
                Cast your vote securely and transparently. Join thousands of citizens shaping the future through digital democracy.
              </p>

              <div className="flex flex-wrap gap-4 animate-fade-up opacity-0 delay-300">
                <Link to="/vote">
                  <Button variant="hero" size="lg" className="text-base">
                    Cast Your Vote <ChevronRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/results">
                  <Button variant="glass" size="lg" className="text-base">
                    View Results
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-4 animate-fade-up opacity-0 delay-400">
                {[
                { value: "10K+", label: "Votes Cast" },
                { value: "99.9%", label: "Uptime" },
                { value: "256-bit", label: "Encrypted" }].
                map((stat) =>
                <div key={stat.label}>
                    <div className="text-2xl font-heading font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Right - Phone Mockup */}
            <div className="flex justify-center lg:justify-end animate-fade-up opacity-0 delay-300">
              <PhoneMockup />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Why Choose <span className="text-gradient">ElectVote</span>?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built with security, transparency, and accessibility at its core.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
            {
              icon: Shield,
              title: "Secure Voting",
              desc: "IP-based verification ensures one vote per person per election."
            },
            {
              icon: CheckCircle,
              title: "Real-time Results",
              desc: "Watch results update live with beautiful interactive charts."
            },
            {
              icon: Vote,
              title: "Easy to Use",
              desc: "Simple, intuitive interface designed for everyone."
            }].
            map((feature, i) =>
            <div
              key={feature.title}
              className="gradient-card rounded-2xl border border-border p-8 hover:border-primary/30 transition-all duration-300 hover:glow-sm group">
              
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>);

};

export default HomePage;