import { createOpenAI } from "@ai-sdk/openai";
import { Output, streamText } from "ai";
import { z } from "zod";

const Schema = z.object({
  isGrainImage: z.boolean(),
  healthy: z.boolean(),
  broken: z.number(),
  chalky: z.number(),
  foreign: z.number(),
  immature: z.number(),
  reason: z.string(),
});

export type GrainAssessment = z.infer<typeof Schema>;

export async function runGrainAssessment(imageDataUrl: string, moisture: number) {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("AI is not configured");

  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
  });

  const result = streamText({
    model: provider.responses("openai/gpt-6-astra"),
    maxRetries: 0,
    output: Output.object({ schema: Schema }),
    system:
      "You are a paddy/rice grain quality inspector. Look at the photo of a grain sample and estimate, as percentages of visible kernels (0-100, one decimal), broken kernels, chalky/discolored kernels, foreign matter (stones, husk, weed seeds, debris) and immature/green kernels. Decide 'healthy' = true only if the sample visibly looks clean and sound (roughly: broken <= 10, chalky <= 8, foreign <= 2, immature <= 6, no mould or pest damage). Set isGrainImage=false (and healthy=false) if the photo is not a grain sample. 'reason' is one short plain sentence a farmer can understand.",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: `Moisture probe reading: ${moisture}%. Assess the visible grain health.` },
          { type: "image", image: imageDataUrl },
        ],
      },
    ],
    providerOptions: {
      openai: {
        store: false,
        forceReasoning: true,
        reasoningEffort: "low",
        include: ["reasoning.encrypted_content"],
      },
    },
  });

  const out = (await result.output) as GrainAssessment;
  const clamp = (n: number) => +Math.max(0, Math.min(100, n)).toFixed(1);
  return {
    ...out,
    broken: clamp(out.broken),
    chalky: clamp(out.chalky),
    foreign: clamp(out.foreign),
    immature: clamp(out.immature),
  };
}
