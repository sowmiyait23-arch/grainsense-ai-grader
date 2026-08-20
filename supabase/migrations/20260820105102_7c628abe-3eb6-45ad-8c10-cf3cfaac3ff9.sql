CREATE TABLE public.grain_scans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id TEXT NOT NULL,
  image_url TEXT,
  moisture NUMERIC NOT NULL,
  grade TEXT NOT NULL,
  quality_score NUMERIC NOT NULL,
  qualified BOOLEAN NOT NULL DEFAULT false,
  broken_pct NUMERIC NOT NULL DEFAULT 0,
  chalky_pct NUMERIC NOT NULL DEFAULT 0,
  foreign_pct NUMERIC NOT NULL DEFAULT 0,
  immature_pct NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.grain_scans TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.grain_scans TO authenticated;
GRANT ALL ON public.grain_scans TO service_role;

ALTER TABLE public.grain_scans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create a scan" ON public.grain_scans FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can read scans" ON public.grain_scans FOR SELECT TO anon, authenticated USING (true);

CREATE INDEX grain_scans_device_idx ON public.grain_scans (device_id, created_at DESC);