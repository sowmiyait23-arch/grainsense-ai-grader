import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  imageDataUrl: z.string().startsWith("data:image/").max(8_000_000),
  moisture: z.number().min(5).max(30),
});

export const assessGrainWithAI = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => Input.parse(d))
  .handler(async ({ data }) => {
    const { runGrainAssessment } = await import("./grain-ai.server");
    return runGrainAssessment(data.imageDataUrl, data.moisture);
  });
