import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    if (!message) {
      return new Response(JSON.stringify({ error: "Message is required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const responses = ["C'est une excellente question ! Laissez-moi vous aider.", "Je vois ce que vous voulez dire. Voici quelques points...", "Tr\u00e8s bonne remarque ! Permettez-moi de vous expliquer.", "Je suis l\u00e0 pour vous accompagner. Pouvez-vous me donner plus de d\u00e9tails ?", "C'est un sujet int\u00e9ressant. Voici ce que je peux vous en dire..."];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    return new Response(JSON.stringify({ message: randomResponse }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch {
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});