import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const principles = [
  {
    title: "A program, not a playlist",
    body: "State a goal and receive a structured program of study — modules, objectives, and the order to learn them in. Like a syllabus, not a to-do list.",
  },
  {
    title: "The best free resources, verified",
    body: "University lectures, open textbooks, documentation, and projects — curated for quality and checked to be real and free before they reach you.",
  },
  {
    title: "Mastery, not completion",
    body: "You prove understanding after engaging each resource. Mastery is tracked per concept and fades if unused — so it reflects what you actually know.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
          <span className="font-serif text-lg font-semibold tracking-tight">
            Smarty&nbsp;Pants
          </span>
          <span className="text-muted-foreground text-sm">
            a personalized university
          </span>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        {/* Hero */}
        <section className="mx-auto w-full max-w-5xl px-6 py-20 sm:py-28">
          <p className="text-muted-foreground mb-5 text-sm font-medium uppercase tracking-[0.18em]">
            Curriculum architect · not a tutor
          </p>
          <h1 className="max-w-3xl text-balance text-4xl font-semibold leading-[1.1] tracking-tight sm:text-6xl">
            Reach genuine mastery of{" "}
            <span className="italic">any subject.</span>
          </h1>
          <p className="text-muted-foreground mt-6 max-w-2xl text-lg leading-relaxed">
            Smarty Pants is not another chatbot. It uses AI to design your
            program of study and curate the world&rsquo;s best free resources —
            then gets out of the way so you can read, watch, build, and
            practice. The AI reduces the work of organizing learning, never the
            work of thinking.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/sign-up">Begin your program</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#how-it-works">How it works</Link>
            </Button>
          </div>
        </section>

        {/* Principles */}
        <section
          id="how-it-works"
          className="border-t bg-secondary/40"
        >
          <div className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-20">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              How it works
            </h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              {principles.map((p) => (
                <Card key={p.title} className="bg-card/80">
                  <CardHeader>
                    <CardTitle className="font-serif text-xl">
                      {p.title}
                    </CardTitle>
                    <CardDescription className="mt-2 text-base leading-relaxed">
                      {p.body}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="text-muted-foreground mx-auto flex w-full max-w-5xl flex-col gap-1 px-6 py-8 text-sm sm:flex-row sm:items-center sm:justify-between">
          <span>Smarty Pants — working title.</span>
          <span>Prioritize genuine learning over convenience.</span>
        </div>
      </footer>
    </div>
  );
}
