import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";

export function CTA() {
  const navigate = useNavigate();

  return (
    <section className="container mx-auto px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center max-w-3xl mx-auto"
      >
        <Card className="shadow-2xl bg-gradient-to-br from-white/95 via-blue-50/80 to-slate-100/90 border border-slate-200/50 backdrop-blur-md relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-transparent to-slate-400/10" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-300/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-slate-300/20 to-transparent rounded-full blur-3xl" />
          <CardHeader className="pb-8 pt-12">
            <CardTitle className="text-3xl md:text-4xl mb-4">
              Ready to Automate Your Business?
            </CardTitle>
            <CardDescription className="text-lg">
              Join thousands of businesses using ChatFlow AI to scale their social commerce
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-12">
            <Button size="lg" onClick={() => navigate("/auth")} className="shadow-lg bg-slate-900 hover:bg-slate-800 text-white border-0">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              No credit card required • 14-day free trial
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
}
