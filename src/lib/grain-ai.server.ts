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

export async function runGrainAssessment(imageDataUrl: string) {
  const apiKey = process.env["LOVABLE_API_KEY"];
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
    system: [
      "You are a certified paddy (Oryza sativa) grain quality inspector following FCI / BIS paddy grading practice.",
      "STEP 1 - GATE: Decide if the photo shows a sample of PADDY or RICE kernels (rough paddy with golden/brown husk, brown rice, or milled white rice kernels: slender/medium/bold elongated grains, 5-8 mm, with husk ridges or smooth translucent endosperm).",
      "Set isGrainImage=false for ANYTHING else: wheat, maize, barley, millets, sorghum, pulses/dal, beans, seeds, sand, soil, food dishes, cooked rice, paddy plants/fields, people, animals, documents, screenshots, blurry or unclear photos. When false, set healthy=false, all percentages 0, and reason explaining what you see instead.",
      "STEP 2 - GRADE (only if paddy/rice): estimate as percentages of visible kernels (0-100, one decimal): broken (kernels < 3/4 full length, fragments), chalky (opaque white belly/core or discoloured/yellow/black-tipped), foreign (stones, mud balls, straw, chaff, weed seeds, other grains), immature (green, shrivelled, thin or empty husks).",
      "healthy=true only if: broken <= 10, chalky <= 8, foreign <= 2, immature <= 6, and no mould, insect holes or pest damage.",
      "'reason' is one short plain sentence a farmer can understand.",
    ].join(" "),
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "Assess the visible grain health of this sample." },
          { type: "file", mediaType: "image/jpeg", data: imageDataUrl },
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
