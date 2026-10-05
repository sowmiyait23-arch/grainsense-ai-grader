# GrainSense AI

Build a responsive web application called GrainSense AI — an AI-based paddy grain quality grading system for farmers, FPOs, and procurement centers, developed as an MSME Idea Hackathon 5.0 submission. Use React + TypeScript with Tailwind CSS, and Supabase for auth, database, and file storage.

Core purpose: Users upload a photo of a paddy/rice grain sample (or capture via mobile camera), and the system returns an AI-generated quality grade combining visual defect analysis and moisture sensor data.

Pages/screens needed:

Landing page — hero section explaining the problem (manual grain grading is slow, inconsistent, subjective), how GrainSense AI solves it (CNN-based instant grading + embedded moisture sensor), and a "Try it now" CTA. Include a "How it works" 3-step visual (Upload → AI analyzes → Get graded report).

Upload & analyze page — drag-and-drop image upload zone plus a mobile camera-capture option. A field to enter or auto-fetch moisture sensor reading (%, numeric input for now — treat as a placeholder for hardware integration). "Analyze" button triggers a mock/placeholder API call (structure it so a real CNN inference endpoint can be swapped in later).

Results/report page — display:

Overall grade (e.g., Grade A / B / C / Reject) as a prominent badge

Defect breakdown with percentages: broken grains, chalky/discolored grains, foreign matter, immature grains — shown as a bar or donut chart

Moisture level with a safe/unsafe threshold indicator (paddy safe storage moisture is typically ~14%)

A combined quality score

Downloadable/shareable PDF-style summary card

History dashboard — table/card list of past scans (thumbnail, date, grade, moisture %), filterable by grade or date.

Language toggle — Tamil and English at minimum, switchable from a header control; keep all UI strings in a translation config so more languages can be added later.

Design direction: Clean agri-tech look — earthy green and warm neutral palette, not overly corporate. Mobile-first (many users will be on phones in the field), large tap targets, works well on slower connections. Avoid clutter — this needs to demo well to hackathon judges in under a minute.

Non-functional notes: Structure the image-analysis and moisture-reading calls as clearly separated service functions/API stubs so the actual CNN model (likely a separate Python/FastAPI backend) and real moisture sensor hardware can be plugged in without restructuring the frontend.create a website input to upload image of paddy output is qualified or not qualified based on moistures contain in dha image analayze by CNN

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://grainsense-ai-grader.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a1968941-96c2-4f61-a769-968ebc933b9b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
