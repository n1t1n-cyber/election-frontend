import { useState, useEffect } from "react";
import { Check, Vote } from "lucide-react";

const candidates = [
{ name: "Alice Johnson", party: "Progressive", color: "hsl(239, 84%, 67%)" },
{ name: "Bob Martinez", party: "Liberty", color: "hsl(142, 71%, 45%)" },
{ name: "Carol Chen", party: "Green Alliance", color: "hsl(38, 92%, 50%)" }];


const PhoneMockup = () => {
  const [selected, setSelected] = useState(null);
  const [voted, setVoted] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [];
    // Auto-play animation
    timers.push(setTimeout(() => setStep(1), 1000));
    timers.push(setTimeout(() => setSelected(0), 2500));
    timers.push(setTimeout(() => setVoted(true), 4000));
    timers.push(setTimeout(() => {
      setVoted(false);
      setSelected(null);
      setStep(0);
      // restart
      timers.push(setTimeout(() => setStep(1), 500));
      timers.push(setTimeout(() => setSelected(1), 2000));
      timers.push(setTimeout(() => setVoted(true), 3500));
      timers.push(setTimeout(() => {
        setVoted(false);
        setSelected(null);
        setStep(0);
      }, 6000));
    }, 6500));

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="animate-phone-float" style={{ perspective: "1000px" }}>
      <div className="animate-screen-glow rounded-[2.5rem] p-1 bg-gradient-to-b from-border to-border/50">
        <div className="w-[280px] h-[560px] rounded-[2.2rem] bg-background overflow-hidden relative">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-background rounded-b-2xl z-10" />
          
          {/* Status bar */}
          <div className="h-12 flex items-end justify-between px-6 text-xs text-muted-foreground">
            <span>9:41</span>
            <div className="flex gap-1">
              <div className="w-4 h-2 rounded-sm border border-muted-foreground/50" />
            </div>
          </div>

          {/* Screen content */}
          <div className="px-5 pt-4 space-y-4">
            {/* Header */}
            <div className="text-center">
              <div className="w-10 h-10 mx-auto rounded-xl gradient-primary flex items-center justify-center mb-2">
                <Vote className="w-5 h-5 text-primary-foreground" />
              </div>
              <h3 className="font-heading font-bold text-sm text-foreground">General Election 2026</h3>
              <p className="text-xs text-muted-foreground">Select your candidate</p>
            </div>

            {/* Candidates */}
            <div className="space-y-3">
              {candidates.map((c, i) =>
              <div
                key={c.name}
                className={`p-3 rounded-xl border transition-all duration-500 ${
                step >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} ${

                selected === i ?
                "border-primary bg-primary/10 glow-sm" :
                "border-border bg-secondary/30"}`
                }
                style={{ transitionDelay: `${i * 100}ms` }}>
                
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground"
                      style={{ backgroundColor: c.color }}>
                      
                        {c.name[0]}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-foreground">{c.name}</div>
                        <div className="text-[10px] text-muted-foreground">{c.party}</div>
                      </div>
                    </div>
                    {selected === i &&
                  <Check className="w-4 h-4 text-primary animate-count-up" />
                  }
                  </div>
                </div>
              )}
            </div>

            {/* Vote button */}
            {selected !== null && !voted &&
            <div className="animate-count-up">
                <div className="w-full py-3 rounded-xl gradient-primary text-center text-sm font-heading font-semibold text-primary-foreground">
                  Confirm Vote
                </div>
              </div>
            }

            {/* Success */}
            {voted &&
            <div className="text-center space-y-2 animate-count-up">
                <div className="w-12 h-12 mx-auto rounded-full bg-success/20 flex items-center justify-center">
                  <Check className="w-6 h-6 text-success" />
                </div>
                <p className="text-xs font-semibold text-success">Vote Cast Successfully!</p>
              </div>
            }
          </div>
        </div>
      </div>
    </div>);

};

export default PhoneMockup;